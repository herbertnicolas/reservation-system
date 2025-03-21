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


export default function AddEquipForm() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState({
    salaId: "",
    equipNome: "",
    quantidade: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar salas
        const roomsResponse = await fetch("http://localhost:3001/salas");
        const roomsData = await roomsResponse.json();
        setRooms(roomsData);

        // Buscar equipamentos existentes
        const equipsResponse = await fetch("http://localhost:3001/equipsala");
        const equipsData = await equipsResponse.json();

        // Map para eliminar duplicatas usando o nome como chave
        const uniqueEquipsMap = new Map();
        equipsData.data.forEach(item => {
          uniqueEquipsMap.set(item.equipamento.nome, {
            id: item.equipamento._id,
            nome: item.equipamento.nome
          });
        });
        
        // Map para array ordenado
        const uniqueEquips = Array.from(uniqueEquipsMap.values()).sort(
          (a,b) => {
          if (a.nome < b.nome) return -1;
          if (a.nome > b.nome) return 1;
          return 0;
        });

        setEquipamentos(uniqueEquips);
      } catch (error) {
        toast.error("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTyping(true);
    setFormData(prev => ({
      ...prev,
      equipamentoId: "",
      equipNome: e.target.value
    }));
  };
  
  const handleEquipSelect = (value) => {
    if (isTyping) return;

    const existingEquip = equipamentos.find(e => e.id === value);
    if (existingEquip) {
      setFormData(prev => ({
        ...prev,
        equipamentoId: value,
        equipNome: existingEquip.nome
      }));
    }
  };

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
              <Label>Equipamento</Label>
              <Select
                value={formData.equipamentoId || "placeholder"}
                onValueChange={handleEquipSelect}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue>
                    {formData.equipNome || "Selecione ou digite um equipamento"}
                  </SelectValue> 
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    Selecione ou digite um equipamento
                  </SelectItem>
                  <div className="mb-2 pb-2 border-b">
                    <Input
                      type="text"
                      className="bg-white"
                      autoComplete="off"
                      placeholder="Digite para adicionar novo"
                      value={formData.equipNome}
                      onChange={handleInputChange}
                      onBlur={() => setIsTyping(false)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.focus();
                      }}
                    />
                  </div>
                  {equipamentos.map((equip) => (
                    <SelectItem key={equip.id} value={equip.id} disabled={isTyping}>
                      {equip.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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