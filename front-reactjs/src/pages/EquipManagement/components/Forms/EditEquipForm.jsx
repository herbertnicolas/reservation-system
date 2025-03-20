import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditEquipmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    salaId: "",
    quantidade: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar salas e equipamentos em uma única requisição
        const equipsalaResponse = await fetch("http://localhost:3001/equipsala");
        const equipsalaData = await equipsalaResponse.json();
        
        // Encontrar o equipamento específico pelo id
        const equipamento = equipsalaData.data.find(
          equip => equip.equipamento._id === id
        );
  
        if (!equipamento) {
          throw new Error("Equipamento não encontrado");
        }
  
        // Extrair lista única de salas dos dados
        const uniqueRooms = [...new Map(
          equipsalaData.data.map(item => [item.sala._id, item.sala])
        ).values()];
        
        setRooms(uniqueRooms);
        setFormData({
          salaId: equipamento.sala._id,
          quantidade: equipamento.quantidade.toString(),
        });
  
      } catch (error) {
        toast.error("Erro ao carregar dados");
        console.error(error);
      }
    };
  
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:3001/equipsala/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar equipamento");
      }

      toast.success("Equipamento atualizado com sucesso!");
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
              Editar Equipamento
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select
                  value={formData.salaId}
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
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PrivateLayout>
  );
}