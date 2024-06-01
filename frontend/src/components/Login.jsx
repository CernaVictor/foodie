import { Alert, Button, Link, TextField, styled } from "@mui/material";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/LoginContext";
import "../styles/Login.css";

export function Login() {
  const formRef = useRef(null);
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  async function handleFormSubmit(values) {
    const payload = {
      email: values["email"],
      password: values["password"],
    };

    try {
      await login(payload);
      if (!error) {
        navigate("/");
      }
    } catch (e) {
      console.error("Login failed:", e);
    }
  }

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <form
        autoComplete="off"
        className="login-container"
        id="loginForm"
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          handleFormSubmit(Object.fromEntries(new FormData(formRef.current)));
        }}
        onChange={() => setError("")}
      >
        <div className="login-text">Welcome back! Log in to your account</div>
        <div className="login-content">
          <CustomTextField
            id="email-input"
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
          />
          <CustomTextField
            id="password-input"
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            fullWidth
          />
        </div>
        <Button
          variant="contained"
          style={{ background: "#ed2647" }}
          type="submit"
          form="loginForm"
        >
          Login
        </Button>
        <div>
          Don't have an account yet?{" "}
          <Link
            href="/register"
            underline="hover"
            color={"#ed2647"}
            className="register-text"
          >
            Register
          </Link>
        </div>
      </form>
    </>
  );
}

const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#ed2647",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#ed2647",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#ed2647",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ed2647",
    },
  },
});
