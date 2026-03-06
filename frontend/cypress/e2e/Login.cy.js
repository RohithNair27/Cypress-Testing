describe("Login tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5175/");
  });

  // Happy path
  it("should login successfully with valid credentials", () => {
    cy.intercept("POST", "http://localhost:4001/api/auth/login", {
      statusCode: 200,
      body: {
        message: "Login successful.",
        user: {
          id: 1,
          email: "test@example.com",
          createdAt: "2026-03-05 21:56:21",
        },
      },
    }).as("login");
    cy.get('[data-cy="form-email"]').find("input").type("test@example.com");
    cy.get('[data-cy="form-password"]').find("input").type("Test@1234");
    cy.get('[data-cy="form-submit"]').click();
    cy.location("pathname").should("eq", "/dashboard");
    cy.contains("Login Successful!").should("be.visible");
  });

  // Wrong credentials
  it("should login successfully with valid credentials", () => {
    cy.intercept("http://localhost:4001/api/auth", {
      body: {
        statusCode: 401,
        body: { error: "Invalid email or password." },
      },
    });
    cy.get('[data-cy="form-email"]').find("input").type("wrong@example.com");
    cy.get('[data-cy="form-password"]').find("input").type("Wrong@1234");
    cy.get('[data-cy="form-submit"]').click();
    cy.location("pathname").should("eq", "/");
    cy.get('[data-cy="form-test-cred-invalid"]')
      .should("be.visible")
      .and("contain.text", "Invalid email or password.");
  });
});
