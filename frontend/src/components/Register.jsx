import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Link,
  TextField,
  styled,
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import foodieLogo from "../assets/foodieLogo.png";
import "../styles/Register.css";

export function Register() {
  const formRef = useRef(null);
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleFormSubmit(values) {
    const payload = {
      firstName: values["firstName"],
      lastName: values["lastName"],
      email: values["email"],
      password: values["password"],
      confirmPassword: values["password"],
      role: role,
      phoneNumber: values["phoneNumber"],
    };

    fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (response.ok) {
        setOpen(true);
      } else {
        const errorData = await response.json();
        setErrors(errorData);
      }
    });
  }

  const handleLoginRedirect = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <form
      autoComplete="off"
      className="register-container"
      id="registerForm"
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();
        handleFormSubmit(Object.fromEntries(new FormData(formRef.current)));
      }}
    >
      <div className="register-text">
        Looks like you don't have an account. Let's create a new account for
        you.
      </div>
      <div className="register-content">
        <CustomTextField
          id="first-name-input"
          label="First name"
          variant="outlined"
          fullWidth
          name="firstName"
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <CustomTextField
          id="last-name-input"
          label="Last name"
          variant="outlined"
          fullWidth
          name="lastName"
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <CustomTextField
          id="phone-number-input"
          label="Phone number"
          variant="outlined"
          fullWidth
          name="phoneNumber"
          type="tel"
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
        <CustomTextField
          id="email-input"
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          error={!!errors.email}
          helperText={errors.email}
        />
        <CustomTextField
          id="password-input"
          label="Password"
          variant="outlined"
          name="password"
          type="password"
          fullWidth
          error={!!errors.password}
          helperText={errors.password}
        />
        <CustomTextField
          id="confirm-password-input"
          label="Confirm Password"
          variant="outlined"
          name="confirmPassword"
          type="password"
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
      </div>
      <div>
        <FormControlLabel
          value="start"
          control={
            <Checkbox
              sx={{ color: "#ed2647", "&.Mui-checked": { color: "#ed2647" } }}
              onChange={() => setRole("user")}
              checked={role === "user"}
            />
          }
          label="Client"
        />
        <FormControlLabel
          value="top"
          control={
            <Checkbox
              sx={{ color: "#ed2647", "&.Mui-checked": { color: "#ed2647" } }}
              onChange={() => setRole("driver")}
              checked={role === "driver"}
            />
          }
          label="Driver"
        />
      </div>
      <Button
        variant="contained"
        style={{ background: "#ed2647" }}
        type="submit"
        form="registerForm"
      >
        Register
      </Button>
      <div>
        Already have an account?{" "}
        <Link
          href="/login"
          underline="hover"
          color={"#ed2647"}
          className="register-text"
        >
          Sign in here
        </Link>
      </div>
      <Dialog
        open={open}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="register-modal-title">
          <DialogTitle>Your account has been successfully created!</DialogTitle>
          <img className="logo" alt="logo" src={foodieLogo} />
        </div>
        <DialogContent>
          <DialogContentText>
            Welcome to our community! You can now log in using your credentials
            to start exploring and using our services.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginRedirect} style={{ color: "#ed2647" }}>
            Go to Login
          </Button>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
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
