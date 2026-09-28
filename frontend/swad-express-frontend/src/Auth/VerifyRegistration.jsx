import { Button, TextField, Typography } from "@mui/material";
import { Form, Formik, Field } from "formik";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyRegistration } from "../State/Authentication/Action";

const VerifyRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = new URLSearchParams(useLocation().search).get("email") || "";

  return (
    <div className="bg-[#111111] p-6! rounded-2xl w-full max-w-110 mx-auto border border-[#2a2a2a] shadow-2xl">
      <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
        Verify your email
      </Typography>
      <Typography sx={{ color: "#9ca3af", mb: 2.5, fontSize: 14 }}>
        Enter the 6-digit OTP sent to {email}.
      </Typography>
      <Formik
        initialValues={{ otp: "" }}
        onSubmit={(values) => dispatch(verifyRegistration({ email, otp: values.otp, navigate }))}
      >
        <Form>
          <Field
            as={TextField}
            name="otp"
            label="Verification OTP"
            fullWidth
            autoFocus
            slotProps={{
              htmlInput: { maxLength: 6, inputMode: "numeric" },
            }}
            sx={{
              mb: 2,
              "& .MuiInputBase-input, & .MuiInputLabel-root": { color: "#fff" },
              "& fieldset": { borderColor: "#3f3f46" },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#7a1f1f", "&:hover": { bgcolor: "#5f1818" } }}
          >
            Verify OTP
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default VerifyRegistration;
