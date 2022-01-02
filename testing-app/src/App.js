import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <form>
        <label htmlFor="username">Email address</label>
        <input type="email" name="username" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <label htmlFor="cpassword">Confirm Password</label>
        <input type="password" name="cpassword" id="cpassword" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
