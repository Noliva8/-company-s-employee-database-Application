
const mainQuestions = [

// The initial question
// ----------------------------------------------
     {
        type:"list",
        name: "employees",
        message:" What would you like to do ?",
        choices : [
        "Add Employee",
        "View all employees",
        "Update employees role",
         "View all roles", 
         "Add role", 
         "View all departments", 
         "Add department",
          "Quit", 
         
          ]
    }
    ];
// ----------------------------------------------------

 const addDepartmentQuestions = [

    // Add department
// ----------------------------------------------------

    {
        type: "input",
        name: "departmentName",
        message: " What is the name of department?",
        validate: (answer) => {
            if(!answer){
                return 'Please add department name'
            }
            return true;
        }

    },
    
    ];


// ----------------------------------------------------

const addRoleQuestions = [
        // add role
// ----------------------------------------------------

     {
        type: "input",
        name: "roleName",
        message: " What is the name of the role?",
        validate: (answer) => {
            if(!answer){
                return 'Please add role name'
            }
            return true;
        }

    },

    {
    type: "input",
    name: "salary",
    message: "What is the salary of the role?",
    validate: (answer) => {
        if (isNaN(answer)) {
            return "The salary provided is not a number";
        }
        return true;
    }
},

  {
        type:"list",
        name: "department",
        message:" Which department does the role belong to?",
        choices : [
        'Engineering',
         'Finance', 
         'Legal', 
         'Sales', 
         'Service'
         
          ]
    },
    ];
// -----------------------------------------------------

 const addEmployeeQuestions = [
    // Add employee
// -----------------------------------------------------
    {
        type: "input",
        name: "firstName",
        message: " What is the employee's first name ?",
        validate: (answer) => {
            if(!answer){
                return "Please add employee's first name";
            }
            return true;
        }

    },

    {
        type: "input",
        name: "lastName",
        message: " What is the employee's last name ?",
        validate: (answer) => {
            if(!answer){
                return "Please add employee's last name";
            }
            return true;
        }

    },

     {
        type: "list",
        name: "role",
        message: " What is the employee's role ?",
        choices : [
            "Sales Lead",
            "Salesperson",
            "Software engineer",
            "Account Manager",
            "Accountant",
            "Legal Team Lead",
            "Lawyer",
            "customer services"
        ]
    },

     {
        type: "list",
        name: "employeeManager",
        message: " What is the employee's manager ?",
         choices : [
            "None",
            "John Doe",
            "Mike Chan",
            "Ashley Rodriguez",
            "Kevin Tupik",
            "Kunal Singh",
            "Marian Brown"
        ]

    },
 ];
// -----------------------------------------------------
  const addEmployeeRole = [
    // Update employee role
// -----------------------------------------------------

 {
        type: "list",
        name: "updateRole",
        message: " Which employee role do you want to update ?",
         choices : [
            "John Doe",
            "Mike Chan",
            "Ashley Rodriguez",
            "Kevin Tupik",
            "Kunal Singh",
            "Marian Brown",
            "Sarah Lourd"
        ]

    },


     {
        type: "list",
        name: "roleToUpdate",
        message: " Which role do you want to assign the selected employee ?",
        choices : [
            "Sales Lead",
            "Salesperson",
            "Lead Engineer",
            "Software engineer",
            "Account Manager",
            "Accountant",
            "Legal Team Lead"
        ]
    },


];

module.exports = {
    mainQuestions,
    addDepartmentQuestions,
    addRoleQuestions,
    addEmployeeQuestions,
    addEmployeeRole
};