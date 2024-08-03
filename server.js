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

    // ADD DEPARTMENT
    // --------------
if (answers.employees === "Add department") {
    inquirer.prompt(addDepartmentQuestions).then((result) => {
      const departmentName = result.departmentName; // Extract the department name from the user's response
      const addDepartment = `INSERT INTO departments (name) VALUES ($1) RETURNING *`; // Use $1 as a placeholder to avoid sql INJECTION

      // Execute the query, passing the departmentName as a value to replace the $1 placeholder
      pool.query(addDepartment, [departmentName], (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
        } else {
          const { rows } = result;
         
          console.log(`Added ${rows[0].name} to the database`);
          console.table(rows);
          askQuestion();
   
  }
}
)
  }
  )
  
}

// ADD ROLE
// ---------
if (answers.employees === "Add role") {
    inquirer.prompt(addRoleQuestions).then((result) => {
        const roleName = result.roleName;
        const salary = result.salary;
        const departmentName = result.department;

        console.log(`Role Name: ${roleName}`);
        console.log(`Salary: ${salary}`);
        console.log(`Department Name: ${departmentName}`);

        // Insert into salaries table
        // ----------------------------
        const addSalaryQuery = 'INSERT INTO salaries (salary) VALUES ($1) RETURNING salary_id';
        pool.query(addSalaryQuery, [salary], (err, salaryResult) => {
            if (err) {
                console.error('Error executing query to add salary', err.stack);
                return;
            }

            const salaryId = salaryResult.rows[0]?.salary_id;
            console.log(`Salary ID: ${salaryId}`);

            // Retrieve department_id
            // ----------------------
            const getDepartmentIdQuery = 'SELECT department_id FROM departments WHERE name = $1';
            pool.query(getDepartmentIdQuery, [departmentName], (err, departmentResult) => {
                if (err) {
                    console.error('Error executing query to get department ID', err.stack);
                    return;
                }

                if (departmentResult.rows.length === 0) {
                    console.log(`Department ${departmentName} not found.`);
                    return;
                }

                const departmentId = departmentResult.rows[0]?.department_id;
                console.log(`Department ID: ${departmentId}`);

                // Insert into roles table
                const addRoleQuery = 'INSERT INTO roles (title, department_id, salary_id) VALUES ($1, $2, $3) RETURNING *';
                pool.query(addRoleQuery, [roleName, departmentId, salaryId], (err, roleResult) => {
                    if (err) {
                        console.error('Error executing query to add role', err.stack);
                    } else {
                        
                        console.log(`Added role ${roleName} to the database`);
                        askQuestion();
                    }
                });
            });
        });
    });
}

// ADD EMPLOYEE
// -------------

if (answers.employees === "Add Employee") {
  inquirer.prompt(addEmployeeQuestions).then(result => {
    const firstName = result.firstName;
    const lastName = result.lastName;
    const employeeRole = result.role;
    const employeeManager = result.employeeManager;

    // Retrieve the role_id from roles table
    // ------------------------------------

    const roleQuery = `SELECT role_id FROM roles WHERE title = $1`;
    pool.query(roleQuery, [employeeRole], (err, roleResult) => {
      if (err) {
        console.error('Error executing query to get role ID', err.stack);
        return;
      }

      if (roleResult.rows.length === 0) {
        console.log(`Role ${employeeRole} not found.`);
        return;
      }

      const roleId = roleResult.rows[0]?.role_id;
      console.log(`Role ID: ${roleId}`);

      // Retrieve the manager_id from managers table
      // ------------------------------------------
      const managerQuery = `SELECT manager_id FROM managers WHERE name = $1`;
      pool.query(managerQuery, [employeeManager], (err, managerResult) => {
        if (err) {
          console.error('Error executing query to get manager ID', err.stack);
          return;
        }

        let managerId = null; 
        if (managerResult.rows.length > 0) {
          managerId = managerResult.rows[0]?.manager_id;
          console.log(`Manager ID: ${managerId}`);
        } else {
          console.log(`Manager ${employeeManager} not found. No manager will be assigned.`);
        }

        // Insert the new employee
        // -----------------------
        const insertEmployeeQuery = `INSERT INTO employees (firstName, lastName, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *`;
        pool.query(insertEmployeeQuery, [firstName, lastName, roleId, managerId], (err, result) => {
          if (err) {
            console.error('Error executing query to add new employee', err.stack);
          } else {
            console.log(`Added employee ${firstName} ${lastName} to the database`);
            console.table(result.rows);
            askQuestion(); 
          }
        });
      });
    });
  });
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
