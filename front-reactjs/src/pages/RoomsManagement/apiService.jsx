export class ApiService {
    constructor(baseUrl = 'http://localhost:3001') {
      this.baseUrl = baseUrl;
    }
  
    async request(endpoint, method, data = null) {
      const url = `${this.baseUrl}/${endpoint}`;
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : null,
      };
  
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro na requisição');
      }
  
      return response.json();
    }
  
    async createRoom(data) {
      return this.request('salas', 'POST', data);
    }
  
    async updateRoom(id, data) {
      return this.request(`salas/${id}`, 'PUT', data);
    }
  }
  
  export const apiService = new ApiService();