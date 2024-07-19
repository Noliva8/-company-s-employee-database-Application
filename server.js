// importing necessary packages
// -----------------------------------------------
const express = require('express');   // express
const inquirer = require('inquirer'); // Inquire
const { Pool } = require('pg');       // node-postgres
const cTable = require('console.table');
// ------------------------------------------------

// import questions
const {
    mainQuestions,
    addDepartmentQuestions,
    addRoleQuestions,
    addEmployeeQuestions,
    addEmployeeRole
} = require ('./helpers/question');
// --------------------------------------------------

// Define the port and app variable
const PORT = process.env.PORT || 4000;
const app = express();
// ------------------------------------------------

// Express middleware / Body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// ------------------------------------------------

// Connect to database
const pool = new Pool(
  {
    user: 'hope-506044',
    password: 'Mutoni@2035',
    host: 'localhost',
    database: 'employees_db'
},
console.log('Connected to the employees_db database!')
)

pool.connect();
// ------------------------------------------------

const askQuestion = () => {
  inquirer.prompt(mainQuestions).then((answers) => {

    // view all departments Table
    // ---------------------------------------------------------
    if (answers.employees === "View all departments") {
      const viewAllDepartments = 'SELECT departments.department_id AS id, departments.name AS name FROM departments;';

      pool.query(viewAllDepartments, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
        } else {
          const { rows } = result;
          console.table(rows);
          askQuestion();
        }
      });
    }
        // View all roles table
    // --------------------------------------------------------------
    if (answers.employees === "View all roles") {
      const viewAllRoles = `
        SELECT roles.role_id AS roleid, 
               roles.title AS titles, 
               departments.name AS department, 
               salaries.salary AS salary 
        FROM roles 
        JOIN departments ON roles.department_id = departments.department_id 
        JOIN salaries ON roles.salary_id = salaries.salary_id
        ORDER BY roles.role_id;
      `;
      pool.query(viewAllRoles, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
        } else {
          const { rows } = result;
          console.table(rows);
          askQuestion();
        }
      });
    }

    // View all employees
    // ----------------------------------
if (answers.employees === "View all employees") {
  const viewAllEmployees = `
    SELECT 
      employees.employee_id AS employee_id,
      employees.firstName AS first_name,
      employees.LastName AS last_name,
      roles.title AS title,
      departments.name AS department,
      salaries.salary AS salary,
      managers.name AS manager
    FROM employees
    JOIN roles ON employees.role_id = roles.role_id
    JOIN departments ON employees.department_id = departments.department_id
    JOIN salaries ON employees.salary_id = salaries.salary_id
    LEFT JOIN managers ON employees.manager_id = managers.manager_id
  `;

      pool.query(viewAllEmployees, (err, result) => {
        if (err){
          console.error('Error executing query', err.stack);
        }
        else{
           const { rows } = result;
          console.table(rows);
          askQuestion();
        }
      })

    }
    
  });
};

askQuestion();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
