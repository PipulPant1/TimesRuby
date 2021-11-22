# Times Ruby chatbot API test

# SetUp
# 1. Clone The repo
      https://github.com/Fusemachines/fuseclassroom-testrail.git
# 2. Install the dependencies
      cd ${project_directory}
      yarn install
      Editor of the Choice
      Visual Studio Code

For any other editor of choice make sure you config below dependencies yourself

For Formating code
    This project use prettier for code formating. For VScode install extension quick guide

# Launch vscode and Quick Open ctrl + P, For mac cmd + P
    Run the following command ext install esbenp.prettier-vscode
    open the vscode/settings.json and paste the below values
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "editor.formatOnPaste": false

# How to Run the Tests
    ./node_modules/.bin/cypress run --browser {browser_name} --headless --env configFile=prod
    browser_name = Chrome,Firefox
# How to Open the Test for development
    ./node_modules/.bin/cypress open --env configFile=prod
# How to send report generated from mochaawesome to testrail
    Mochawesome will create a results folder where it will store all the test records in json format (we configure cypress that way)
    node ./utils/reporting/index.js
# How to clean the results folder
    node ./utils/reporting/clean.js
# Building the docker image
    docker build --build-arg RUN_ON_SERVER=prod --tag timesRuby .
# Running the test inside container from iamge
    The default behaviour of image is it will run tests when containerized, so we can just destory the container after the test/process completed
    docker run --rm timesRuby
# Adding New Tests
    We are going to use simple workflow.

Creating Feature branch Feature Branch workflow

Master should always be clean and runable on anywhere in need.

# Create a branch from master

    git branch branch_name
    git checkout branch_name
    ||
    git checkout -b branch_name
If you use VSCODE then it is much easier with the provided GUI support

# Naming convention of branch name

    test/login
# Adding Each "it" Test Conventions
    The C11405 & C11406 is the testrail's case id, should be always seperated by a | symbol and followup with test tile

describe("API Test", () => {
  it("C11405| This will always pass", () => {
    cy.log("Test Pass");
  });

  it("C11406| This test will always fail ", () => {
    cy.visit("https://www.facebook.com");
    cy.contains("Error").should("not.exist");
  });
});
