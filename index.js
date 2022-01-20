// Requires
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Mysql connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'B00tc@mp',
        database: 'employees_db'
    },
    console.log('Employee Manager')
);

// Get current departments, returns array of strings
const getDepartments = function () {
    const departmentList = [];
    db.query('SELECT departments.id, departments.department_name AS department FROM departments;', function (err, results) {
        if(err) {
            console.error(err);
        } else {
            for (let i = 0; i < results.length; i++) {
                const departmentName = results[i].id + ' ' + results[i].department;
                departmentList.push(departmentName);
            }
        }
    });
    return departmentList;
};

// Get current roles, returns array of strings
const getRoles = function () {
    const rolesList = [];
    db.query('SELECT roles.id, roles.title, roles.salary, departments.department_name AS department FROM roles JOIN departments ON departments.id = roles.department_id ORDER BY roles.id;', function (err, results) {
        if(err) {
            console.error(err);
        } else {
            for (let i = 0; i < results.length; i++) {
                const roleName = results[i].id + ' ' + results[i].title;
                rolesList.push(roleName);
            }
        }
    });
    return rolesList;
};

// Get current employees, returns array of
const getEmployees = function (nA = null) {
    const employeesList = [];
    if(nA) {
        employeesList.push('None');
    }
    db.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role FROM employees INNER JOIN roles ON roles.id = employees.role_id;', function (err, results) {
        if(err) {
            console.error(err);
        } else {
            for (let i = 0; i < results.length; i++) {
                const employeeName = results[i].id + ' ' + results[i].first_name + ' ' + results[i].last_name;
                employeesList.push(employeeName);
            }
        }
    });
    return employeesList;
};

// initial command line query
// view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const firstQueryQuestions = [
    {
        name: 'option',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Quit'
        ]
    }
]

const startQuestions = function() {
    // Update questions here because first question of a prompt hangs and stalls program if it retrieves choices via function call
    const updateQuestions = [
        {
            name: 'employee',
            type: 'list',
            message: "Which employee do you want to update?",
            choices: getEmployees() // get current employees and add these to the choices
        },
        {
            name: 'newRole',
            type: 'list',
            message: "What role should this employee now have?",
            choices: getRoles()
        }
    ];
    inquirer.prompt(firstQueryQuestions).then(data => {
        // Depending on user's choice either return corresponding data or prompt corresponding questions
        switch (data.option) {
            case 'View all departments':
                // log all departments
                db.query('SELECT departments.id, departments.department_name AS Department FROM departments ORDER BY departments.id;', function (err, results) {
                    if(err) {
                        console.error(err);
                    } else {
                        console.log('');
                        console.table(results);
                        startQuestions();
                    }
                });
                break;
            case 'View all roles':
                // log all roles
                db.query('SELECT roles.id, roles.title, roles.salary, departments.department_name AS Department FROM roles JOIN departments ON departments.id = roles.department_id ORDER BY roles.id;', function (err, results) {
                    if(err) {
                        console.error(err);
                    } else {
                        console.log('');
                        console.table(results);
                        startQuestions();
                    }
                });
                break;
            case 'View all employees':
                // log all employees
                db.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary, departments.department_name AS department, manager.first_name AS manager, manager.last_name AS name FROM employees employee INNER JOIN roles ON roles.id = employee.role_id INNER JOIN departments ON departments.id = roles.department_id LEFT OUTER JOIN employees manager ON employee.manager_id = manager.id ORDER BY id;', function (err, results) {
                    if(err) {
                        console.error(err);
                    } else {
                        // combign manager's first and last name and delete the last name column
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].manager != null) {
                                results[i].manager = results[i].manager + ' ' + results[i].name;
                            }
                            delete results[i].name;
                        }
                        console.log('');
                        console.table(results);
                        startQuestions();
                    }
                });
                break;
            case 'Add a department':
                // prompt user for a department name
                inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: "What is department's name?"
                }]).then(data => {
                    // Add user's response as a department in the database
                    db.query('INSERT INTO departments (department_name) VALUES (?);', [data.name], function (err, result) {
                        if(err) {
                            console.error(err);
                        } else {
                            console.log('');
                            console.log(`Created ${data.name} department`);
                            startQuestions();
                        }
                    });
                }).catch(err => console.error(err))
                break;
            case 'Add a role':
                // prompt user for a role
                inquirer.prompt([
                    {
                        name: 'name',
                        type: 'input',
                        message: "What is the role's name?"
                    },
                    {
                        name: 'salary',
                        type: 'number',
                        message: "What is the role's salary?"
                    },
                    {
                        name: 'department',
                        type: 'list',
                        message: "What is the role's department?",
                        choices: getDepartments() // get current departments and add these to the choices
                    }
                ]).then(data => {
                    // Add user's response as a role in the database
                    const departmentID = data.department.split(' ')[0];
                    db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);', [data.name, data.salary, departmentID], function (err, result) {
                        if(err) {
                            console.error(err);
                        } else {
                            console.log('');
                            console.log(`Created ${data.name} role`);
                            startQuestions();
                        }
                    });
                }).catch(err => console.error(err))
                break;
            case 'Add an employee':
                // prompt user for an employee
                inquirer.prompt([
                    {
                        name: 'firstName',
                        type: 'input',
                        message: "What is the employee's first name?"
                    },
                    {
                        name: 'lastName',
                        type: 'input',
                        message: "What is the employee's last name?"
                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: "What is the employee's role?",
                        choices: getRoles() // get current roles and add these to the choices
                    },
                    {
                        name: 'manager',
                        type: 'list',
                        message: "Who is the employee's manager?",
                        choices: getEmployees('None')
                    }
                ]).then(data => {
                    // Add user's response as an employee in the database
                    const roleID = data.role.split(' ')[0];
                    let managerID = data.manager.split(' ')[0];
                    if (managerID == 'None') {
                        managerID = null;
                    }
                    db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [data.firstName, data.lastName, roleID, managerID], function (err, result) {
                        if(err) {
                            console.error(err);
                        } else {
                            console.log('');
                            console.log(`Created ${data.firstName, data.lastName} employee`);
                            startQuestions();
                        }
                    });
                }).catch(err => console.error(err))
                break;
            case 'Update an employee role':
                // prompt user for an employee to update their role
                inquirer.prompt(updateQuestions).then(data => {
                    const employeeID = data.employee.split(' ');
                    const role = data.newRole.split(' ')[0];
                    db.query('UPDATE employees SET employees.role_id = ? WHERE id = ?', [role, employeeID[0]], function (err, result) {
                        if(err) {
                            console.error(err);
                        } else {
                            console.log('');
                            console.log(`Updated info for ${employeeID[1], employeeID[2]}`);
                        }
                        startQuestions();
                    });
                }).catch(err => console.error(err));
                break;
            default:
                process.exit();
                break;
        }
    }).catch(err => console.error(err))
}

startQuestions();