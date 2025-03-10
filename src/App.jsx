import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";
import { FloatButton } from "antd";

function App() {
  return (
    <BrowserRouter>
      <Router />
      <FloatButton.BackTop />
    </BrowserRouter>
  );
}

export default App;