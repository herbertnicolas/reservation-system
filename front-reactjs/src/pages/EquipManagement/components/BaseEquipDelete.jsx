import { useState } from 'react';
import { toast } from 'react-toastify';
import { X } from "lucide-react"; 
import { equipSalaService } from '@/services/equipSalaService';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid2 } from "@mui/material";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from './DeleteConfirmation';

export function BaseEquipDelete({ equipamentos, onEquipamentoDeleted }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEquipId, setSelectedEquipId] = useState(null);

  const handleDelete = async () => {
    try {
      await equipSalaService.deleteEquipamento(selectedEquipId);
      toast.success('Equipamento deletado com sucesso');
      onEquipamentoDeleted();
      setIsDeleteModalOpen(false);
      setSelectedEquipId(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Grid2
    container
    spacing={2}
    className="flex items-center gap-5" 
    style={{ maxWidth: "70vw" }}
  >
    <Grid2 size={8} className="grid w-full max-w-sm items-center gap-1.5">
      <div className="relative w-full"> 
        {selectedEquipId && (
          <button
            type="button"
            onClick={() => setSelectedEquipId(null)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full z-10"
            aria-label="Limpar seleção"
          >
            <X size={16} />
          </button>
        )}
        <Select
          value={selectedEquipId || ""}
          onValueChange={setSelectedEquipId}
        >
          <SelectTrigger className={`bg-white ${selectedEquipId ? 'pl-8' : ''}`}>
            <SelectValue placeholder="Selecione um equipamento" />
          </SelectTrigger>
          <SelectContent>
            {equipamentos.map((equip) => (
              <SelectItem key={equip.id} value={equip.id}>
                {equip.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Grid2>

      <Button
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={!selectedEquipId}
        variant="destructive"
      >
        Remover Equipamento
      </Button>

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        message="Deseja realmente remover este equipamento da base de dados?"
      />
    </Grid2>
  );
}