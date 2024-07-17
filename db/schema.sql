
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
CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    department_id INTEGER,
    salary_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments (department_id),
    FOREIGN KEY (salary_id) REFERENCES salaries (salary_id)
);


