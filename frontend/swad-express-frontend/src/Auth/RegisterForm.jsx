import {
  Button,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  verifyRegistration,
} from "../State/Authentication/Action";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: "ROLE_CUSTOMER",
  otp: "",
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

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector((store) => store.auth.error);
  const [otpSent, setOtpSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    if (otpSent) {
      dispatch(
        verifyRegistration({
          email: registeredEmail,
          otp: values.otp,
          navigate,
        }),
      );
      return;
    }

    setSendingOtp(true);
    try {
      const sent = await dispatch(registerUser({ userData: values, navigate }));
      if (sent) {
        setRegisteredEmail(values.email);
        setOtpSent(true);
      }
    } finally {
      setSendingOtp(false);
    }
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
        {otpSent ? "Verify Your Email" : "Create Account"}
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
        {otpSent
          ? `Enter the OTP sent to ${registeredEmail}`
          : "Register to start ordering delicious food"}
      </Typography>

      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({ values, handleChange }) => (
          <Form>
            {otpSent ? (
              <div className="rounded-xl border border-green-500/40 bg-green-950/20 p-4!">
                <Typography sx={{ color: "#86efac", fontSize: 13, mb: 1.5 }}>
                  {sendingOtp
                    ? "Sending OTP to your email..."
                    : "Check your inbox, Spam, and Promotions for the OTP."}
                </Typography>
                <Field
                  as={TextField}
                  name="otp"
                  label="Enter 6-digit OTP"
                  fullWidth
                  autoFocus
                  size="small"
                  variant="outlined"
                  slotProps={{
                    htmlInput: {
                      maxLength: 6,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                  }}
                  sx={inputStyle}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={sendingOtp}
                  sx={{
                    py: 1.25,
                    borderRadius: "10px",
                    fontWeight: 700,
                    textTransform: "none",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    },
                  }}
                >
                  Verify OTP
                </Button>
                {authError && !sendingOtp && (
                  <Typography sx={{ color: "#fca5a5", fontSize: 12, mt: 1 }}>
                    {typeof authError === "string"
                      ? authError
                      : "Unable to send OTP. Please try again."}
                  </Typography>
                )}
              </div>
            ) : (
              <>
                
                <Field
                  as={TextField}
                  name="fullName"
                  label="Full Name"
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={inputStyle}
                />

                
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
                            onClick={() =>
                              setShowPassword((visible) => !visible)
                            }
                            edge="end"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            title={
                              showPassword ? "Hide password" : "Show password"
                            }
                            sx={{ color: "#9ca3af" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    mb: 2,

                    "& .MuiInputLabel-root": {
                      color: "#9ca3af",
                      fontFamily: "Space Grotesk, sans-serif",
                    },

                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#dc2626",
                    },

                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      borderRadius: "10px",
                      fontFamily: "Space Grotesk, sans-serif",

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

                    "& .MuiSvgIcon-root": {
                      color: "#9ca3af",
                    },
                  }}
                >
                  <InputLabel>Role</InputLabel>

                  <Select
                    name="role"
                    value={values.role}
                    label="Role"
                    onChange={handleChange}
                  >
                    <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>

                    <MenuItem value="ROLE_RESTAURANT_OWNER">
                      Restaurant Owner
                    </MenuItem>
                  </Select>
                </FormControl>

                
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={sendingOtp}
                  sx={{
                    py: 1.25,
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textTransform: "none",
                    ...fontStyle,

                    background: "linear-gradient(135deg, #dc2626, #991b1b)",

                    boxShadow: "0 8px 25px rgba(220, 38, 38, 0.25)",

                    "&:hover": {
                      background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                      boxShadow: "0 10px 30px rgba(220, 38, 38, 0.35)",
                    },
                  }}
                >
                  {sendingOtp ? "Sending OTP..." : "Register"}
                </Button>
                {authError && (
                  <Typography sx={{ color: "#fca5a5", fontSize: 12, mt: 1 }}>
                    {typeof authError === "string"
                      ? authError
                      : "Unable to create your account. Please try again."}
                  </Typography>
                )}
              </>
            )}
          </Form>
        )}
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
        {otpSent ? "Didn't receive the OTP?" : "Already have an account?"}

        <Button
          onClick={() =>
            otpSent ? setOtpSent(false) : navigate("/account/login")
          }
          sx={{
            textTransform: "none",
            color: "#ef4444",
            fontWeight: 700,
            fontSize: "0.85rem",
            ...fontStyle,

            "&:hover": {
              color: "#f87171",
              backgroundColor: "transparent",
            },
          }}
        >
          {otpSent ? "Edit registration" : "Login"}
        </Button>
      </Typography>
    </div>
  );
};

export default RegisterForm;
