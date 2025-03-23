import { Edit, MoreVertical, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { equipSalaService } from "@/services/equipSalaService";

import { DataTableEquip } from "./components/Table/DataTableEquip";
import { columns } from "./components/Table/Columns";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";

import { Grid2, Typography } from "@mui/material";
import { PrivateLayout } from "@/components/PrivateLayout/PrivateLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EquipManagement() {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEquipId, setSelectedEquipId] = useState(null);
  const [selectedSalaId, setSelectedSalaId] = useState(null);
  const [equipmentData, setEquipmentData] = useState([]);

  const handleEdit = (equipId) => {
    navigate(`/equipamento-edicao/${equipId}`);
  };

  const handleDelete = async () => {
    try {
      await equipSalaService.removeEquipamento(selectedSalaId, selectedEquipId);
      
      setIsDeleteModalOpen(false);
      toast.success("Equipamento removido da sala com sucesso!");
      fetchEquipments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchEquipments = async () => {
    try {
      const response = await equipSalaService.getAllEquipSala();
      setEquipmentData(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const actionColumn = {
    id: "actions",
    cell: ({ row }) => {
      const equiproom = row.original;
      return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{ backgroundColor: "white" }}>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => handleEdit(equiproom.equipamento._id)}
          >
            <Edit className="mr-2 h-3 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
              setSelectedEquipId(equiproom.equipamento._id);
              setSelectedSalaId(equiproom.sala._id);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" style={{ color: "red" }} />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      );
    },
  };

  return (
    <>
      <PrivateLayout>
        <Grid2 container className="grid grid-rows-1 flex-grow p-4 w-auto h-fit mx-2">
          <Grid2 id="main" size={12} className="p-4">
            <Typography variant="h4">Gestão de Equipamentos</Typography>
          </Grid2>
          <Grid2 size={12} className="p-4">
            <DataTableEquip 
              columns={[...columns, actionColumn]} 
              data={equipmentData} 
            />
          </Grid2>
        </Grid2>
      </PrivateLayout>
      {isDeleteModalOpen && (
        <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Deseja realmente remover este equipamento da sala?"
        description="O equipamento continuará disponível para ser adicionado novamente a esta ou outras salas."
    />
      )}
    </>
  );
}