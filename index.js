// Requires
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const { first } = require('lodash');

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

inquirer.prompt(firstQueryQuestions).then(data => {
    console.log(data);
}).catch(err => console.error(err))