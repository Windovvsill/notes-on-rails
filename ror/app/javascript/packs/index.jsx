import React from "react";
// import { render } from "react-dom";
import App from "../components/App";
import { createRoot } from "react-dom/client";

// document.addEventListener("DOMContentLoaded", () => {
//   render(<App />, document.body.appendChild(document.createElement("div")));
// });
document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log(document);
    console.log(document.getElementById("app"));

    const container = document.getElementById("app");
    const root = createRoot(container);
    root.render(<App />);
  },
  { once: true }
);
