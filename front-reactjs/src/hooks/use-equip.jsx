import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import { equipSalaService } from '@/services/equipSalaService';

export function useEquip() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [error, setError] = useState(null);

  const fetchEquipamentos = async () => {
    try {
      const response = await equipSalaService.getEquipamentos();
      
      const uniqueEquips = Array.from(
        new Map(response.data.map(item => [
            item.nome,
            item._id
        ])),
        ([nome, id]) => ({ nome, id })
        ).sort((a, b) => a.nome.localeCompare(b.nome));

      setEquipamentos(uniqueEquips);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  return { equipamentos, error, refetch: fetchEquipamentos };
}