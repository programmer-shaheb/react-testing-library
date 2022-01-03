import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test("renders reload", () => {
//   render(<App />);
//   const xyz = screen.getByText(/Edit/i);
//   expect(xyz).toBeInTheDocument();
// });

test("inputs should be in initially empty", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox");
  const passwordInputElement = screen.getByLabelText("Password");
  const cpasswordInputElement = screen.getByLabelText(/confirm password/i);
  expect(emailInputElement.value).toBe("");
  expect(passwordInputElement.value).toBe("");
  expect(cpasswordInputElement.value).toBe("");
});

test("event handler", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i,
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const cpasswordInputElement = screen.getByLabelText(/confirm password/i);

  userEvent.type(emailInputElement, "abidurrahman471@gmail.com");
  expect(emailInputElement.value).toBe("abidurrahman471@gmail.com");

  userEvent.type(cpasswordInputElement, "cpassword!");
  expect(cpasswordInputElement.value).toBe("cpassword!");

  userEvent.type(passwordInputElement, "password!");
  expect(passwordInputElement.value).toBe("password!");
});

test("should show email error message on invalid email", () => {
  render(<App />);
  const emailErrorElement = screen.queryByText(
    /the email you type is invalid/i
  );
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i,
  });
  userEvent.type(emailInputElement, "abidurrahman471gmail.com");

  expect(emailErrorElement).not.toBeInTheDocument();

  const buttonInputElement = screen.getByRole("button", {
    name: /submit/i,
  });

  userEvent.click(buttonInputElement);
  const emailErrorElementAgain = screen.queryByText(
    /the email you type is invalid/i
  );
  expect(emailErrorElementAgain).toBeInTheDocument();
});

test("should show password error if password is not strong", () => {
  render(<App />);

  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const passwordErrorElement = screen.queryByText(/password is too weak!/i);

  userEvent.type(emailInputElement, "abidurrahman@gmail.com");
  expect(passwordErrorElement).not.toBeInTheDocument();

  // userEvent.type(passwordInputElement, "@kASH123456789");
  // expect(passwordErrorElement).not.toBeInTheDocument();

  userEvent.type(passwordInputElement, "1234");

  const buttonInputElement = screen.getByRole("button", { name: /submit/i });
  userEvent.click(buttonInputElement);

  const passwordErrorElementAgain = screen.queryByText(
    /password is too weak!/i
  );

  expect(passwordErrorElementAgain).toBeInTheDocument();
});

test("should show cpassword error if password don't match", () => {
  render(<App />);

  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const cpasswordInputElement = screen.getByLabelText(/confirm password/i);

  const cpasswordErrorElement = screen.queryByText(/password don't match!/i);

  const submitBtnElement = screen.getByRole("button", { name: /submit/i });
  userEvent.type(emailInputElement, "abidurrahman471@gmail.com");
  userEvent.type(passwordInputElement, "@kASH123456789");

  expect(cpasswordErrorElement).not.toBeInTheDocument();

  userEvent.type(cpasswordInputElement, "123456");
  userEvent.click(submitBtnElement);

  const cpasswordErrorElementAgain = screen.queryByText(
    /password don't match!/i
  );

  expect(cpasswordErrorElementAgain).toBeInTheDocument();
});

test("should show no error if all input is valid", () => {
  render(<App />);

  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const cpasswordInputElement = screen.getByLabelText(/confirm password/i);

  const submitBtnElement = screen.getByRole("button", { name: /submit/i });
  userEvent.type(emailInputElement, "abidurrahman471@gmail.com");
  userEvent.type(passwordInputElement, "@kASH123456789");
  userEvent.type(cpasswordInputElement, "@kASH123456789");

  userEvent.click(submitBtnElement);
  const emailErrorElement = screen.queryByText(
    /the email you type is invalid/i
  );
  const passwordErrorElement = screen.queryByText(/password is too weak!/i);
  const cpasswordErrorElement = screen.queryByText(/password don't match!/i);
  expect(emailErrorElement).not.toBeInTheDocument();
  expect(passwordErrorElement).not.toBeInTheDocument();
  expect(cpasswordErrorElement).not.toBeInTheDocument();
});
