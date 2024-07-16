// importing necessary packages
// -----------------------------------------------
const express = require('express');   // express
const inquirer = require('inquirer'); // Inquire
const { Pool } = require('pg');       // node-postgres
// ------------------------------------------------

// Define the port and app variable
const PORT = process.env.PORT || 3001;
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




// ------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// ------------------------------------------------