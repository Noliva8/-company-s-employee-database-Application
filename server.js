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

const askQuestion = () =>{
inquirer
  .prompt(mainQuestions)
  .then((answers) => {
    if (answers.employees === "View all departments") {
      const viewAllDepartments = 'SELECT departments.id AS id, departments.name AS name FROM departments;';

      pool.query(viewAllDepartments, function (err, {rows}){
        console.table(rows);
        askQuestion();
      });
    }
    if (answers.employees ==="View all employees"){
      
    }
  })
  
}

askQuestion ();



     
      app.use((req, res) => {
  res.status(404).end();
});

// ------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// // ------------------------------------------------