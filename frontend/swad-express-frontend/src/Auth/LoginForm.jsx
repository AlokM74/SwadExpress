import {
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box } from "@mui/system";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginUser } from "../State/Authentication/Action";


const initialValues = {
  email: "",
  password: "",
};

const fontStyle = {
  fontFamily: "Space Grotesk, sans-serif",
  letterSpacing: "0.3px",
};

const inputStyle = {
  mb: 1.5,

  "& .MuiInputLabel-root": {
    color: "#9ca3af",
    fontFamily: "Space Grotesk, sans-serif",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#dc2626",
  },

  "& .MuiOutlinedInput-root": {
    color: "#fff",
    fontFamily: "Space Grotesk, sans-serif",
    borderRadius: "10px",

    "& fieldset": {
      borderColor: "#3f3f46",
    },

    "&:hover fieldset": {
      borderColor: "#7f1d1d",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#dc2626",
    },
  },
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values) => {
    dispatch(loginUser({userData:values,navigate}))
    console.log(values);
  };

  return (
    <div
      className="
        bg-[#111111]
        p-6!
        sm:p-7!
        rounded-2xl
        relative
        w-full
        max-w-110
        mx-auto
        border
        border-[#2a2a2a]
        shadow-2xl
      "
    >
      
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 36,
          height: 36,
          color: "#9ca3af",

          "&:hover": {
            color: "#ef4444",
            backgroundColor: "rgba(220, 38, 38, 0.12)",
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      
      <Typography
        variant="h5"
        className="text-center font-bold!"
        sx={{
          ...fontStyle,
          fontSize: {
            xs: "1.5rem",
            sm: "1.7rem",
          },
          color: "#ffffff",
          mb: 0.5,
          mt: 1,
        }}
      >
        Welcome Back
      </Typography>

      
      <Typography
        className="text-center!"
        sx={{
          ...fontStyle,
          fontWeight: 400,
          fontSize: "0.85rem",
          color: "#9ca3af",
          mb: 2.5,
        }}
      >
        Log in to continue ordering delicious food
      </Typography>

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
      >
        <Form>

          
          <Field
            as={TextField}
            name="email"
            label="Email"
            fullWidth
            size="small"
            variant="outlined"
            sx={inputStyle}
          />

          
          <Field
            as={TextField}
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="small"
            variant="outlined"
            sx={inputStyle}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                      sx={{ color: "#9ca3af" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 0,
              mb: 1,
            }}
          >
            <Button
              onClick={() => navigate("/account/forgot-password")}
              variant="text"
              type="button"
              sx={{
                textTransform: "none",
                minWidth: "auto",
                padding: 0,
                color: "#ef4444",
                fontSize: "0.8rem",
                fontWeight: 600,
                ...fontStyle,

                "&:hover": {
                  color: "#f87171",
                  backgroundColor: "transparent",
                },
              }}
            >
              Forgot Password?
            </Button>
          </Box>

          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              py: 1.25,
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 700,
              textTransform: "none",
              ...fontStyle,

              background:
                "linear-gradient(135deg, #dc2626, #991b1b)",

              boxShadow:
                "0 8px 25px rgba(220, 38, 38, 0.25)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #ef4444, #b91c1c)",

                boxShadow:
                  "0 10px 30px rgba(220, 38, 38, 0.35)",
              },
            }}
          >
            Login
          </Button>
        </Form>
      </Formik>

      
      <Typography
        align="center"
        sx={{
          mt: 2.5,
          color: "#9ca3af",
          fontSize: "0.85rem",
          ...fontStyle,
          fontWeight: 400,
        }}
      >
        Don't have an account?

        <Button
          onClick={() => navigate("/account/register")}
          sx={{
            textTransform: "none",
            color: "#ef4444",
            fontWeight: 700,
            fontSize: "0.85rem",
            ...fontStyle,
            ml: 0.5,

            "&:hover": {
              color: "#f87171",
              backgroundColor: "transparent",
            },
          }}
        >
          Register
        </Button>
      </Typography>
    </div>
  );
};

export default LoginForm;