const express = require('express');
const { Pool } = require('pg');
const inquirer = require('inquirer');
const cTable = require('console.table');

const { 
    mainQuestions,
    addDepartmentQuestions,
    getAddRoleQuestions,
    addEmployeeQuestions,
    updateEmployeeRoleQuestions
} = require('./helpers/question');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to the database
// ----------------------
const pool = new Pool({
    user: 'hope-506044',
    password: 'Mutoni@2035',
    host: 'localhost',
    database: 'employees_db'
});

pool.connect();
   

   app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// Function to handle user prompts and database interactions
// ------------------------------------------------------
const askQuestion = () => {
    inquirer.prompt(mainQuestions).then((answers) => {
        switch (answers.employees) {
            case "View all departments":
                viewAllDepartments();
                break;

            case "View all roles":
                viewAllRoles();
                break;

            case "View all employees":
                viewAllEmployees();
                break;



            case "Add department":
                addDepartment();
                break;

            case "Add role":
                addRole();
                break;

            case "Add employee":
                addEmployee();
                break;

            case "Update employee role":
                updateEmployeeRole();
                break;

            case "Quit":
                console.log("Exiting application...");
                pool.end();  // Close the database connection
                process.exit();
                break;

            default:
                console.log("Invalid choice, please try again.");
                askQuestion();
                break;
        }
    });
};
// end
// -------------------------------------------------------------------------------------


// 1) Function to view all departments
// -----------------------------------

const viewAllDepartments = () => {
    const query = 'SELECT department_id AS id, name FROM departments;';
    pool.query(query)
        .then(result => {
            console.table(result.rows);
            askQuestion();
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            askQuestion();
        });
};


// 2) Function to view all roles
// ---------------------------
const viewAllRoles = () => {
    const query = `
        SELECT roles.role_id AS roleid, 
               roles.title AS title, 
               departments.name AS department, 
               salaries.salary AS salary 
        FROM roles 
        JOIN departments ON roles.department_id = departments.department_id 
        JOIN salaries ON roles.salary_id = salaries.salary_id
        ORDER BY roles.role_id;
    `;
    pool.query(query)
        .then(result => {
            console.table(result.rows);
            askQuestion();
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            askQuestion();
        });
};


// 3) Function to view all employees
// -----------------------------

const viewAllEmployees = () => {
    const query = `
        SELECT e1.employee_id, e1.firstName AS first_name, e1.lastName AS last_name, r.title, d.name AS department, s.salary, 
               CONCAT(e2.firstName, ' ', e2.lastName) AS manager
        FROM employees e1
        LEFT JOIN roles r ON e1.role_id = r.role_id
        LEFT JOIN departments d ON r.department_id = d.department_id
        LEFT JOIN salaries s ON r.salary_id = s.salary_id
        LEFT JOIN employees e2 ON e1.manager_id = e2.employee_id
        ORDER BY e1.employee_id;
    `;
    pool.query(query)
        .then(result => {
            console.table(result.rows);
            askQuestion(); // Go back to main menu after displaying the employees
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            askQuestion(); // Go back to main menu on error
        });
};


// 4) Function to add a department
// ------------------------------

const addDepartment = () => {
    inquirer.prompt(addDepartmentQuestions).then(result => {
        const departmentName = result.departmentName;
        const query = 'INSERT INTO departments (name) VALUES ($1) RETURNING *';
        pool.query(query, [departmentName])
            .then(result => {
                console.log(`Added ${result.rows[0].name} to the database`);
                askQuestion();
            })
            .catch(err => {
                console.error('Error executing query', err.stack);
                askQuestion();
            });
    });
};


// 5) Function to add a role
// -------------------------

const addRole = () => {
    getAddRoleQuestions()
        .then(questions => {
            inquirer.prompt(questions).then(result => {
                const roleName = result.roleName;
                const salary = result.salary;
                const departmentId = result.department;

                const addSalaryQuery = 'INSERT INTO salaries (salary) VALUES ($1) RETURNING salary_id';
                pool.query(addSalaryQuery, [salary])
                    .then(salaryResult => {
                        const salaryId = salaryResult.rows[0].salary_id;
                        const addRoleQuery = 'INSERT INTO roles (title, department_id, salary_id) VALUES ($1, $2, $3) RETURNING *';
                        pool.query(addRoleQuery, [roleName, departmentId, salaryId])
                            .then(roleResult => {
                                console.log(`Added role ${roleName} to the database`);
                                askQuestion();
                            })
                            .catch(err => {
                                console.error('Error executing query', err.stack);
                                askQuestion();
                            });
                    })
                    .catch(err => {
                        console.error('Error executing query', err.stack);
                        askQuestion();
                    });
            });
        })
        .catch(err => {
            console.error('Error fetching department choices', err.stack);
            askQuestion();
        });
};






// 6) Function to add an employee
// ------------------------------

const addEmployee = () => {
    addEmployeeQuestions()
        .then(questions => {
            inquirer.prompt(questions).then(result => {
                console.log('Employee Data:', result); 
                const { firstName, lastName, role, employeeManager } = result;  // Correct variable names
                const insertEmployeeQuery = 'INSERT INTO employees (firstName, lastName, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *';
                pool.query(insertEmployeeQuery, [firstName, lastName, role, employeeManager])
                    .then(employeeResult => {
                        console.log(`Added employee ${firstName} ${lastName} to the database`);
                        // Fetch and display the updated list of employees
                        viewAllEmployees();
                    })
                    .catch(err => {
                        console.error('Error executing query', err.stack);
                        askQuestion(); // Go back to main menu on error
                    });
            });
        })
        .catch(err => {
            console.error('Error fetching role or manager choices', err.stack);
            askQuestion(); 
        });
};



// Function to update an employee's role
// ------------------------------------

const updateEmployeeRole = () => {
    updateEmployeeRoleQuestions()
        .then(questions => {
            inquirer.prompt(questions).then(result => {
                console.log('Update Data:', result); 
                
                const { employee, newRole } = result;
                const updateRoleQuery = 'UPDATE employees SET role_id = $1 WHERE employee_id = $2 RETURNING *';
                pool.query(updateRoleQuery, [newRole, employee])
                    .then(updateResult => {
                        console.log(`Updated employee's role in the database`);
                        askQuestion(); 
                    })
                    .catch(err => {
                        console.error('Error executing query', err.stack);
                        askQuestion(); 
                    });
            });
        })
        .catch(err => {
            console.error('Error fetching employee or role choices', err.stack);
            askQuestion(); 
        });
};


// Start the application
askQuestion();
