import { useEffect, useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, IconButton, Slide, Snackbar, Typography } from "@mui/material";
import { APP_NOTIFICATION_EVENT } from "./notifications";

const SlideTransition = (props) => <Slide {...props} direction="down" />;

const AuthNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const current = notifications[0];
  const message = current?.message;
  const isSuccess = current?.severity === "success";
  const isError = current?.severity === "error";
  const duration = 3500;

  useEffect(() => {
    const handleNotification = (event) => {
      const notification = event.detail;
      if (!notification?.message) return;
      setNotifications((previous) => [
        ...previous,
        { ...notification, id: Date.now() + Math.random() },
      ]);
    };
    window.addEventListener(APP_NOTIFICATION_EVENT, handleNotification);
    return () => window.removeEventListener(APP_NOTIFICATION_EVENT, handleNotification);
  }, []);

  const closeNotification = () =>
    setNotifications((previous) => previous.slice(1));

  return (
    <Snackbar
      open={Boolean(message)}
      key={current?.id}
      onClose={closeNotification}
      slots={{ transition: SlideTransition }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={duration}
      sx={{
        top: { xs: 16, sm: 24 },
        "& .MuiSnackbarContent-root": { padding: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: { xs: "calc(100vw - 32px)", sm: 360 },
          maxWidth: "calc(100vw - 32px)",
          px: 2,
          py: 1.25,
          color: "#fff",
          bgcolor: isSuccess ? "#102b1b" : isError ? "#3b111c" : "#17212b",
          border: `1px solid ${
            isSuccess
              ? "rgba(74, 222, 128, 0.35)"
              : isError
                ? "rgba(251, 113, 133, 0.35)"
                : "rgba(96, 165, 250, 0.35)"
          }`,
          borderRadius: 2.5,
          boxShadow:
            `0 12px 35px rgba(0, 0, 0, 0.45), 0 0 24px ${
              isSuccess ? "rgba(34, 197, 94, 0.3)" : isError ? "rgba(244, 63, 94, 0.25)" : "rgba(59, 130, 246, 0.22)"
            }`,
          animation: "swadToastPop 300ms cubic-bezier(0.22, 1, 0.36, 1)",
          "@keyframes swadToastPop": {
            "0%": { opacity: 0, transform: "translateY(-14px) scale(0.92)" },
            "65%": { opacity: 1, transform: "translateY(2px) scale(1.02)" },
            "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
          }}
        >
          {isSuccess ? <CheckCircleRoundedIcon
            sx={{
              color: "#4ade80",
              fontSize: 28,
              filter: "drop-shadow(0 0 7px rgba(74, 222, 128, 0.65))",
              flexShrink: 0,
            }}
          /> : isError ? <ErrorRoundedIcon
            sx={{
              color: "#fb7185",
              fontSize: 28,
              filter: "drop-shadow(0 0 7px rgba(251, 113, 133, 0.65))",
              flexShrink: 0,
            }}
          /> : <CheckCircleRoundedIcon
            sx={{
              color: "#60a5fa",
              fontSize: 28,
              filter: "drop-shadow(0 0 7px rgba(96, 165, 250, 0.55))",
              flexShrink: 0,
            }}
          />}
          <Typography
            sx={{
              flex: 1,
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 700,
              letterSpacing: 0.15,
            }}
          >
            {message}
          </Typography>
          <IconButton
            aria-label="Dismiss notification"
            size="small"
            onClick={closeNotification}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <Box
            sx={{
              width: "100%",
              height: 2,
              mt: 1,
              overflow: "hidden",
              borderRadius: 999,
              bgcolor: isSuccess
                ? "rgba(74, 222, 128, 0.18)"
                : isError
                  ? "rgba(251, 113, 133, 0.18)"
                  : "rgba(96, 165, 250, 0.18)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: isSuccess ? "#4ade80" : isError ? "#fb7185" : "#60a5fa",
                transformOrigin: "left center",
                animation: "swadToastProgress 3000ms linear forwards",
                "@keyframes swadToastProgress": {
                  from: { transform: "scaleX(1)" },
                  to: { transform: "scaleX(0)" },
                },
              }}
            />
          </Box>
      </Box>
    </Snackbar>
  );
};

export default AuthNotification;
