import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { PrivateLayout } from "../../../components/PrivateLayout/PrivateLayout";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Undo } from "lucide-react";
import { Divider } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { apiService } from '../../RoomsManagement/apiService';
import { toast } from "react-toastify";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [capacidade, setCapacidade] = useState(0);

  const [dadosSala, setDadosSala] = useState({
    identificador: "",
    localizacao: "",
    capacidade: 0,
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    const newRoom = {
      identificador,
      localizacao,
      capacidade: Number(capacidade),
    };

    try {
      await apiService.createRoom({
        identificador,
        localizacao,
        capacidade: Number(capacidade),
      });

      toast.success("Sala cadastrada com sucesso!");
      navigate("/gestao-salas");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setDadosSala({
      identificador: "",
      localizacao: "",
      capacidade: 0,
    });
    navigate(-1);
  };

  return (
    <PrivateLayout>
      <Grid container xs={12} className="flex items-center gap-6 h-max">
        <Grid
          item
          xs={12}
          onClick={() => navigate(-1)}
          className="flex cursor-pointer"
        >
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
            <Typography variant="h4">Criar sala</Typography>
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
            <Grid
              item
              xs={4}
              className="grid w-full max-w-sm items-center gap-1.5"
            >
              <Label htmlFor="nome_usuario">Identificador sala</Label>
              <Input
                type="string"
                id="identificador-sala"
                value={identificador}
                placeholder="Insira um identificador"
                onChange={(e) => {
                  setIdentificador(e.target.value);
                }}
                className="bg-white"
              />
            </Grid>
            <Grid
              item
              xs={4}
              className="grid w-full max-w-sm items-center gap-1.5"
            >
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                type="string"
                id="localizacao"
                placeholder="Insira a localização"
                onChange={(e) => {
                  setLocalizacao(e.target.value);
                }}
                className="bg-white"
              />
            </Grid>
            <Grid
              item
              xs={4}
              className="grid w-full max-w-sm items-center gap-1.5"
            >
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                type="number"
                id="capacidade"
                placeholder="Insira a capacidade"
                onChange={(e) => {
                  setCapacidade(Number(e.target.value));
                }}
                className="bg-white"
              />
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            className="flex items-center justify-end p-2 gap-3"
          >
            <Button
              className="bg-white border border-gray-300  text-black w-fit p-4 h-10"
              type="primary"
              htmlType="submit"
              block
              size="large"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              className="bg-black text-white border-black w-fit p-4 h-10"
              onClick={handleRegister}
              htmlType="submit"
              block
              size="large"
            >
              Cadastrar sala
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </PrivateLayout>
  );
}