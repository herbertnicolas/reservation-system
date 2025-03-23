import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const HistoryManagement = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setHistory(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const dateFormat = (rowData) => {
    return new Date(rowData.data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Histórico de Reservas</h1>
      <div className="mb-4 flex gap-2">
        <Button
          label="Buscar Reservas"
          icon="pi pi-search"
          onClick={() => navigate('/historico/buscar')}
        />
        <Button
          label="Redefinir Filtros"
          icon="pi pi-refresh"
          onClick={fetchHistory}
          className="p-button-secondary"
        />
      </div>
      
      <DataTable
        value={history}
        loading={loading}
        paginator
        rows={10}
        emptyMessage="Nenhum registro encontrado"
      >
        <Column field="proprietario" header="Proprietário" sortable />
        <Column field="sala" header="Sala" sortable />
        <Column 
          field="data" 
          header="Data" 
          body={dateFormat} 
          sortable 
        />
        <Column field="hora" header="Hora" sortable />
      </DataTable>
    </div>
  );
};

export default HistoryManagement;
