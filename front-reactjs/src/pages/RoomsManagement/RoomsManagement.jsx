import { Grid, Typography } from "@mui/material";
import { PrivateLayout } from "../../components/PrivateLayout/PrivateLayout";
import { DataTable } from "./components/RoomsTable/data-table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ArrowUpDown, Edit, MoreVertical, Trash } from "lucide-react";
import api from "../../services/api";
import { ConfirmDeleteModal } from "./components/ConfirmDeleteModal/ConfirmDeleteModal";
import { toast } from "react-toastify";
import "./styles.css";

export default function RoomsManagement({ children }) {
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const confirmDelete = async () => {
    await fetch(`http://localhost:3001/salas/${selectedRoomId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    setIsModalOpen(false);
    // Atualize a lista de usuários aqui
    toast.success("Sala excluída com sucesso!");
  };

  const [roomsData, setRoomsData] = useState([]);

  async function getRooms() {
    const response = await fetch("http://localhost:3001/salas");
    const data = await response.json();
    return data;
  }

  async function fetchRooms() {
    const data = await getRooms();
    setRoomsData(data);
    console.log(data);
  }

  useEffect(() => {
    fetchRooms();
  }, [isModalOpen]);

  const columns = [
    {
      accessorKey: "identificador",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            IDENTIFICADOR
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "localizacao",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            LOCALIZACAO
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "capacidade",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CAPACIDADE
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0"
                data-testid={`botao-opcoes-${row.original._id}`}>
                  {/* <span className="sr-only">Open menu</span> */}
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                style={{ backgroundColor: "white" }}
              >
                <DropdownMenuItem
                  data-testid={`botao-editar-${row.original._id}`}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/editar-sala/${row.original._id}`)}
                >
                  <Edit className="mr-2 h-3 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-testid={`botao-excluir-${row.original._id}`}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedRoomId(row.original._id);
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" style={{ color: "red" }} />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
  return (
    <>
      <PrivateLayout>
        <Grid
          container
          className="grid grid-rows-1 flex-grow p-4 w-auto h-fit mx-2"
        >
          <Grid id="main" item xs={12} className="p-4">
            <Typography variant="h4">Gestão de salas</Typography>
            {/* {children} */}
          </Grid>
          <Grid item xs={6} className="p-4">
            <DataTable columns={columns} data={roomsData} />
          </Grid>
        </Grid>
      </PrivateLayout>
      {isModalOpen && (
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}