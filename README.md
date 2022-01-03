<div align="center">
<h1>React Testing Library</h1>

<a href="https://www.emojione.com/emoji/1f410">
  <img
    height="80"
    width="80"
    alt="goat"
    src="https://raw.githubusercontent.com/testing-library/react-testing-library/main/other/goat.png"
  />
</a>

<p>Simple and complete React DOM testing utilities that encourage good testing
practices.</p>

<br />

[**Read The Docs**](https://testing-library.com/react)

<br />
</div>

<hr />

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The problem](#the-problem)
- [The solution](#the-solution)
- [Installation](#installation)
  - [Suppressing unnecessary warnings on React DOM 16.8](#suppressing-unnecessary-warnings-on-react-dom-168)
- [Examples](#examples)
  - [Basic Example](#basic-example)
  - [Complex Example](#complex-example)
  - [More Examples](#more-examples)
- [Hooks](#hooks)
- [Guiding Principles](#guiding-principles)
- [Docs](#docs)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
  - [❓ Questions](#-questions)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The problem

You want to write maintainable tests for your React components. As a part of
this goal, you want your tests to avoid including implementation details of your
components and rather focus on making your tests give you the confidence for
which they are intended. As part of this, you want your testbase to be
maintainable in the long run so refactors of your components (changes to
implementation but not functionality) don't break your tests and slow you and
your team down.

## The solution

The `React Testing Library` is a very lightweight solution for testing React
components. It provides light utility functions on top of `react-dom` and
`react-dom/test-utils`, in a way that encourages better testing practices. Its
primary guiding principle is:

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev @testing-library/react
```

or

for installation via [yarn][yarn]

```
yarn add --dev @testing-library/react
```

This library has `peerDependencies` listings for `react` and `react-dom`.

You may also be interested in installing `@testing-library/jest-dom` so you can
use [the custom jest matchers](https://github.com/testing-library/jest-dom).

> [**Docs**](https://testing-library.com/react)

### Suppressing unnecessary warnings on React DOM 16.8

There is a known compatibility issue with React DOM 16.8 where you will see the
following warning:

```
Warning: An update to ComponentName inside a test was not wrapped in act(...).
```

If you cannot upgrade to React DOM 16.9, you may suppress the warnings by adding
the following snippet to your test configuration
([learn more](https://github.com/testing-library/react-testing-library/issues/281)):

```js
// this is just a little hack to silence a warning that we'll get until we
// upgrade to 16.9. See also: https://github.com/facebook/react/pull/14853
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

## Examples

### Basic Example

```jsx
// hidden-message.js
import * as React from "react";

// NOTE: React Testing Library works well with React Hooks and classes.
// Your tests will be the same regardless of how you write your components.
function HiddenMessage({ children }) {
  const [showMessage, setShowMessage] = React.useState(false);
  return (
    <div>
      <label htmlFor="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        onChange={(e) => setShowMessage(e.target.checked)}
        checked={showMessage}
      />
      {showMessage ? children : null}
    </div>
  );
}

export default HiddenMessage;
```

```jsx
// __tests__/hidden-message.js
// these imports are something you'd normally configure Jest to import for you
// automatically. Learn more in the setup docs: https://testing-library.com/docs/react-testing-library/setup#cleanup
import "@testing-library/jest-dom";
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import HiddenMessage from "../hidden-message";

test("shows the children when the checkbox is checked", () => {
  const testMessage = "Test Message";
  render(<HiddenMessage>{testMessage}</HiddenMessage>);

  // query* functions will return the element or null if it cannot be found
  // get* functions will return the element or throw an error if it cannot be found
  expect(screen.queryByText(testMessage)).toBeNull();

  // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
  fireEvent.click(screen.getByLabelText(/show/i));

  // .toBeInTheDocument() is an assertion that comes from jest-dom
  // otherwise you could use .toBeDefined()
  expect(screen.getByText(testMessage)).toBeInTheDocument();
});
```

### Complex Example

```jsx
// login.js
import * as React from "react";

function Login() {
  const [state, setState] = React.useReducer((s, a) => ({ ...s, ...a }), {
    resolved: false,
    loading: false,
    error: null,
  });

  function handleSubmit(event) {
    event.preventDefault();
    const { usernameInput, passwordInput } = event.target.elements;

    setState({ loading: true, resolved: false, error: null });

    window
      .fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value,
        }),
      })
      .then((r) =>
        r.json().then((data) => (r.ok ? data : Promise.reject(data)))
      )
      .then(
        (user) => {
          setState({ loading: false, resolved: true, error: null });
          window.localStorage.setItem("token", user.token);
        },
        (error) => {
          setState({ loading: false, resolved: false, error: error.message });
        }
      );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="usernameInput">Username</label>
          <input id="usernameInput" />
        </div>
        <div>
          <label htmlFor="passwordInput">Password</label>
          <input id="passwordInput" type="password" />
        </div>
        <button type="submit">Submit{state.loading ? "..." : null}</button>
      </form>
      {state.error ? <div role="alert">{state.error}</div> : null}
      {state.resolved ? (
        <div role="alert">Congrats! You're signed in!</div>
      ) : null}
    </div>
  );
}

export default Login;
```

```jsx
// __tests__/login.js
// again, these first two imports are something you'd normally handle in
// your testing framework configuration rather than importing them in every file.
import "@testing-library/jest-dom";
import * as React from "react";
// import API mocking utilities from Mock Service Worker.
import { rest } from "msw";
import { setupServer } from "msw/node";
// import testing utilities
import { render, fireEvent, screen } from "@testing-library/react";
import Login from "../login";

const fakeUserResponse = { token: "fake_user_token" };
const server = setupServer(
  rest.post("/api/login", (req, res, ctx) => {
    return res(ctx.json(fakeUserResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  window.localStorage.removeItem("token");
});
afterAll(() => server.close());

test("allows the user to login successfully", async () => {
  render(<Login />);

  // fill out the form
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "chuck" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "norris" },
  });

  fireEvent.click(screen.getByText(/submit/i));

  // just like a manual tester, we'll instruct our test to wait for the alert
  // to show up before continuing with our assertions.
  const alert = await screen.findByRole("alert");

  // .toHaveTextContent() comes from jest-dom's assertions
  // otherwise you could use expect(alert.textContent).toMatch(/congrats/i)
  // but jest-dom will give you better error messages which is why it's recommended
  expect(alert).toHaveTextContent(/congrats/i);
  expect(window.localStorage.getItem("token")).toEqual(fakeUserResponse.token);
});

test("handles server exceptions", async () => {
  // mock the server error response for this test suite only.
  server.use(
    rest.post("/api/login", (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ message: "Internal server error" })
      );
    })
  );

  render(<Login />);

  // fill out the form
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "chuck" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "norris" },
  });

  fireEvent.click(screen.getByText(/submit/i));

  // wait for the error message
  const alert = await screen.findByRole("alert");

  expect(alert).toHaveTextContent(/internal server error/i);
  expect(window.localStorage.getItem("token")).toBeNull();
});
```

> We recommend using [Mock Service Worker](https://github.com/mswjs/msw) library
> to declaratively mock API communication in your tests instead of stubbing
> `window.fetch`, or relying on third-party adapters.

### More Examples

> We're in the process of moving examples to the
> [docs site](https://testing-library.com/docs/example-codesandbox)

You'll find runnable examples of testing with different libraries in
[the `react-testing-library-examples` codesandbox](https://codesandbox.io/s/github/kentcdodds/react-testing-library-examples).
Some included are:

- [`react-redux`](https://codesandbox.io/s/github/kentcdodds/react-testing-library-examples/tree/main/?fontsize=14&module=%2Fsrc%2F__tests__%2Freact-redux.js&previewwindow=tests)
- [`react-router`](https://codesandbox.io/s/github/kentcdodds/react-testing-library-examples/tree/main/?fontsize=14&module=%2Fsrc%2F__tests__%2Freact-router.js&previewwindow=tests)
- [`react-context`](https://codesandbox.io/s/github/kentcdodds/react-testing-library-examples/tree/main/?fontsize=14&module=%2Fsrc%2F__tests__%2Freact-context.js&previewwindow=tests)

You can also find React Testing Library examples at
[react-testing-examples.com](https://react-testing-examples.com/jest-rtl/).

## Hooks

If you are interested in testing a custom hook, check out [React Hooks Testing
Library][react-hooks-testing-library].

> NOTE: it is not recommended to test single-use custom hooks in isolation from
> the components where it's being used. It's better to test the component that's
> using the hook rather than the hook itself. The `React Hooks Testing Library`
> is intended to be used for reusable hooks/libraries.
