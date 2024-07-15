import axios from "axios";

class ApiService {
  async get(base_api: string, module: string) {
    return await axios.get(`${base_api}/${module}}`);
  }

  async getParam(base_api: string, module: string, param: string) {
    return await axios.get(`${base_api}/${module}}/${param}`);
  }

  async post(base_api: string, module: string, data: unknown) {}
}

export const apiService = new ApiService();
