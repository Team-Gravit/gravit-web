import { createRoot } from "react-dom/client";
import "./style.css";
import typescriptLogo from "/typescript.svg";

const App = () => (
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" className="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img
        src={typescriptLogo}
        className="logo vanilla"
        alt="TypeScript logo"
      />
    </a>
    <h1>Web</h1>
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
