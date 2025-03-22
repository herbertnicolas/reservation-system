import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Grid2, Typography, Divider } from "@mui/material";
import { ChevronLeft } from "lucide-react";

import { useEquip } from "@/hooks/use-equip";
import { equipSalaService } from "@/services/equipSalaService";

import { PrivateLayout } from "@/components/PrivateLayout/PrivateLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ComboInput } from "@/components/combo-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export default function AddEquipForm() {
  const navigate = useNavigate();
  const { equipamentos } = useEquip();
  const [salas, setSalas] = useState([]);
  const [formData, setFormData] = useState({
    salaId: "",
    equipNome: "",
    quantidade: "",
  });

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const rooms = await equipSalaService.getSalas();
        setSalas(rooms);
      } catch (error) {
        toast.error("Erro ao carregar salas");
      }
    };
    
    fetchSalas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.salaId || !formData.equipNome || !formData.quantidade) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await equipSalaService.addEquipamento({
        salaId: formData.salaId,
        equipNome: formData.equipNome,
        quantidade: Number(formData.quantidade)
      });

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
                  {salas.map((sala) => (
                    <SelectItem key={sala._id} value={sala._id}>
                      {sala.identificador}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Grid2>

            <Grid2 size={4} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Equipamento</Label>
              <ComboInput
                value={formData.equipamentoId}
                options={equipamentos}
                placeholder="Selecione ou digite um equipamento"
                onSelect={(equip) => 
                  setFormData(prev => ({
                    ...prev,
                    equipamentoId: equip.id,
                    equipNome: equip.nome
                  }))
                }
                onChange={(value) => 
                  setFormData(prev => ({
                    ...prev,
                    equipamentoId: "",
                    equipNome: value
                  }))
                }
              />
            </Grid2>

            <Grid2 size={4} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                placeholder="Digite a quantidade"
                value={formData.quantidade}
                onChange={(e) => 
                  setFormData(prev => ({
                    ...prev,
                    quantidade: e.target.value
                  }))
                }
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
