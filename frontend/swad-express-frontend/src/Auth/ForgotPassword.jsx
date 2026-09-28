import { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { api } from "../components/config/api";
import { notify } from "../components/config/notifications";

const fieldStyle = {
  mb: 1.5,
  "& .MuiInputLabel-root": { color: "#9ca3af" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "10px",
    "& fieldset": { borderColor: "#3f3f46" },
    "&:hover fieldset": { borderColor: "#7f1d1d" },
    "&.Mui-focused fieldset": { borderColor: "#dc2626" },
  },
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitEmail = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      notify(data.message || "OTP sent to your email.", "success");
      setStep("reset");
    } catch (requestError) {
      console.error("Unable to send password reset OTP:", requestError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      notify("Password and confirm password must match.", "error");
      return;
    }
    if (password.length < 6) {
      notify("Password must be at least 6 characters.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post("/auth/reset-password", {
        email,
        otp,
        password,
        confirmPassword,
      });
      notify(data.message || "Password reset successfully.", "success");
      setTimeout(() => navigate("/account/login"), 1200);
    } catch (requestError) {
      console.error("Unable to reset password:", requestError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-110 rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6! shadow-2xl sm:p-7!">
      <IconButton
        onClick={() => navigate("/account/login")}
        aria-label="Close forgot password"
        sx={{ position: "absolute", top: 10, right: 10, color: "#9ca3af" }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 1, mt: 1 }}>
        Forgot Password
      </Typography>
      <Typography sx={{ color: "#9ca3af", mb: 2.5, fontSize: 14 }}>
        {step === "email"
          ? "Enter your email and we will send you a password reset OTP."
          : `Enter the OTP sent to ${email}, then create a new password.`}
      </Typography>

      {step === "email" ? (
        <form onSubmit={submitEmail}>
          <TextField
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            fullWidth
            size="small"
            sx={fieldStyle}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ py: 1.25, borderRadius: "10px", bgcolor: "#7a1f1f", "&:hover": { bgcolor: "#5f1818" } }}
          >
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={resetPassword}>
          <TextField
            label="OTP"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            fullWidth
            size="small"
            inputProps={{ inputMode: "numeric", maxLength: 6 }}
            sx={fieldStyle}
          />
          <TextField
            label="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            size="small"
            sx={fieldStyle}
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
          <TextField
            label="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type={showConfirmPassword ? "text" : "password"}
            required
            fullWidth
            size="small"
            error={Boolean(confirmPassword) && password !== confirmPassword}
            helperText={
              confirmPassword && password !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
            sx={fieldStyle}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      edge="end"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      title={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      sx={{ color: "#9ca3af" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting || password !== confirmPassword}
            sx={{ py: 1.25, borderRadius: "10px", bgcolor: "#7a1f1f", "&:hover": { bgcolor: "#5f1818" } }}
          >
            {isSubmitting ? "Resetting..." : "Verify OTP & Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
