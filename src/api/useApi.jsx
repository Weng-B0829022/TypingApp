import { useQuery, useMutation } from 'react-query';

const useApi = (endpoint, options = {}) => {
  const { 
    method = 'GET',
    body,
    queryKey = [endpoint],
    enabled = true,
    ...restOptions
  } = options;

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...restOptions.headers
        },
        body: body ? JSON.stringify(body) : undefined,
        ...restOptions
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  if (method.toUpperCase() === 'GET') {
    return useQuery(queryKey, fetchData, enabled);
  } else {
    return useMutation(fetchData);
  }
};

export default useApi;