import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AllData } from "./Component/Store/Store";
import axios from "axios";

export default function Login() {
  axios.defaults.withCredentials = true;
  const { handleAuth } = useContext(AllData);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    axios
      .post("/login-admin", { email, password })
      .then((res) => {
        console.log(res);
        if (res.data.Status === "Success") {
          handleAuth(true);
          localStorage.setItem("token", res.data.token);
          console.log(localStorage.getItem("token"));
          navigate("/");
        } else {
          setError(res.data.Error);
        }
      })
      .catch((error) => setError(error));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "475px" }}
    >
      <div className="card text-white bg-dark mb-3 p-4">
        <h1 className="p-2 fs-4 text-center">Log in Here</h1>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                required
              />
              <small>
                <Link to="#" className="text-decoration-none d-block pt-2">
                  Forgot password?
                </Link>
              </small>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button
              type="submit"
              className="btn btn-dark w-100 mb-2 bg-primary"
            >
              LOGIN
            </button>
          </form>
          <p className="mt-2 fs-5 text-center">
            Don't have an account?
            <Link to="/companyregister" className="text-decoration-none">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
