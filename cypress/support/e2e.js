// ***********************************************************
// This file is processed and loaded automatically before your test files.
// You can read more here: https://on.cypress.io/configuration
// ***********************************************************

// Custom commands
Cypress.Commands.add("resetTasks", () => {
  // Call the API to get all tasks and delete them for a clean state
  cy.request("GET", "http://localhost:3000/api/tasks").then((response) => {
    const tasks = response.body.data;
    tasks.forEach((task) => {
      cy.request("DELETE", `http://localhost:3000/api/tasks/${task.id}`);
    });
  });
});

Cypress.Commands.add("createTask", (title, options = {}) => {
  cy.request("POST", "http://localhost:3000/api/tasks", {
    task: {
      title,
      description: options.description || "",
      completed: options.completed || false,
    },
  });
});

// Suppress uncaught exceptions from the app
Cypress.on("uncaught:exception", (err) => {
  // Returning false prevents Cypress from failing the test
  return false;
});
