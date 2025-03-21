import { useState, useEffect } from "react";
import { Grid2, Typography } from "@mui/material";
import { PrivateLayout } from "../../components/PrivateLayout/PrivateLayout";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import "./style.css";

export default function AddEquipForm() {
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
    
    if (!formData.salaId || !formData.equipNome || !formData.quantidade) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/equipsala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: formData.salaId,
          equipNome: formData.equipNome,
          quantidade: Number(formData.quantidade)
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar equipamento");
      }

      toast.success("Equipamento adicionado com sucesso!");
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
            <Typography variant="h4">
              Adicionar Equipamento
            </Typography>
            <Divider />
          </Grid2>

          <Grid2 size={12} className="grid mt-8">
            <Typography variant="h6">
              Dados do equipamento
            </Typography>
          </Grid2>

          <Grid2
            size={12}
            className="flex items-center justify-between gap-5"
            style={{ maxWidth: "70vw" }}
          >
            {/* Seleção de sala */}
            <Grid2 size={4} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Sala</Label>
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

            {/* Seleção de equipamento */}
            <Grid2 size={4} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Nome do Equipamento</Label>
              <Input
                type="text"
                placeholder="Digite o nome do equipamento"
                value={formData.equipNome}
                onChange={(e) => setFormData({ ...formData, equipNome: e.target.value })}
                className="bg-white"
              />
            </Grid2>

            {/* Seleção de quantidade */}
            <Grid2 size={4} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                placeholder="Digite a quantidade"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                className="bg-white"
              />
            </Grid2>
          </Grid2>

          <Grid2 size={12} className="flex items-center justify-end p-2 gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="bg-white border border-gray-300 text-black"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-black text-white hover:bg-gray-800"
            >
              Adicionar Equipamento
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </PrivateLayout>
  );
}