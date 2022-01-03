import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

// Helper Function

const typeIntoForm = ({ email, password, cpassword }) => {
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i,
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const cpasswordInputElement = screen.getByLabelText(/confirm password/i);

  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (cpassword) {
    userEvent.type(cpasswordInputElement, cpassword);
  }

  return { emailInputElement, passwordInputElement, cpasswordInputElement };
};

const btnClickEvent = () => {
  const buttonInputElement = screen.getByRole("button", {
    name: /submit/i,
  });

  userEvent.click(buttonInputElement);
};

// Test Function

describe("App", () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<App />);
  });

  test("inputs should be in initially empty", () => {
    const { emailInputElement } = typeIntoForm({
      email: "",
    });
    const { passwordInputElement } = typeIntoForm({ password: "" });
    const { cpasswordInputElement } = typeIntoForm({
      cpassword: "",
    });

    expect(emailInputElement.value).toBe("");
    expect(passwordInputElement.value).toBe("");
    expect(cpasswordInputElement.value).toBe("");
  });

  test("event handler", () => {
    const { emailInputElement } = typeIntoForm({
      email: "abidurrahman471@gmail.com",
    });
    const { passwordInputElement } = typeIntoForm({
      password: "@kASH123456789",
    });
    const { cpasswordInputElement } = typeIntoForm({
      cpassword: "@kASH123456789",
    });

    expect(emailInputElement.value).toBe("abidurrahman471@gmail.com");

    expect(cpasswordInputElement.value).toBe("@kASH123456789");

    expect(passwordInputElement.value).toBe("@kASH123456789");
  });

  test("should show email error message on invalid email", () => {
    const emailErrorElement = screen.queryByText(
      /the email you type is invalid/i
    );
    // const emailInputElement = screen.getByRole("textbox", {
    //   name: /email/i,
    // });
    // userEvent.type(emailInputElement, "abidurrahman471gmail.com");

    typeIntoForm({ email: "abidurrahman471gmail.com" });
    expect(emailErrorElement).not.toBeInTheDocument();

    btnClickEvent();
    const emailErrorElementAgain = screen.queryByText(
      /the email you type is invalid/i
    );
    expect(emailErrorElementAgain).toBeInTheDocument();
  });

  test("should show password error if password is not strong", () => {
    typeIntoForm({
      email: "abidurrahman471@gmail.com",
    });

    expect(
      screen.queryByText(/password is too weak!/i)
    ).not.toBeInTheDocument();

    // userEvent.type(passwordInputElement, "@kASH123456789");

    btnClickEvent();
    typeIntoForm({ password: "@kASH" });
    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.queryByText(/password is too weak!/i)).toBeInTheDocument();
  });

  test("should show cpassword error if password don't match", () => {
    typeIntoForm({
      email: "abidurrahman471@gmail.com",
      password: "@kASH123456789",
    });

    expect(
      screen.queryByText(/password don't match!/i)
    ).not.toBeInTheDocument();

    // userEvent.type(cpasswordInputElement, "123456");
    typeIntoForm({ cpassword: "123456" });
    btnClickEvent();

    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.queryByText(/password don't match!/i)).toBeInTheDocument();
  });

  test("should show no error if all input is valid", () => {
    typeIntoForm({
      email: "abidurrahman471@gmail.com",
      password: "@kASH123456789",
      cpassword: "@kASH123456789",
    });

    btnClickEvent();

    expect(
      screen.queryByText(/the email you type is invalid/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/password is too weak!/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/password don't match!/i)
    ).not.toBeInTheDocument();
  });
});
