describe("Task Manager", () => {
  beforeEach(() => {
    // Reset tasks before each test
    cy.resetTasks();
    cy.visit("/");
  });

  describe("Display", () => {
    it("should display the task manager header", () => {
      cy.contains("h1", "Task Manager").should("be.visible");
      cy.contains("Stay organized and productive").should("be.visible");
    });

    it("should show empty state when no tasks", () => {
      cy.contains("No tasks found").should("be.visible");
    });

    it("should display filter buttons", () => {
      cy.contains("button", "All").should("be.visible");
      cy.contains("button", "Pending").should("be.visible");
      cy.contains("button", "Completed").should("be.visible");
    });

    it("should display search input", () => {
      cy.get('input[placeholder="Search tasks..."]').should("be.visible");
    });
  });

  describe("Create Task", () => {
    it("should create a new task", () => {
      cy.get('input[placeholder="Add a new task..."]').type("My new task");
      cy.contains("button", "Add").click();

      cy.contains("My new task").should("be.visible");
      cy.contains("No tasks found").should("not.exist");
    });

    it("should clear input after creating task", () => {
      cy.get('input[placeholder="Add a new task..."]').type("Another task");
      cy.contains("button", "Add").click();

      cy.get('input[placeholder="Add a new task..."]').should("have.value", "");
    });

    it("should create task by pressing Enter", () => {
      cy.get('input[placeholder="Add a new task..."]').type(
        "Enter task{enter}",
      );

      cy.contains("Enter task").should("be.visible");
    });

    it("should not create empty task", () => {
      cy.contains("button", "Add").click();
      cy.contains("No tasks found").should("be.visible");
    });
  });

  describe("Toggle Task", () => {
    beforeEach(() => {
      cy.createTask("Toggle me");
      cy.visit("/");
    });

    it("should toggle task status", () => {
      // Initially pending (⏳)
      cy.contains("li", "Toggle me").should("be.visible");
      cy.contains("li", "Toggle me").contains("⏳").should("be.visible");

      // Click to complete
      cy.contains("li", "Toggle me").contains("⏳").click();

      // Should now be completed (✅)
      cy.contains("li", "Toggle me").contains("✅").should("be.visible");
    });

    it("should toggle back to pending", () => {
      // Complete the task
      cy.contains("li", "Toggle me").contains("⏳").click();
      cy.contains("li", "Toggle me").contains("✅").should("be.visible");

      // Toggle back to pending
      cy.contains("li", "Toggle me").contains("✅").click();
      cy.contains("li", "Toggle me").contains("⏳").should("be.visible");
    });
  });

  describe("Edit Task", () => {
    beforeEach(() => {
      cy.createTask("Edit me");
      cy.visit("/");
    });

    it("should edit task title on double click", () => {
      cy.contains("li", "Edit me").contains("span", "Edit me").dblclick();

      // After double-click, the span is replaced by an input inside the li
      // Find the input inside the task list (not the search/form inputs)
      cy.get("ul li input").clear().type("Edited task{enter}");

      cy.contains("Edited task").should("be.visible");
      cy.contains("li", "Edited task").should("exist");
    });

    it("should cancel edit on Escape", () => {
      cy.contains("li", "Edit me").contains("span", "Edit me").dblclick();

      cy.get("ul li input").clear().type("Changed{esc}");

      cy.contains("Edit me").should("be.visible");
    });
  });

  describe("Delete Task", () => {
    beforeEach(() => {
      cy.createTask("Delete me");
      cy.visit("/");
    });

    it("should delete a task", () => {
      cy.contains("Delete me").should("be.visible");

      cy.get('button[aria-label="Delete task"]').click();

      cy.contains("Delete me").should("not.exist");
      cy.contains("No tasks found").should("be.visible");
    });
  });

  describe("Filter Tasks", () => {
    beforeEach(() => {
      cy.createTask("Pending task 1");
      cy.createTask("Pending task 2");
      cy.createTask("Completed task", { completed: true });
      cy.visit("/");
    });

    it("should show all tasks by default", () => {
      cy.contains("Pending task 1").should("be.visible");
      cy.contains("Pending task 2").should("be.visible");
      cy.contains("Completed task").should("be.visible");
    });

    it("should filter pending tasks", () => {
      cy.contains("button", "Pending").click();

      cy.contains("Pending task 1").should("be.visible");
      cy.contains("Pending task 2").should("be.visible");
      cy.contains("Completed task").should("not.exist");
    });

    it("should filter completed tasks", () => {
      cy.contains("button", "Completed").click();

      cy.contains("Completed task").should("be.visible");
      cy.contains("Pending task 1").should("not.exist");
      cy.contains("Pending task 2").should("not.exist");
    });

    it("should show all tasks when clicking All", () => {
      cy.contains("button", "Pending").click();
      cy.contains("button", "All").click();

      cy.contains("Pending task 1").should("be.visible");
      cy.contains("Completed task").should("be.visible");
    });
  });

  describe("Search Tasks", () => {
    beforeEach(() => {
      cy.createTask("Buy groceries", { description: "Milk and eggs" });
      cy.createTask("Call dentist");
      cy.createTask("Write report");
      cy.visit("/");
    });

    it("should filter tasks by search term", () => {
      cy.get('input[placeholder="Search tasks..."]').type("groceries");

      cy.contains("Buy groceries").should("be.visible");
      cy.contains("Call dentist").should("not.exist");
      cy.contains("Write report").should("not.exist");
    });

    it("should search in description", () => {
      cy.get('input[placeholder="Search tasks..."]').type("Milk");

      cy.contains("Buy groceries").should("be.visible");
    });

    it("should show no results for non-matching search", () => {
      cy.get('input[placeholder="Search tasks..."]').type("nonexistent");

      cy.contains("No tasks found").should("be.visible");
    });

    it("should clear search and show all tasks", () => {
      cy.get('input[placeholder="Search tasks..."]').type("groceries");
      cy.contains("Call dentist").should("not.exist");

      cy.get('input[placeholder="Search tasks..."]').clear();

      cy.contains("Buy groceries").should("be.visible");
      cy.contains("Call dentist").should("be.visible");
      cy.contains("Write report").should("be.visible");
    });

    it("should combine search with filter", () => {
      cy.createTask("Completed groceries", { completed: true });
      cy.visit("/");

      cy.get('input[placeholder="Search tasks..."]').type("groceries");
      cy.contains("button", "Pending").click();

      cy.contains("Buy groceries").should("be.visible");
      cy.contains("Completed groceries").should("not.exist");
    });
  });
});
