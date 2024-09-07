import { useQuery, useMutation } from 'react-query';

const useApi = (endpoint, options = {}) => {
  const { 
    method = 'GET',
    body,
    queryKey = endpoint,
    ...restOptions
  } = options;

  const fetchData = async () => {
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
      throw new Error('API call failed');
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return {}; // 返回空對象而不是拋出錯誤
    }
  };

  if (method.toUpperCase() === 'GET') {
    return useQuery(queryKey, fetchData);
  } else {
    return useMutation(fetchData);
  }
};

export default useApi;