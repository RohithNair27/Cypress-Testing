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

  //empty emails
  it("should show error when email is empty", () => {
    cy.get('[data-cy="form-email"]').click();
    cy.get('[data-cy="form-password"]').find("input").type("Test@1234");
    cy.get('[data-cy="form-email-error"]').should(
      "have.text",
      "errorEmail is required.",
    );
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");
  });

  //Capitalized email
  it.only("should allow capitalized email", () => {
    cy.get('[data-cy="form-email"]').find("input").type("TEST@EXAMPLE.COM");
    cy.get('[data-cy="form-password"]').find("input").focus();
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("not.have.class", "input-error");
  });

  it("should show error for email without @", () => {
    cy.get('[data-cy="form-email"]').type("testgoogle.com");
    cy.get('[data-cy="form-password"]').find("input").focus();
    cy.get('[data-cy="form-email-error"]').should(
      "have.text",
      "errorPlease enter a valid email address.",
    );
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");
  });

  // domin checks

  // no domains
  it("should show error for email without domain", () => {
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
  });

  // works for all domins
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
  ];
  allowedDomains.forEach((domain) => {
    it(`should accept email with domain ${domain}`, () => {
      cy.get('[data-cy="form-email"]')
        .find("input")
        .clear()
        .type(`test@${domain}`);
      cy.get('[data-cy="form-password"]').find("input").focus();

      cy.get('[data-cy="form-email"]')
        .find("input")
        .should("not.have.class", "input-error");
    });
  });

  // checking all the top level domains
  const tlds = ["com", "in", "dev", "org", "net"];

  tlds.forEach((tld) => {
    it(`should accept email with .${tld} domain`, () => {
      cy.get('[data-cy="form-email"]').find("input").type(`test@gmail.${tld}`);

      cy.get('[data-cy="form-password"]').find("input").focus();

      cy.get('[data-cy="form-email"]')
        .find("input")
        .should("not.have.class", "input-error");
    });
  });
  // Domin without provider
  it.only("should not allow missing domain name", () => {
    cy.get('[data-cy="form-email"]').find("input").type("test@.com");
    cy.get('[data-cy="form-password"]').find("input").focus();

    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");
  });

  // testing without "." in the email
  it("shoud have . inbetween domain and tlds", () => {
    cy.get('[data-cy="form-email"]').find("input").type(`test@gmailcom`);
    cy.get('[data-cy="form-password"]').find("input").focus();
    cy.get('[data-cy="form-email-error"]').should(
      "have.text",
      "errorPlease enter a valid email address.",
    );
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");
  });

  // testing without the local part
  it("should have a local part with atleast one char before @", () => {
    cy.get('[data-cy="form-email"]').find("input").type("@gmail.com");
    cy.get('[data-cy="form-password"]').find("input").focus();
    cy.get('[data-cy="form-email-error"]').should(
      "have.text",
      "errorPlease enter a valid email address.",
    );
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("have.class", "input-error");
  });

  //Should allow space in email - as the type is email it handles space
  it.only("should not allow spaces in email", () => {
    cy.get('[data-cy="form-email"]').find("input").type("test @gmail.com");
    cy.get('[data-cy="form-password"]').find("input").focus();
    cy.get('[data-cy="form-email"]')
      .find("input")
      .should("not.have.class", "input-error");
  });

  //works with atleast one Interger/Char/dots between them in local part
  const localPart = ["0", "1.0", "1.0.0", "r", "r.r", "rohith.nair"];
  localPart.forEach((local) => {
    it("should work with one Ineger or char in the local part", () => {
      cy.get('[data-cy="form-email"]')
        .find("input")
        .type(`${local}.@gmail.com`);
      cy.get('[data-cy="form-password"]').find("input").focus();

      cy.get('[data-cy="form-email"]')
        .find("input")
        .should("not.have.class", "input-error");
    });
  });

  // local part char 64 chars - does not exceeds limit
  const validLocalParts = ["a".repeat(64)];
  validLocalParts.forEach((local) => {
    it("should accept local part with exactly 64 characters", () => {
      cy.get('[data-cy="form-email"]').find("input").type(`${local}@gmail.com`);
      cy.get('[data-cy="form-password"]').find("input").focus();

      cy.get('[data-cy="form-email"]')
        .find("input")
        .should("not.have.class", "input-error");
    });
  });

  // local part char 65 chars - exceeds limit
  const invalidLocalParts = ["a".repeat(65)];
  invalidLocalParts.forEach((local) => {
    it("should show error when local part exceeds 64 characters", () => {
      cy.get('[data-cy="form-email"]').find("input").type(`${local}@gmail.com`);
      cy.get('[data-cy="form-password"]').find("input").focus();

      cy.get('[data-cy="form-email-error"]').should(
        "have.text",
        "errorEmail local part (before @) must be 64 characters or fewer.",
      );
      cy.get('[data-cy="form-email"]')
        .find("input")
        .should("have.class", "input-error");
    });
  });

  // TLD 63 chars - does not exceed limit
  const validTlds = ["a".repeat(63)];
  validTlds.forEach((tld) => {
    it("should accept TLD with exactly 63 characters", () => {
      cy.get('[data-cy="form-email"]').find("input").type(`test@gmail.${tld}`);
      cy.get('[data-cy="form-password"]').find("input").focus();

      cy.get('[data-cy="form-email"]')
        .find("input")
        .should("not.have.class", "input-error");
    });
  });

  // TLD 64 chars - exceeds limit
  const invalidTlds = ["a".repeat(64)];
  invalidTlds.forEach((tld) => {
    it("should show error when TLD exceeds 63 characters", () => {
      cy.get('[data-cy="form-email"]').find("input").type(`test@gmail.${tld}`);
      cy.get('[data-cy="form-password"]').find("input").focus();

      cy.get('[data-cy="form-email-error"]').should(
        "have.text",
        "errorEmail TLD (after the last .) must be 63 characters or fewer.",
      );
      cy.get('[data-cy="form-email"]')
        .find("input")
        .should("have.class", "input-error");
    });
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
