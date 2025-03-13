import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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