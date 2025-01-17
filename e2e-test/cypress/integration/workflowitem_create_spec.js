describe("Workflowitem create", function() {
  let projectId;
  let subprojectId;
  const apiRoute = "/api";
  const today = new Date().toISOString();


  before(() => {
    cy.login();
    cy.createProject("workflowitem create test project", "workflowitem create test", [])
      .then(({ id }) => {
        projectId = id;
        return cy.createSubproject(projectId, "workflowitem create test", "EUR");
      })
      .then(({ id }) => {
        subprojectId = id;
      });
  });

  beforeEach(function() {
    cy.login();
    cy.visit(`/projects/${projectId}/${subprojectId}`);
  });

  it("When creating an allocated workflowitem, the currency is equal to the subproject's currency", function() {
    // Open create-dialog of workflow item
    cy.get("[data-test=createWorkflowitem]").click();
    cy.get("[data-test=creation-dialog]").should("be.visible");

    cy.get("[data-test=nameinput]").type("Test");
    cy.get("[data-test=datepicker-due-date]")
      .click()
      .type("02-02-2050");
    cy.get("[data-test=commentinput]").type("Test");
    cy.get("[data-test=amount-type-allocated]").click();
    cy.get("[data-test=dropdown-currencies-click]").should("contain", "EUR");

    // When the currency is equal to the currency of the subproject
    // the exchange rate field is disabled
    cy.get("[data-test=rateinput] input").should("be.disabled");
  });

  it("Show exchange rate correctly when currency of workflowitem differs from the subproject currency", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test", {
      amountType: "allocated",
      amount: "1",
      currency: "USD",
      exchangeRate: "1.4"
    }).then(({ id }) => {
      let workflowitemId = id;
      // The workflow item amount should be displayed in the
      // subproject's currency
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get("[data-test=workflowitem-amount]")
        .first()
        .should("contain", "€");
      // The information on the workflow item amount
      // and exchange rate is displayed in a tooltip
      cy.get("[data-test=amount-explanation-USD]").should("be.visible");
    });
  });

  it("Root can not create a Workflowitem", function() {
    cy.login("root", Cypress.env("ROOT_SECRET"));
    cy.visit(`/projects/${projectId}/${subprojectId}`);

    // When root is logged in the create workflow item button
    // is disabled
    cy.get("[data-test=createWorkflowitem]").should("be.visible");
    cy.get("[data-test=createWorkflowitem]").should("be.disabled");
  });

  it("If the due-date is set and not exceeded, it should be displayed in workflowitem details without alert-border", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test", {
      amountType: "N/A",
      dueDate: "2050-03-03"
    }).then(({ id }) => {
      let workflowitemId = id;
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get(`[data-test^='workflowitem-info-button-${workflowitemId}']`).click();
      cy.get("[data-test=due-date]").should("be.visible");
      // No orange alertborder
      cy.get("[data-test=due-date]").should("not.have.css", "border", "3px solid rgb(255, 143, 0)");
    });
  });

  it("If the due-date is set and exceeded, it should be displayed in workflowitem details with alert-border", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test", {
      amountType: "N/A",
      dueDate: "2000-03-03"
    }).then(({ id }) => {
      let workflowitemId = id;
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get(`[data-test^='workflowitem-info-button-${workflowitemId}']`).click();
      cy.get("[data-test=due-date]").should("be.visible");
      // With orange alert-border
      cy.get("[data-test=due-date]").should("have.css", "border", "3px solid rgb(255, 143, 0)");
    });
  });

  it("If the due-date is not set (empty string), it should not be displayed in workflowitem details", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test", {
      amountType: "N/A",
      dueDate: ""
    }).then(({ id }) => {
      let workflowitemId = id;
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get(`[data-test^='workflowitem-info-button-${workflowitemId}']`).click();
      cy.get("[data-test=due-date]").should("not.exist");
    });
  });

  it("If the due-date is not set, it should not be displayed in workflowitem details", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test").then(({ id }) => {
      let workflowitemId = id;
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get(`[data-test^='workflowitem-info-button-${workflowitemId}']`).click();
      cy.get("[data-test=due-date]").should("not.exist");
    });
  });

  it("If the due-date is set and exceeded, the info icon badge is displayed", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test", {
      amountType: "N/A",
      dueDate: "2000-03-03"
    }).then(({ id }) => {
      let workflowitemId = id;
      // Check if info icon badge is displayed
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get(`[data-test^='info-warning-badge-enabled-${workflowitemId}']`).should("be.visible");
    });
  });

  it("If the due-date is set to today, the due-date is exceeded and the info icon badge is displayed", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test", {
      amountType: "N/A",
      dueDate: today
    }).then(({ id }) => {
      let workflowitemId = id;
      // Check if info icon badge is displayed
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get(`[data-test^='info-warning-badge-enabled-${workflowitemId}']`).should("be.visible");
    });
  });

  it("If the due-date is set and not exceeded, the info icon badge is not displayed", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test", {
      amountType: "N/A",
      dueDate: "2050-03-03"
    }).then(({ id }) => {
      let workflowitemId = id;
      // Check if info icon badge is NOT displayed
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get(`[data-test^='info-warning-badge-enabled-${workflowitemId}']`).should("not.exist");
    });
  });

  it("If the due-date is not set, the info icon badge is not displayed", function() {
    // Create a workflow item
    cy.createWorkflowitem(projectId, subprojectId, "workflowitem assign test", {
      amountType: "N/A",
      dueDate: undefined
    }).then(({ id }) => {
      let workflowitemId = id;
      // Check if info icon badge is NOT displayed
      cy.get("[data-test=workflowitem-" + workflowitemId + "]").should("be.visible");
      cy.get(`[data-test^='info-warning-badge-enabled-${workflowitemId}']`).should("not.exist");
    });
  });

  it("When creating a workflowitem, an assignee can be set", function() {
    // Open create-dialog of workflow item
    cy.get("[data-test=createWorkflowitem]").click();
    cy.get("[data-test=creation-dialog]").should("be.visible");
    cy.get("[data-test=nameinput]").type("Test");
    // Default assignee is preset to current user
    cy.get(`[data-test=single-select]`).should("contain", "Mauro Stein");
    cy.get("[data-test=workflow-dialog-content]")
      .find("[data-test=single-select]")
      .click();
    // set Tom House as assignee
    cy.get("[data-test=single-select-list]")
      .find("[value=thouse]")
      .click();

    cy.get("[data-test=next]").click({ force: true });
    cy.get("[data-test=next]").click({ force: true });
    cy.get("[data-test=submit]").click();
    // Confirmation dialog opens to grant assignee required view permissions
    // 6 additional actions
    cy.get("[data-test=additional-actions]").within(() => {
      cy.get("[data-test=actions-table-body]")
        .should("be.visible")
        .children()
        .should("have.length", 6);
    });
    // 1 original action
    cy.get("[data-test=original-actions]").within(() => {
      cy.get("[data-test=actions-table-body]")
        .should("be.visible")
        .children()
        .should("have.length", 1);
    });
    // 6 post action
    cy.get("[data-test=post-actions]")
      .scrollIntoView()
      .within(() => {
        cy.get("[data-test=actions-table-body]")
          .should("be.visible")
          .children()
          .should("have.length", 6);
      });
    // actions counter displays correct amount of actions
    cy.get("[data-test=actions-counter]")
      .scrollIntoView()
      .contains("0 from 13 actions done");
    cy.get("[data-test=confirmation-dialog-confirm]")
      .should("be.visible")
      .click();
    // Check if assignee has been set
    cy.get("[data-test^=workflowitem-]")
      .last()
      .find(`[data-test=single-select]`)
      .should("contain", "Tom House");
  });

  it("When the subproject type is general, the workflowitem type is also fixed to general", function() {
    cy.intercept(apiRoute + "/project.viewDetails*").as("loadPage");
    cy.intercept(apiRoute + `/project.createSubproject`).as("subprojectCreated");
    cy.visit(`/projects/${projectId}`);

    //Create a subproject
    cy.wait("@loadPage")
      .get("[data-test=subproject-create-button]")
      .click();
    cy.get("[data-test=nameinput] input").type("Test");
    cy.get("[data-test=dropdown-sp-dialog-currencies-click]")
      .click()
      .then(() => cy.get("[data-value=EUR]").click());
    cy.get("[data-test=dropdown-types-click]").click();
    cy.get("[data-value=general]").click();
    cy.get("[data-test=submit]").click();
    cy.get("[data-test=confirmation-dialog-confirm]")
      .should("be.visible")
      .click();

    cy.wait("@subprojectCreated").should(interception => {
      cy.visit(`/projects/${projectId}/${interception.response.body.data.subproject.id}`);

      //test type in workflowitem creation
      cy.get("[data-test=createWorkflowitem]").click();
      cy.get("[data-test=creation-dialog]").should("be.visible");
      cy.get("[data-test=dropdown-types-click]")
        .get("[data-disabled=true]")
        .should("be.visible");
    });
  });

  it("When the subproject type is any, the workflowitem type is not fixed", function() {
    cy.intercept(apiRoute + "/project.viewDetails*").as("loadPage");
    cy.intercept(apiRoute + `/project.createSubproject`).as("subprojectCreated");
    cy.intercept(apiRoute + `/subproject.createWorkflowitem`).as("workflowitemCreated");

    //Create a subproject
    cy.visit(`/projects/${projectId}`);
    cy.wait("@loadPage")
      .get("[data-test=subproject-create-button]")
      .click();
    cy.get("[data-test=nameinput] input").type("Test");
    cy.get("[data-test=dropdown-sp-dialog-currencies-click]")
      .click()
      .then(() => cy.get("[data-value=EUR]").click());
    cy.get("[data-test=submit]").click();
    cy.get("[data-test=confirmation-dialog-confirm]")
      .should("be.visible")
      .click();
    cy.wait("@subprojectCreated").should(interception => {
      cy.visit(`/projects/${projectId}/${interception.response.body.data.subproject.id}`);

      //test type in workflowitem creation
      cy.get("[data-test=createWorkflowitem]").click();
      cy.get("[data-test=creation-dialog]").should("be.visible");
      cy.get("[data-disabled=false]").should("be.visible");
      cy.get("[data-test=dropdown-types-click]")
        .should("not.be.disabled")
        .click();
      cy.get("[data-test=dropdown_selectList] > [tabindex=-1]").click();
      cy.get("[data-test=nameinput]").type("Test");

      cy.get("[data-test=next]").click({ force: true });
      cy.get("[data-test=submit]").click();

      // Confirm creation
      cy.get("[data-test=confirmation-dialog-confirm]")
        .should("be.visible")
        .click();

      cy.wait("@workflowitemCreated").should(interception => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  });

  it("When the subproject validator is set, the workflowitem assignee is fixed and the field is disabled", function() {
    const assignee = { id: "jdoe", name: "John Doe" };
    cy.intercept(apiRoute + "/project.viewDetails*").as("loadPage");
    cy.intercept(apiRoute + `/project.createSubproject`).as("subprojectCreated");

    // create a subproject
    cy.visit(`/projects/${projectId}`);
    cy.wait("@loadPage")
      .get("[data-test=subproject-create-button]")
      .click();
    cy.get("[data-test=nameinput] input").type("Test");
    cy.get("[data-test=dropdown-sp-dialog-currencies-click]")
      .click()
      .then(() => cy.get("[data-value=EUR]").click());
    // set validator
    cy.get("[data-test=subproject-dialog-content]")
      .find("[data-test=single-select]")
      .click();
    cy.get("[data-test=single-select-list]")
      .find(`[value=${assignee.id}]`)
      .click();
    cy.get("[data-test=close-select]").click();

    cy.get("[data-test=submit]").click();
    cy.get("[data-test=confirmation-dialog-confirm]")
      .should("be.visible")
      .click();

    cy.wait("@subprojectCreated").should(interception => {
      cy.visit(`/projects/${projectId}/${interception.response.body.data.subproject.id}`);

      // test assignee field in workflowitem creation
      cy.get("[data-test=createWorkflowitem]").click();
      cy.get("[data-test=creation-dialog]").should("be.visible");
      cy.get("[data-test=single-select-disabled]").should("be.visible");
      cy.get(`[data-test=single-select-container-disabled]`).should("contain", assignee.name);
    });
  });

  it("When no validator is set in a subproject, the workflowitem assignee can be changed", function() {
    cy.intercept(apiRoute + "/project.viewDetails*").as("loadPage");
    cy.intercept(apiRoute + `/project.createSubproject`).as("subprojectCreated");
    cy.intercept(apiRoute + `/subproject.createWorkflowitem`).as("workflowitemCreated");

    //Create a subproject
    cy.visit(`/projects/${projectId}`);
    cy.wait("@loadPage")
      .get("[data-test=subproject-create-button]")
      .click();
    cy.get("[data-test=nameinput] input").type("Test");
    cy.get("[data-test=dropdown-sp-dialog-currencies-click]")
      .click()
      .then(() => cy.get("[data-value=EUR]").click());
    cy.get("[data-test=submit]").click();
    cy.get("[data-test=confirmation-dialog-confirm]")
      .should("be.visible")
      .click();
    cy.wait("@subprojectCreated").should(interception => {
      cy.visit(`/projects/${projectId}/${interception.response.body.data.subproject.id}`);
      // test assignee field in workflowitem creation
      cy.get("[data-test=createWorkflowitem]").click();
      cy.get("[data-test=creation-dialog]").should("be.visible");
      cy.get("[data-test=nameinput]").type("Test");

      cy.get("[data-test=single-select-container]")
        .last()
        .click();
      cy.get("[value=jdoe]").click();
      cy.get("[data-test=next]").click({ force: true });
      cy.get("[data-test=submit]").click();

      // Confirm creation
      cy.get("[data-test=confirmation-dialog-confirm]")
        .should("be.visible")
        .click();

      cy.wait("@workflowitemCreated").should(interception => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  });

  it("When the workflowitem type is restricted, there are no post actions", function() {
    cy.intercept(apiRoute + "/project.viewDetails*").as("loadPage");
    cy.intercept(apiRoute + `/project.createSubproject`).as("subprojectCreated");
    cy.intercept(apiRoute + `/subproject.createWorkflowitem`).as("workflowitemCreated");

    //Create a subproject
    cy.visit(`/projects/${projectId}`);
    cy.wait("@loadPage")
      .get("[data-test=subproject-create-button]")
      .click();
    cy.get("[data-test=nameinput] input").type("Test");
    cy.get("[data-test=dropdown-sp-dialog-currencies-click]")
      .click()
      .then(() => cy.get("[data-value=EUR]").click());
    cy.get("[data-test=dropdown-types]")
      .click()
      .then(() => cy.get("[data-value=restricted]").click());
    cy.get("[data-test=submit]").click();
    cy.get("[data-test=confirmation-dialog-confirm]").click();

    cy.wait("@subprojectCreated").should(interception => {
      cy.visit(`/projects/${projectId}/${interception.response.body.data.subproject.id}`);
      // test assignee field in workflowitem creation
      cy.get("[data-test=createWorkflowitem]").click();
      cy.get("[data-test=creation-dialog]").should("be.visible");
      cy.get("[data-test=nameinput]").type("Test");

      cy.get("[data-test=single-select-container]")
        .last()
        .click();
      //Romina Checker is validator
      cy.get("[value=auditUser]").click();
      cy.get("[data-test=next]").click({ force: true });
      cy.get("[data-test=submit]").click();

      // 6 additional action
      cy.get("[data-test=additional-actions]")
        .scrollIntoView()
        .within(() => {
          cy.get("[data-test=actions-table-body]")
            .should("be.visible")
            .children()
            .should("have.length", 6);
        });
      // 1 original action
      cy.get("[data-test=original-actions]")
        .scrollIntoView()
        .within(() => {
          cy.get("[data-test=actions-table-body]")
            .should("be.visible")
            .children()
            .should("have.length", 1);
        });
      // No post actions
      cy.get("[data-test=post-actions]").should("not.exist");
      // actions counter displays correct amount of actions
      cy.get("[data-test=actions-counter]")
        .scrollIntoView()
        .contains("0 from 7 actions done");
      // Confirm creation
      cy.get("[data-test=confirmation-dialog-confirm]")
        .should("be.visible")
        .click();
      cy.wait("@workflowitemCreated").should(interception => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  });
});
