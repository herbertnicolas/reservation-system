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
            <DialogOverlay className="fixed inset-0 bg-black/30" />
            <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] rounded-lg bg-white p-6">
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
                        className="bg-black text-white hover:bg-gray-800 w-[100px]"
                        onClick={onConfirm}
                    >
                        Remover
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}