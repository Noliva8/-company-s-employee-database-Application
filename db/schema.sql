-- Creating the database
-- ---------------------------------------------------
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Switch to the database
-- ---------------------------------------------------
\c employees_db

-- Creating Department table
-- -------------------------------------------------------
CREATE TABLE departments(
  department_id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL
);

-- Creating Salary table
-- ------------------------------------------------------
CREATE TABLE salaries(
  salary_id SERIAL PRIMARY KEY,
  salary INTEGER NOT NULL
);

-- Creating roles table
-- ------------------------------------------------------
CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  department_id INTEGER,
  salary_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (salary_id) REFERENCES salaries(salary_id)
);


-- Creating Manager Table
---------------------------------
CREATE TABLE managers (
    manager_id SERIAL PRIMARY KEY,
    name VARCHAR(250)
);

-- Creating Employees Table
-- ------------------------------
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    firstName VARCHAR(50),
    LastName VARCHAR(50),
    role_id INTEGER,
    department_id INTEGER,
    salary_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (salary_id) REFERENCES salaries(salary_id),
    FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
);

-- Retrieve role IDs
SELECT * FROM employees;