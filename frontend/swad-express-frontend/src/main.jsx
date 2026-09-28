import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "./Theme/darkTheme.js";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./State/Store.js";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ThemeProvider>,
);
