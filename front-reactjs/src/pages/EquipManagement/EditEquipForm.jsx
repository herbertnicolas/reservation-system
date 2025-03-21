import { useState, useEffect } from "react";
import { Grid2, Typography } from "@mui/material";
import { PrivateLayout } from "../../components/PrivateLayout/PrivateLayout";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function EditEquipmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    salaId: "",
    quantidade: ""
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipsalaResponse = await fetch("http://localhost:3001/equipsala");
        const equipsalaData = await equipsalaResponse.json();
        
        const equipsala = equipsalaData.data.find(
          equip => equip.equipamento._id === id
        );

        if (!equipsala) {
          throw new Error("Equipamento não encontrado");
        }

        const uniqueRooms = [...new Map(
          equipsalaData.data
          .filter(item => item.equipamento._id === id)
          .map(item => [item.sala._id, item.sala])
        ).values()];
        
        setRooms(uniqueRooms);
        setFormData({
          salaId: equipsala.sala._id,
          quantidade: equipsala.quantidade.toString(),
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
      const response = await fetch(`http://localhost:3001/equipsala/${formData.salaId}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: Number(formData.quantidade) }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar equipamento");
      }

      toast.success("Equipamento atualizado com sucesso!");
      navigate("/equipamento-gestao");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <PrivateLayout>
      <Grid2 container className="flex items-center gap-6 h-max">
        <Grid2 size={12} onClick={() => navigate(-1)} className="flex cursor-pointer items-center">
          <ChevronLeft size={24}/>
          <span>Voltar</span>
        </Grid2>
        <Grid2
          className="p-8"
          container
          spacing={2}
          style={{
            backgroundColor: "#FAFAFA",
            borderRadius: "10px",
            height: "auto",
          }}
        >
          <Grid2 size={12}>
            <Typography variant="h4">Editar Equipamento</Typography>
            <Divider />
          </Grid2>
          <Grid2 size={12} className="grid mt-8">
            <Typography variant="h6">Informações gerais</Typography>
          </Grid2>
          <Grid2
            
            size={12}
            className="flex items-center justify-between gap-5"
            style={{ maxWidth: "70vw" }}
          >
            <Grid2 size={6} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Na Sala:</Label>
              <Select
                value={formData.salaId}
                onValueChange={(value) => setFormData({ ...formData, salaId: value })}
              >
                <SelectTrigger className="bg-white">
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
            </Grid2>
            <Grid2 size={6} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                className="bg-white"
                min="1"
              />
            </Grid2>
          </Grid2>

          <Grid2 size={12} className="flex items-center justify-end p-2 gap-3">
            <Button
              className="bg-white border border-gray-300 text-black w-fit p-4 h-10"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-black text-white w-fit p-4 h-10"
              onClick={handleSubmit}
            >
              Salvar Alterações
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </PrivateLayout>
  );
}