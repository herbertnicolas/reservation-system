import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./output.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Home from "./pages/Home/Home";
import "./index.css";
import RoomsManagement from "./pages/RoomsManagement/RoomsManagement";

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        {/* Salas */}
        <Routes>
          <Route path="/gestao-salas" element={<RoomsManagement />} />
        </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
