import { Grid, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
import { PrivateLayout } from "../../components/PrivateLayout/PrivateLayout";
import { Users, User } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
<>
      <PrivateLayout>
        <Box 
          sx={{ 
            height: "80vh", 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 2rem"
          }}
        >
          {/* Cabeçalho de boas-vindas */}
          <Grid item xs={12} sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
              Seja bem-vindo ao Sistema de Reservas - ESS!
            </Typography>
            <Typography variant="h5" color="textSecondary" sx={{ mt: 4 }}>
              Selecione um tipo de usuário
            </Typography>
          </Grid>

          <Grid container spacing={6} sx={{ maxWidth: 1200 }}>
            {/* Card Webhooks */}
            <Grid item xs={12} md={6}>
              <Paper 
                id="card-alunos"
                onClick={() => navigate('/alunos')}
                elevation={2} 
                sx={{ 
                  borderRadius: '16px',
                  aspectRatio: '1/1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                  backgroundColor: '#f9f9f9',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    backgroundColor: '#f0f0f0'
                  }
                }}
              >
                <Users size={80} color="#1976d2" strokeWidth={1.5} />
                <Typography variant="h5" sx={{ mt: 3, fontWeight: 500 }}>
                  Alunos
                </Typography>
              </Paper>
            </Grid>

            {/* Card Monitoramento */}
            <Grid item xs={12} md={6}>
              <Paper 
                id="card-administrador"
                onClick={() => navigate('/administrador')}
                elevation={2} 
                sx={{ 
                  borderRadius: '16px',
                  aspectRatio: '1/1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                  backgroundColor: '#f9f9f9',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    backgroundColor: '#f0f0f0'
                  }
                }}
              >
                <User size={80} color="#1976d2" strokeWidth={1.5} />
                <Typography variant="h5" sx={{ mt: 3, fontWeight: 500 }}>
                  Administrador
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </PrivateLayout>
    </>
  );
}
