import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { PrivateLayout } from "../../../components/PrivateLayout/PrivateLayout";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Undo } from "lucide-react";
import { Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles.css";

export default function EditReservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    identificador: "",
    localizacao: "",
    capacidade: 0,
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:3001/salas/${id}`);
        const data = await response.json();
        setRoomData(data.sala);
      } catch (error) {
        toast.error("Erro ao carregar sala");
      }
    };
    fetchRoom();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3001/salas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });
      toast.success("Sala atualizada com sucesso!");
      navigate("/gestao-salas");
    } catch (error) {
      toast.error("Erro ao atualizar sala");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    const parsedValue = id === "capacidade" ? Number(value) : value;
    setRoomData({
      ...roomData,
      [id]: parsedValue,
    });
  };

  return (
    <PrivateLayout>
      <Grid container xs={12} className="flex items-center gap-6 h-max">
        <Grid item xs={12} onClick={() => navigate(-1)} className="flex cursor-pointer">
          <Undo />
          Voltar
        </Grid>
        <Grid
          className="p-8"
          container
          spacing={2}
          style={{
            backgroundColor: "#FAFAFA",
            borderRadius: "10px",
            height: "auto",
          }}
        >
          <Grid item xs={12}>
            <Typography variant="h4">Editar Sala</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} className="grid mt-8">
            <Typography variant="h6">Informações gerais</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            className="flex items-center justify-between gap-5"
            style={{ maxWidth: "70vw" }}
          >
            <Grid item xs={4} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Identificador</Label>
              <Input
                id="identificador"
                value={roomData.identificador}
                onChange={handleChange}
                className="bg-white"
              />
            </Grid>
            <Grid item xs={4} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Localização</Label>
              <Input
                id="localizacao"
                value={roomData.localizacao}
                onChange={handleChange}
                className="bg-white"
              />
            </Grid>
            <Grid item xs={4} className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Capacidade</Label>
              <Input
                type="number"
                id="capacidade"
                value={roomData.capacidade}
                onChange={handleChange}
                className="bg-white"
                min="1"
              />
            </Grid>
          </Grid>

          <Grid item xs={12} className="flex items-center justify-end p-2 gap-3">
            <Button
              className="bg-white border border-gray-300 text-black w-fit p-4 h-10"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-black text-white w-fit p-4 h-10"
              onClick={handleUpdate}
            >
              Salvar Alterações
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </PrivateLayout>
  );
}