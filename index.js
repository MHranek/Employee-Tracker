// Requires
const mysql2 = require('mysql2');
const inquirer = require('inquirer');


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
            'Update an employee role'
        ]
    }
]

const addDepartmentsQuestions = [
    {
        name: 'name',
        type: 'input',
        message: "What is department's name?"
    }
]

const addRoleQuestions = [
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
        choices: ['Default'] // TODO get current departments and add these to the choices
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

const start = function() {
    inquirer.prompt(firstQueryQuestions).then(data => {
        // Depending on user's choice either return corresponding data or prompt corresponding questions
        switch (data.option) {
            case 'View all departments':
                // TODO log all departments
                break;
            case 'View all roles':
                // TODO log all roles
                break;
            case 'View all employees':
                // TODO log all employees
                break;
            case 'Add a department':
                // TODO prompt user for a department name
                break;
            case 'Add a role':
                // TODO prompt user for a role
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
                break;
        }
    }).catch(err => console.error(err))
}

start();