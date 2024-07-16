import axios from "axios";

class ApiService {
  get = async (base_api: string, module: string) => {
    return await axios.get(`${base_api}/${module}}`);
  };

  getParam = async (base_api: string, module: string, param: string) => {
    return await axios.get(`${base_api}/${module}/${param}`);
  };

  post = async (base_api: string, module: string, data: unknown) => {};
}

export default ApiService;
