import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PrivateLayout } from "../../components/PrivateLayout/PrivateLayout";

const Home = () => {
//   const [rooms, setRooms] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     const response = await fetch("http://localhost:3001/salas");
//     const data = await response.json();
//     setRooms(data);
//   };

//   const handleDelete = async (id) => {
//     await fetch(`http://localhost:3001/salas/${id}`, { method: "DELETE" });
//     fetchRooms();
//   };

  return (
    <>
      <PrivateLayout>
        <Grid container>
          <Grid item xs={12} style={{ padding: "0.5%" }}>
            <Typography variant="h4">Início</Typography>
            {/* {children} */}
          </Grid>
        </Grid>
      </PrivateLayout>
    </>
  );
}

export default Home;
