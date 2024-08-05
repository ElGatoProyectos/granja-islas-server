import axios from "axios";
import qs from "qs";

class ApiService {
  getWithoutModule = async (base_api: string) => {
    return await axios.get(`${base_api}`);
  };

  get = async (base_api: string, module: string) => {
    return await axios.get(`${base_api}/${module}}`);
  };

  getWAuthorization = async (base_api: string, token: string) => {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return await axios.get(`${base_api}`, { headers });
  };

  getParam = async (base_api: string, module: string, param: string) => {
    return await axios.get(`${base_api}/${module}/${param}`);
  };

  post = async (
    base_api: string,
    module: string,
    data: unknown,
    headers = {}
  ) => {
    return await axios.post(`${base_api}/${module}`, data, { headers });
  };

  post_x_www_urlencoded = async (base_api: string, data: unknown) => {
    const formattedData = qs.stringify(data);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    return await axios.post(`${base_api}`, formattedData, { headers });
  };
}

export default ApiService;
