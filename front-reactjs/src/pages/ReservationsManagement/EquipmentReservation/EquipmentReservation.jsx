import { Grid, Typography } from "@mui/material";
import { PrivateLayout } from "../../../components/PrivateLayout/PrivateLayout";
import { DataTable } from "./components/RoomsTable/data-table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import api from "../../../services/api";
import { ConfirmReservationModal } from "./components/ConfirmReservationModal/ConfirmReservationModal";
import { toast } from "react-toastify";
import "./styles.css";

export default function EquipmentReservation({ children }) {
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState({
    salaId: "",
    equipamentoId: "",
    dataReserva: "",
  });
  const [unavailableDates, setUnavailableDates] = useState([]);

  const confirmReservation = async (selectedDate) => {
    try {
      const formattedDate = formatDateToBr(selectedDate || new Date());
  
      const response = await fetch(`http://localhost:3001/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: selectedEquipment.salaId,
          equipamentoId: selectedEquipment.equipamentoId,
          dataReserva: formattedDate,
          tipo: "equipamento",
        }),
      });
  
      // Verificar se a resposta foi bem-sucedida
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao fazer a reserva");
      }
  
      setIsModalOpen(false);
      toast.success("Solicitação de reserva enviada com sucesso!");
      // Recarregar os dados após uma reserva bem-sucedida
      fetchEquipments();
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const [equipmentsData, setEquipmentsData] = useState([]);

  async function getEquipments() {
    try {
      const response = await fetch(`http://localhost:3001/equipsala`);
      const result = await response.json();
      // Extrair o array de dados da resposta
      return result.data || [];
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
      return [];
    }
  }

  async function fetchEquipments() {
    const data = await getEquipments();
    setEquipmentsData(data);
    console.log(data);
  }
  // Função auxiliar para formatar a data como DD/MM/YYYYd
  const formatDateToBr = (date) => {
    if (!date) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getUnavailableDates = async (equipmentId) => {
    try {
      const response = await fetch(`http://localhost:3001/reservas`);

      const reservas = await response.json();

      // Convertendo as datas string (DD/MM/YYYY) para objetos Date
      const dates = reservas
        .filter((reserva) => reserva.equipamentoId === equipmentId)
        .map((reserva) => {
          const [day, month, year] = reserva.dataReserva.split("/");
          return new Date(year, parseInt(month) - 1, parseInt(day));
        });

      console.log("Datas indisponíveis processadas:", dates);
      setUnavailableDates(dates);
    } catch (error) {
      console.error("Erro ao buscar datas indisponíveis:", error);
      setUnavailableDates([]);
    }
  };

  useEffect(() => {
    fetchEquipments();
    console.log(equipmentsData)
  }, [isModalOpen]);

  const columns = [
    {
      accessorKey: "sala.identificador",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            SALA ALOCADO
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "equipamento.nome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            NOME EQUIPAMENTO
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "quantidade",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            QUANTIDADE
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedEquipment({ equipamentoId: row.original.equipamento._id, salaId: row.original.sala._id });
                getUnavailableDates(row.original._id);
                setIsModalOpen(true);
              }}
              className="reserve-button"
            >
              Reservar
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <>
      <PrivateLayout>
        <Grid
          container
          className="grid grid-rows-1 flex-grow p-4 w-auto h-fit mx-2"
        >
          <Grid id="main" item xs={12} className="p-4">
            <Typography variant="h4">Reservar equipamento</Typography>
            {/* {children} */}
          </Grid>
          <Grid item xs={6} className="p-4">
            <DataTable columns={columns} data={equipmentsData} />
          </Grid>
        </Grid>
      </PrivateLayout>
      {isModalOpen && (
        <ConfirmReservationModal
          id="confirm-reservation-modal"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmReservation}
          selectedEquipment={selectedEquipment}
          unavailableDates={unavailableDates}
        />
      )}
    </>
  );
}
