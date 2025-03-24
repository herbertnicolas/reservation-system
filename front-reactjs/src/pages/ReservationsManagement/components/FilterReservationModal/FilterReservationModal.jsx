import React, {useEffect, useState} from "react";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from "../../../../components/ui/dialog";

export function FilterReservationModal({ isOpen, onClose, onApplyFilter }) {
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedStatus("");
    }
  }, [isOpen]);
  
  const handleApplyFilter = () => {
    if (!selectedStatus) {
      alert("Por favor selecione um status antes de aplicar o filtro.");
      return;
    }
    onApplyFilter(selectedStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black bg-opacity-50" />
      <DialogContent className="flex items-center justify-center bg-white p-6 rounded-md shadow-md">
        <div className="w-80">
          <DialogTitle className="text-lg font-semibold">Filtrar por Status</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-600">
            Selecione o status desejado para filtrar as reservas
          </DialogDescription>
          
          <div className="mt-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione status</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
            <Button
              className="bg-black text-white w-[30%] h-10"
              onClick={handleApplyFilter}
            >
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
