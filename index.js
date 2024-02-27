const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// TD: Write Code to gather information about the development team members, and render the HTML file.

//created empty array which will be filled with team members later on, depending on the user choices
let teamMembers = [];
//function which add a team member based on your choice of team members list
const addTeamMember = async() => {
    const { role } = await inquirer.prompt({ //created const 'role' and based it user can make choices 
        type: "list",
        name: "role",
        message: "Select the type of team member to add:",
        choices: ["Engineer", "Intern", "Finish building the team"],
    });

    if (role === "Engineer") {
        await addEngineer(); //call the addEngineer method in case user chose "Engineer" option
    } else if (role === "Intern") {
        await addIntern();
    } else {
        // Exit the application and create the team.html file
        return;
    }
    // Call again to allow adding more team members
    addTeamMember();
};

// Create a new team member with the specified name and description (engineer in this case)
const addEngineer = async() => {
    const engineerData = await inquirer.prompt([{
            type: "input",
            name: "name",
            message: "What is the engineer's name?",
        },
        {
            type: "input",
            name: "id",
            message: "What is the engineer's ID?",
        },
        {
            type: "input",
            name: "email",
            message: "What is the engineer's email address?",
        },
        {
            type: "input",
            name: "github",
            message: "What is the engineer's GitHub username?",
        },
    ]);

    teamMembers.push(new Engineer(engineerData.name, engineerData.id, engineerData.email, engineerData.github));
    fs.writeFileSync(outputPath, render(teamMembers), "UTF-8");
};

const addIntern = async() => {
    const internData = await inquirer.prompt([{
            type: "input",
            name: "name",
            message: "What is the intern's name?",
        },
        {
            type: "input",
            name: "id",
            message: "What is the intern's ID?",
        },
        {
            type: "input",
            name: "email",
            message: "What is the intern's email address?",
        },
        {
            type: "input",
            name: "school",
            message: "What is the intern's school?",
        },
    ]);
    //add the Intern details to the cart to be displayed in the html file that will be created when user choose "Finish building the team" option
    teamMembers.push(new Intern(internData.name, internData.id, internData.email, internData.school));
    fs.writeFileSync(outputPath, render(teamMembers), "UTF-8");
};
//creates a function for the manager and then adds all the others team members which user wants!
const startApplication = async() => {
    const managerData = await inquirer.prompt([{
            type: "input",
            name: "name",
            message: "What is the team manager's name?",
        },
        {
            type: "input",
            name: "id",
            message: "What is the team manager's ID?",
        },
        {
            type: "input",
            name: "email",
            message: "What is the team manager's email address?",
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is the team manager's office number?",
        },
    ]);
    // adds the team manager details introduced in the terminal by the user at the beginning
    teamMembers.push(new Manager(managerData.name, managerData.id, managerData.email, managerData.officeNumber));
    await addTeamMember() // added a new team member based of the type user selected when asked in the prompt dialog
    fs.writeFileSync(outputPath, render(teamMembers), "UTF-8");
};
// Check if output directory exists, create it if necessary
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}
// Start the application
startApplication()
    .then(() => setTimeout(() => console.log('Your team is displayed!'), 1000)) // Delay execution
    .catch((err) => console.error('Error in startApplication:', err));