import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { toast } from "react-toastify";
import { PrivateLayout } from "../../../../components/PrivateLayout/PrivateLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

export default function AddEquipmentForm() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    salaId: "",
    equipNome: "",
    quantidade: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3001/salas");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        toast.error("Erro ao carregar salas");
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:3001/equipsala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar equipamento");
      }

      toast.success("Equipamento adicionado com sucesso!");
      navigate("/gestao-equipamentos");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <PrivateLayout>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Adicionar Equipamento
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, salaId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room._id} value={room._id}>
                        {room.identificador}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Input
                  placeholder="Nome do equipamento"
                  value={formData.equipNome}
                  onChange={(e) =>
                    setFormData({ ...formData, equipNome: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Input
                  type="number"
                  placeholder="Quantidade"
                  value={formData.quantidade}
                  onChange={(e) =>
                    setFormData({ ...formData, quantidade: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate("/gestao-equipamentos")}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-black text-white">
                Adicionar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PrivateLayout>
  );
}