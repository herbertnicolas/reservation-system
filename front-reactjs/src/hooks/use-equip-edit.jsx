import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { equipSalaService } from '@/services/equipSalaService';

export function useEquipEdit(equipId) {
  const [salas, setSalas] = useState([]);
  const [equipInfo, setEquipInfo] = useState({
    nome: "",
    quantidadePorSala: {}
  });
  const [formData, setFormData] = useState({
    salaId: "",
    quantidade: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipSalaData = await equipSalaService.getAllEquipSala();
        
        const equipmentData = equipSalaData.data.filter(
          equip => equip.equipamento._id === equipId
        );
        
        if (equipmentData.length === 0) {
          throw new Error("Equipamento não encontrado");
        }

        const quantidadePorSala = {};
        equipmentData.forEach(item => {
          quantidadePorSala[item.sala._id] = item.quantidade;
        });

        setEquipInfo({
          nome: equipmentData[0].equipamento.nome,
          quantidadePorSala
        });

        const salasComEquipamento = equipmentData.map(item => item.sala);
        
        setSalas(salasComEquipamento);
        setFormData({
          salaId: equipmentData[0].sala._id,
          quantidade: equipmentData[0].quantidade.toString(),
        });

      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, [equipId]);

  return {
    salas,
    equipInfo,
    formData,
    setFormData
  };
}