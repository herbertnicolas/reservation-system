import { Grid2, Typography } from "@mui/material";
import { PrivateLayout } from "../../components/PrivateLayout/PrivateLayout";
import { DataTableEquip } from "./components/Table/DataTableEquip";
import { Button } from "../../components/ui/button";
import { Edit, MoreVertical, Trash } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { columns } from "./components/Table/Columns";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmation";
import { toast } from "react-toastify";

export default function EquipManagement() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipId, setSelectedEquipId] = useState(null);
  const [selectedSalaId, setSelectedSalaId] = useState(null);
  const [equipmentData, setEquipmentData] = useState([]);

  const handleEdit = (equipId) => {
    navigate(`/equipamento-edicao/${equipId}`);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/equipsala/${selectedSalaId}/${selectedEquipId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar equipamento");
      }

      setIsModalOpen(false);
      toast.success("Equipamento removido com sucesso!");
      fetchEquipments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  async function getEquipments() {
    const response = await fetch("http://localhost:3001/equipsala");
    return response.json();
  }

  async function fetchEquipments() {
    try {
      const data = await getEquipments();
      setEquipmentData(data.data);
    } catch (error) {
      toast.error("Erro ao carregar equipamentos");
    }
  }

  useEffect(() => {
    fetchEquipments();
  }, []);

  const actionColumn = {
    id: "actions",
    cell: ({ row }) => {
      const equiproom = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => handleEdit(equiproom.equipamento._id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedEquipId(equiproom.equipamento._id);
              setSelectedSalaId(equiproom.sala._id);
              setIsModalOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  };

  return (
    <>
      <PrivateLayout>
        <Grid2 container className="grid grid-rows-1 flex-grow p-4 w-auto h-fit mx-2">
          <Grid2 id="main" item xs={12} className="p-4">
            <Typography variant="h4">Gestão de Equipamentos</Typography>
          </Grid2>
          <Grid2 item xs={12} className="p-4">
            <DataTableEquip 
              columns={[...columns, actionColumn]} 
              data={equipmentData} 
            />
          </Grid2>
        </Grid2>
      </PrivateLayout>
      {isModalOpen && (
        <DeleteConfirmationDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}