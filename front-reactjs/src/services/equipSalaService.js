const API_URL = "http://localhost:3001";

export const equipSalaService = {
  async addEquipamento(data) {
    const response = await fetch(`${API_URL}/equipsala`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.msg);
    }

    return responseData;
  },

  async getAllEquipSala() {
    const response = await fetch(`${API_URL}/equipsala`);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.msg);
    }

    return responseData;
  },

  async updateEquipamento(salaId, equipId, data) {
    const response = await fetch(`${API_URL}/equipsala/${salaId}/${equipId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.msg);
    }

    return responseData;
  },

  async removeEquipamento(salaId, equipId) {
    const response = await fetch(`${API_URL}/equipsala/${salaId}/${equipId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.msg);
    }

    return responseData;
  },

  async getEquipamentos() {
    const response = await fetch(`${API_URL}/equipamentos`);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.msg);
    }

    return responseData;
  },

  async getSalas() {
    const response = await fetch(`${API_URL}/salas`);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error("Erro ao carregar salas");
    }

    return responseData;
  },

  async deleteEquipamento(equipId) {
    const response = await fetch(`${API_URL}/equipamentos/${equipId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.msg);
    }

    return responseData;
  },

};