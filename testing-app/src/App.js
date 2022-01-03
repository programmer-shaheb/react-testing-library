import { useState } from "react";
import validator from "validator";

function App() {
  const [signupInput, setSignupInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    if (!validator.isEmail(signupInput.email)) {
      setError("The Email You Type Is Invalid!");
      return;
    } else if (!validator.isStrongPassword(signupInput.password)) {
      setError("Password is too weak!");
      return;
    } else if (signupInput.password !== signupInput.confirmPassword) {
      setError("Password Don't Match!");
      return;
    }

    console.log(signupInput);
    setSignupInput({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      <form>
        <label htmlFor="username">Email address</label>
        <input
          type="email"
          name="username"
          id="username"
          value={signupInput.email}
          onChange={(e) =>
            setSignupInput({ ...signupInput, email: e.target.value })
          }
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={signupInput.password}
          onChange={(e) =>
            setSignupInput({ ...signupInput, password: e.target.value })
          }
          name="password"
          id="password"
        />
        <label htmlFor="cpassword">Confirm Password</label>
        <input
          type="password"
          name="cpassword"
          value={signupInput.confirmPassword}
          onChange={(e) =>
            setSignupInput({ ...signupInput, confirmPassword: e.target.value })
          }
          id="cpassword"
        />
        {error && <p>{error}</p>}
        <button type="submit" onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
