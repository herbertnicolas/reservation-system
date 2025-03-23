import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

const SearchHistory = () => {
  const [filters, setFilters] = useState({
    proprietario: '',
    sala: '',
    data: null
  });

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams();
      if (filters.proprietario) query.append('proprietario', filters.proprietario);
      if (filters.sala) query.append('sala', filters.sala);
      if (filters.data) query.append('data', filters.data.toISOString());

      const response = await fetch(`/api/history/buscar?${query.toString()}`);
      const data = await response.json();
      console.log('Resultados da busca:', data); // Implemente a atualização de estado conforme necessário
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  return (
    <div className="p-fluid grid p-4">
      <div className="field col-12 md:col-4">
        <label htmlFor="proprietario">Proprietário</label>
        <InputText
          id="proprietario"
          value={filters.proprietario}
          onChange={(e) => setFilters({ ...filters, proprietario: e.target.value })}
        />
      </div>
      <div className="field col-12 md:col-4">
        <label htmlFor="sala">Sala</label>
        <InputText
          id="sala"
          value={filters.sala}
          onChange={(e) => setFilters({ ...filters, sala: e.target.value })}
        />
      </div>
      <div className="field col-12 md:col-4">
        <label htmlFor="data">Data</label>
        <Calendar
          id="data"
          value={filters.data}
          onChange={(e) => setFilters({ ...filters, data: e.value })}
          dateFormat="dd/mm/yy"
          showIcon
        />
      </div>
      <div className="col-12 mt-3">
        <Button 
          label="Buscar" 
          icon="pi pi-search" 
          onClick={handleSearch} 
          className="p-button-success"
        />
      </div>
    </div>
  );
};

export default SearchHistory;
