-- BASE DATA FOR DEPARTMENTS
-- ----------------------------------------------
INSERT INTO departments (name)
VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

-- BASE DATA FOR SALARIES
-- ----------------------------------------------
INSERT INTO salaries (salary)
VALUES
(100000),
(80000),
(150000),
(120000),
(160000),
(125000),
(250000),
(190000);


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
