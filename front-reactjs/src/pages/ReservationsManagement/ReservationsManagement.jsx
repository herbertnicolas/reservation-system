import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PrivateLayout } from "../../components/PrivateLayout/PrivateLayout";
import { EditReservationStatusModal } from "./components/EditReservationStatusModal/EditReservationStatusModal";
import { ReservationsTable } from "./components/ReservationsTable/ReservationsTable";
import { FilterReservationModal } from "./components/FilterReservationModal/FilterReservationModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ReservationsManagement() {
  const navigate = useNavigate();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState([]);

  const fetchReservations = async (status = "") => {
    try {

      const endpoint = status 
      ? `http://localhost:3001/verificarreservas/status?status=${status}`
      : `http://localhost:3001/verificarreservas`;
      const response = await fetch(endpoint);
      if (!responde.ok) {
        const errorData = await responde.json();
        throw new Error(errorData.msg || "Erro ao carregar reservas.")
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Formato inválido.")
      }
      setReservations(data);
    } catch (error) {
      toast.error('Erro ao carregar reservas.');
    }
  };

  useEffect(() => {
    fetchReservations(filteredStatus);
  }, [filteredStatus]);

  const handleOpenEditModal = (reservation) => {
    setSelectedReservation(reservation);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedReservation(null);
  };

  // confirmar a reserva
  const handleConfirm = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/verificarreservas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statusReserva: 'confirmada' }),
      });
      
      if (response.ok) {
        toast.success("Status da reserva atualizado!");
        fetchReservations(filteredStatus);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        throw new Error(data.msg || 'Erro ao atualizar status.');
      }
    } catch (error) {
      toast.error(`Erro ao confirmar reserva: ${error.message}`);
    }
  };

  // cancelar a reserva
  const handleCancel = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/verificarreservas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statusReserva: 'cancelada' }),
      });

      if (response.ok) {
        toast.success("Status da reserva atualizado com sucesso!");
        fetchReservations(filteredStatus);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        throw new Error(data.msg || 'Erro ao atualizar status.');
      }
    } catch (error) {
      toast.error(`Erro ao cancelar reserva: ${error.message}`);
    }
  };

  // filtro
  const handleApplyFilter = (status) => {
    setFilteredStatus(status);
    fetchReservations(status);
    setFilterModalOpen(false);
  };

return (
  <PrivateLayout>
    <div className="ReservationsManagement p-4 bg-white min-h-screen">

      {/* botão voltar */}
      <div
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer mb-4 text-gray-700 hover:text-black"
      >
        <ChevronLeft size={24} />
        <span className="ml-1">Voltar</span>
      </div>

      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Reservas</h1>
      
      {/* botões filtragem */}
      <div className="flex space-x-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          onClick={() => setFilterModalOpen(true)}
        >
          Filtrar Reservas
        </button>
      </div>

      <ReservationsTable
        reservations={reservations}
        onEdit={handleOpenEditModal}
      />

      {isEditModalOpen && (
        <EditReservationStatusModal
          isOpen={isEditModalOpen}
          onConfirm={() => handleConfirm(selectedReservation.id)}
          onCancel={() => handleCancel(selectedReservation.id)}
          onClose={handleCloseModal}
        />
      )}

      <FilterReservationModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApplyFilter={handleApplyFilter}
      />

      <ToastContainer />
    </div>
  </PrivateLayout>
  );
}

export default ReservationsManagement;
