import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
  
export function DeleteConfirmation({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title,
    description,
    confirmButtonText = "Remover",
    cancelButtonText = "Cancelar",
    confirmButtonClass = "bg-black text-white hover:bg-gray-800 w-[100px]"
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="fixed inset-0 bg-black/30" />
            <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] rounded-lg bg-white p-6">
                <DialogTitle className="text-lg font-semibold">
                    {title}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-gray-600">
                    {description}
                </DialogDescription>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        {cancelButtonText}
                    </Button>
                    <Button
                        className={confirmButtonClass}
                        onClick={onConfirm}
                    >
                        {confirmButtonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}