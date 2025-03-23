import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "../../../../components/ui/dialog";

export function EditReservationStatusModal({ isOpen, onClose, onConfirm, onCancel }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-white bg-opacity-50" />
      <DialogContent className="flex items-center justify-around bg-white p-5 rounded-md shadow-md">
        <div className="bg-white p-5 rounded-md shadow-md">
          <DialogTitle className="text-lg font-semibold">
            Editar status da reserva
          </DialogTitle>
          <div className="mt-2 text-sm text-gray-600">
            <Button 
              className="bg-white text-gray w-[45%] h-10"
              onClick={onCancel}
            >
              Cancelar reserva
            </Button>
            <Button
              className="bg-white text-gray w-[45%] h-10"
              onClick={onConfirm}
            >
              Confirmar reserva
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
