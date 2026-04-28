import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const createHttpClient = (): AxiosInstance => {
  const baseURL = "http://localhost:5239";

  const client = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  return client;
};

const httpClient = createHttpClient();

/**
 * Mutator function for Orval to use the shared Axios instance
 * This function will be called by all generated API functions
 */
export const httpClientMutator = <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  return httpClient(config).then((response) => response.data);
};

export { httpClient };
export default httpClient;
