import Login from "../../src/components/Login";
import { MemoryRouter } from "react-router-dom";

describe("Login.cy.jsx", () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    cy.get('[data-cy="form-email"]').find("input").clear();
    cy.get('[data-cy="form-password"]').find("input").clear();
  });

  //Wrong/empty emails
  it("should throw error with wrong/empty emails", () => {
    // empty
    cy.get('[data-cy="form-email"]').click();
    cy.get('[data-cy="form-password"]').find("input").type("Test@1234");
    cy.get('[data-cy="form-email-error"]').should(
      "have.text",
      "errorEmail is required.",
    );
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");

    //wrong email case 1 - no @
    cy.get('[data-cy="form-email"]').type("testgoogle.com");
    cy.get('[data-cy="form-password"]').click();
    cy.get('[data-cy="form-email-error"]').should(
      "have.text",
      "errorPlease enter a valid email address.",
    );
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");

    // Wrong email case 2 - no .com
    cy.get('[data-cy="form-email"]').clear();
    cy.get('[data-cy="form-email"]').type("test@google");
    cy.get('[data-cy="form-password"]').click();
    cy.get('[data-cy="form-email-error"]').should(
      "have.text",
      "errorPlease enter a valid email address.",
    );
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");

    // Wrong email case 3 - no text before @provider.com
    cy.get('[data-cy="form-email"]').clear();
    cy.get('[data-cy="form-email"]').type("@google.com");
    cy.get('[data-cy="form-password"]').click();
    cy.get('[data-cy="form-email-error"]').should(
      "have.text",
      "errorPlease enter a valid email address.",
    );
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");

    // Correct email case3 -  Capitalized email
    //TEST@EXAMPLE.COM
    // cy.get('[data-cy="form-email"]').clear();
    // cy.get('[data-cy="form-email"]').type("TEST@EXAMPLE.COM");
    // cy.get('[data-cy="form-submit"]').click();

    // cy.get('[data-cy="form-test-cred-invalid"]')
    //   .should("be.visible")
    //   .and("contain.text", "Invalid email or password.");
  });

  //empty password
  it("show throw error with empty password input", () => {
    cy.get('[data-cy="form-email"]').type("test@example.com");
    cy.get('[data-cy="form-password"]').click();
    cy.get('[data-cy="form-password-error"]').should(
      "have.text",
      "errorPassword is required.",
    );
  });

  //password visibility
  it("toggle password visiblity", () => {
    cy.get('[data-cy="form-email"]').type("test@example.com");
    cy.get('[data-cy="form-password"]').find("input").type("Test@1234");
    cy.get('[data-cy="form-password"]')
      .find("input")
      .should("have.attr", "type", "password");
    cy.get('[data-cy="form-input-password-visiblity"]').click();
    cy.get('[data-cy="form-password"]')
      .find("input")
      .should("have.attr", "type", "text");
    cy.get('[data-cy="form-input-password-visiblity"]').click();
    cy.get('[data-cy="form-password"]')
      .find("input")
      .should("have.attr", "type", "password");
  });
});
