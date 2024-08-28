import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./pages/main/main";

// Define the button component
const App = () => {
  return <Main />;
};

// Create a root div to attach the React component
const rootDiv = document.createElement("div");
document.body.appendChild(rootDiv);

// Render the React component into the root div
ReactDOM.createRoot(rootDiv).render(<App />);

export default App;
