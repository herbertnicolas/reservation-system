import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home";
import RoomsManagement from "./pages/RoomsManagement/RoomsManagement";
import CreateRoom from "./pages/RoomsManagement/CreateRoom/CreateRoom";
import EditRoom from "./pages/RoomsManagement/EditRoom/EditRoom";
import "./index.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./output.css";
import StudentOptions from "./pages/StudentOptions/StudentOptions";
import AdminOptions from "./pages/AdminOptions/AdminOptions";
/*Equipamentos*/
import EquipManagement from "./pages/EquipManagement/EquipManagement";
import CDEquipForm from "./pages/EquipManagement/CDEquipForm";
import EditEquipForm from "./pages/EquipManagement/EditEquipForm"; 
import RoomReservation from "./pages/ReservationsManagement/RoomReservation/RoomReservation";
import EquipmentReservation from "./pages/ReservationsManagement/EquipmentReservation/EquipmentReservation";
import ReservationsManagement from "./pages/ReservationsManagement/ReservationsManagement";
/*Historico*/
import HistoryManagement from "./pages/HistoryManagement/HistoryManagement";
import SearchHistory from "./pages/HistoryManagement/SearchHistory";
import ResourceOptions from "./pages/ResourcesOptions/ResourcesOptions";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/alunos" element={<StudentOptions />} />
        <Route path="/administrador" element={<AdminOptions />} />
        {/* SALAS */}
        <Route path="/gestao-salas" element={<RoomsManagement />} />
        <Route path="/sala-cadastro" element={<CreateRoom />} />
        <Route path="/editar-sala/:id" element={<EditRoom />} />
        {/* EQUIPAMENTOS */}
        <Route path="/reservar-sala" element={<RoomReservation />} />
        <Route path="/reservar-equipamento" element={<EquipmentReservation />} />
        <Route path="/equipamento-gestao" element={<EquipManagement />} /> 
        <Route path="/equipamento-cadastro" element={<CDEquipForm />} /> 
        <Route path="/equipamento-edicao/:id" element={<EditEquipForm />} /> 
        {/*RESERVAS*/}
        <Route path="/gestao-reservas" element={<ReservationsManagement />} />
        {/* HISTORICO */}
        <Route path="/historico" element={<HistoryManagement />} />
        <Route path="/historico/buscar" element={<SearchHistory />} />
        <Route path="/opcoes-recurso" element={<ResourceOptions />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
