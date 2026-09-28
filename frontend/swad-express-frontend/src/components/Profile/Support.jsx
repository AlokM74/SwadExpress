import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const SUPPORT_EMAIL = "support.swadexpress@gmail.com";

const Support = () => (
  <Box
    className="profile-scrollbar-hidden"
    sx={{
      width: "100%",
      height: "100%",
      overflowY: "auto",
      bgcolor: "#0e0e0e",
      color: "#e5e5e5",
      px: { xs: 2, sm: 4, md: 6 },
      py: { xs: 3, sm: 5 },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      <HelpOutlineOutlinedIcon sx={{ color: "#FFA726" }} />
      <Typography sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 600 }}>
        Help & Support
      </Typography>
    </Box>
    <Typography sx={{ color: "#9ca3af", fontSize: 14, mb: 3 }}>
      Find answers or contact us when you need help with your SwadExpress order.
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: 2,
        mb: 3,
      }}
    >
      {[
        {
          icon: EmailOutlinedIcon,
          title: "Email support",
          text: "We will respond to your question as soon as possible.",
        },
      ].map(({ icon: Icon, title, text }) => (
        <Box
          key={title}
          sx={{
            bgcolor: "#161616",
            border: "1px solid #2a2a2a",
            borderRadius: 3,
            p: 2.5,
          }}
        >
          <Icon sx={{ color: "#FFA726", mb: 1 }} />
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
          <Typography sx={{ color: "#9ca3af", fontSize: 13, mb: 2 }}>
            {text}
          </Typography>
          <Button
            component="a"
            href={`mailto:${SUPPORT_EMAIL}`}
            variant="outlined"
            size="small"
            sx={{
              color: "#fff",
              borderColor: "#4a4a4a",
              textTransform: "none",
              "&:hover": { borderColor: "#FFA726" },
            }}
          >
            Contact support
          </Button>
        </Box>
      ))}
    </Box>

    <Box sx={{ bgcolor: "#161616", border: "1px solid #2a2a2a", borderRadius: 3, p: 2.5 }}>
      <Typography sx={{ fontWeight: 600, mb: 1 }}>Frequently asked questions</Typography>
      <Divider sx={{ borderColor: "#2a2a2a" }} />
      <List disablePadding>
        {[
          ["Where can I track my order?", "Open Orders to view the latest delivery status."],
          ["Can I change my delivery address?", "Contact support as soon as possible after placing the order."],
          ["What happens if an item is missing?", "Contact support with your order number so we can help."],
        ].map(([question, answer]) => (
          <ListItem key={question} disableGutters sx={{ py: 1.25 }}>
            <ListItemText
              primary={question}
              secondary={answer}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
              secondaryTypographyProps={{ fontSize: 13, color: "#9ca3af", mt: 0.5 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  </Box>
);

export default Support;
