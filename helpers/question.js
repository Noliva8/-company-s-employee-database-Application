const { Pool } = require('pg');

// Connect to the database
const pool = new Pool({
    user: 'hope-506044',
    password: 'Mutoni@2035',
    host: 'localhost',
    database: 'employees_db'
});
// ------------------------------------------------------------------

// Function to get department choices dynamically
function getDepartmentChoices() {
    return pool.query('SELECT * FROM departments')
        .then(result => result.rows.map(row => ({ name: row.name, value: row.department_id })))
        .catch(err => console.error('Error fetching departments', err.stack));
}
// end
// ------------------------------------------------------------------

// Function to get roles dynamically
function getRolesChoices() {
    return pool.query('SELECT * FROM roles')
        .then(result => result.rows.map(row => ({ name: row.title, value: row.role_id })))
        .catch(err => console.error('Error fetching roles', err.stack));
}

// end
// ------------------------------------------------------------------


// Function to get employee managers dynamically
function getEmployeeManagersChoices() {
    return pool.query('SELECT  manager_id , name FROM managers ')
        .then(result => result.rows.map(manager => ({
            name: `${manager.name}`,
            value: manager.manager_id 
        })))
        .catch(err => console.error('Error fetching managers:', err.stack));
}

// end
// ------------------------------------------------------------------

// Function to get employee choices dynamically

const getEmployeeChoicesss = () => {
    const query = "SELECT employee_id, firstName ||' '|| lastName AS name FROM employees";
    return pool.query(query)
        .then(result => result.rows.map(row => ({ name: row.name, value: row.employee_id })))
        .catch(err => {
            console.error('Error fetching employee choices', err.stack);
            throw err;
        });
};

// end
// ------------------------------------------------------------------

// QUESTIONS
// --------


// a) Questions for the main menu
// ----------------------------

const mainQuestions = [
    {
        type: 'list',
        name: 'employees',
        message: 'What would you like to do?',
        choices: [
            'Add employee',
            'View all employees',
            'Update employee role',
            'View all roles',
            'Add role',
            'View all departments',
            'Add department',
            'Quit'
        ]
    }
];

// b) Questions for adding a department
// -----------------------------------

const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
        validate: (answer) => {
            if (!answer) {
                return 'Please add a department name';
            }
            return true;
        }
    }
];


// c) Function to get role-related questions with dynamic department choices
// ---------------------------------------------------------------------

function getAddRoleQuestions() {
    return getDepartmentChoices()
        .then(departments => [
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the role?',
                validate: (answer) => {
                    if (!answer) {
                        return 'Please add a role name';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return 'The salary must be a number';
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: departments
            }
        ])
        .catch(err => console.error('Error fetching department choices', err.stack));
}



// d) Function to get employee-related questions with dynamic role and manager choices
// ---------------------------------------------------------------------

function addEmployeeQuestions() {
    return Promise.all([getRolesChoices(), getEmployeeManagersChoices()])
        .then(([roles, managers]) => [
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: (answer) => {
                    if (!answer) {
                        return "Please add the employee's first name";
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: (answer) => {
                    if (!answer) {
                        return "Please add the employee's last name";
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
            },
            {
                type: 'list',
                name: 'employeeManager',
                message: "Who is the employee's manager?",
                choices: managers
            }
        ])
        .catch(err => console.error('Error fetching role or manager choices', err.stack));
}




// e) Function to get questions for updating an employee's role
// ---------------------------------------------------------------------

function updateEmployeeRoleQuestions() {
    return Promise.all([getEmployeeChoicesss(), getRolesChoices()])
        .then(([employees, roles]) => [
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's role do you want to update?",
                choices: employees
            },
            {
                type: 'list',
                name: 'newRole',
                message: 'Which role do you want to assign to the selected employee?',
                choices: roles
            }
        ])
        .catch(err => console.error('Error fetching employee or role choices', err.stack));
}


// exports


module.exports = {
    mainQuestions,
    addDepartmentQuestions,
    getAddRoleQuestions,
    addEmployeeQuestions,
    updateEmployeeRoleQuestions
};
