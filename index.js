// Requires
const mysql = require('mysql2');
const inquirer = require('inquirer');
const res = require('express/lib/response');

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

const addEmployeeQuestions = [
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
        choices: ['Default'] // TODO get current roles and add these to the choices
    },
    {
        name: 'manager',
        type: 'input',
        message: "Who is the employee's manager?"
    }
]

const updateEmployeeQuestions = [
    {
        name: 'employee',
        type: 'list',
        message: "Which employee do you want to update?",
        choices: ['Default'] // TODO get current employees and add these to the choices
    }
]

const startQuestions = function() {
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
                db.query('SELECT employees.first_name, employees.last_name, roles.title AS Role, roles.salary, departments.department_name AS Department FROM employees INNER JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON departments.id = roles.department_id;', function (err, results) {
                    if(err) {
                        console.error(err);
                    } else {
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
                // TODO prompt user for a role
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
                        choices: getDepartments() // TODO get current departments and add these to the choices
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
                // TODO prevent adding roles unless at least one department exists
                break;
            case 'Add an employee':
                // TODO prompt user for an employee
                // TODO prevent adding employees unless at least one role exists
                break;
            case 'Update an employee role':
                // TODO prompt user for an employee to update their role
                break;
            default:
                process.exit();
                break;
        }
    }).catch(err => console.error(err))
}

startQuestions();