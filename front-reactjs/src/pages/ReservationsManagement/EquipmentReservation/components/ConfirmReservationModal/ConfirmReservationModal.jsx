import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export function ConfirmReservationModal({
  isOpen,
  onClose,
  onConfirm,
  unavailableDates = [],
}) {
  const [date, setDate] = useState(new Date());
  
  // Função para verificar se uma data está indisponível
  const isDateUnavailable = (date) => {
    const isUnavailable = unavailableDates.some(unavailableDate => 
      date.getDate() === unavailableDate.getDate() &&
      date.getMonth() === unavailableDate.getMonth() &&
      date.getFullYear() === unavailableDate.getFullYear()
    );

    if (date.getDate() === new Date().getDate()) {
      console.log(`Verificando data ${date.toLocaleDateString()}: ${isUnavailable ? 'Indisponível' : 'Disponível'}`);
    }
    
    return isUnavailable;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-white bg-opacity-50" />
      <DialogContent className="flex items-center justify-center bg-white bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-md w-full">
          <DialogTitle className="text-lg font-semibold">
            Selecione uma data para reserva:
          </DialogTitle>
          {/* <DialogDescription className="mt-2 text-sm text-gray-600">
            Essa ação não poderá ser desfeita. Ao clicar em ‘Remover’, o item
            cadastrado será removido da plataforma por completo.
          </DialogDescription> */}
          <div className="justify-center mt-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => isDateUnavailable(date) || date < new Date()}
              className="rounded-md border"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              style={{
                backgroundColor: "#000",
                color: "#fff",
                width: "20%",
                height: "40px",
              }}
              type="primary"
              onClick={() => onConfirm(date)}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
