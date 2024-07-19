-- BASE DATA FOR DEPARTMENTS
-- ----------------------------------------------
INSERT INTO departments (name)
VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

-- Retrieve department IDs
SELECT * FROM departments;

-- BASE DATA FOR SALARIES
-- ----------------------------------------------
INSERT INTO salaries (salary)
VALUES
(100000),
(80000),
(150000),
(120000);

-- Retrieve salary IDs
SELECT * FROM salaries;
-- ---------------------------------------------
-- BASE DATA FOR roles
-- ----------------------------------------------
INSERT INTO roles (title, department_id, salary_id)
VALUES
('Sales Lead', 4, 2),
('Salesperson', 4, 2),
('Lead Engineer', 1, 1),
('Software Engineer', 1, 1),
('Account Manager', 2, 2),
('Accountant', 2, 3),
('Legal Team Lead', 3, 3),
('Lawyer', 3, 3);

-- Retrieve role IDs
SELECT * FROM roles;
-- ---------------------------------------------
-- BASE DATA MANAGERS
-- -------------------------------------------
INSERT INTO managers (name)
VALUES 
('John Doe'),
('Ashley Rodriguez'),
('Kungh Singh'),
('Sarah Lourd');


-- Retrieve manager IDs
SELECT * FROM managers;
-- ------------------------------------------------
-- BASE DATA FOR EMPLOYEES
-- ---------------------------------
INSERT INTO employees (firstName, LastName, role_id, department_id, salary_id, manager_id)
VALUES 
('John', 'Doe', 1, 4, 1, NULL),     
('Mike', 'Chan', 2, 4, 2, 1),       
('Ashley', 'Rodriguez', 3, 1, 3, NULL), 
('Kevin', 'Tupik', 4, 1, 4, 2),     
('Kunal', 'Singh', 5, 2, 2, 3),    
('Malia', 'Brown', 6, 3, 1, 3),     
('Sarah', 'Lourd', 7, 1, 3, NULL),   
('Tom', 'Allen', 8, 1, 4, NULL); 

-- Retrieve employees IDs
SELECT * FROM employees;