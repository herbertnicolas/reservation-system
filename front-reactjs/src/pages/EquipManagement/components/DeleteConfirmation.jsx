import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
  
export function DeleteConfirmationDialog({ isOpen, onClose, onConfirm }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="bg-white bg-opacity-50" />
        <DialogContent className="flex items-center justify-center bg-white bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
            <DialogTitle className="text-lg font-semibold">
                Deseja realmente remover o equipamento?
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600">
                O equipamento ainda estará disponível para ser adicionado novamente.
            </DialogDescription>
            <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                Cancelar
                </Button>
                <Button
                style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    width: "20%",
                }}
                onClick={onConfirm}
                >
                Remover
                </Button>
            </div>
            </div>
        </DialogContent>
        </Dialog>
    );
}