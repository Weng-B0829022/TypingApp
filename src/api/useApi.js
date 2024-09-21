const useApi = (endpoint, options = {}) => {
  const {
    method = 'GET',
    body,
    headers: customHeaders,
    ...restOptions
  } = options;

  const fetchData = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...customHeaders
      };

      const fetchOptions = {
        method,
        headers,
        ...restOptions
      };

      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(`http://localhost:5001/${endpoint}`, fetchOptions);

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

  return fetchData;
};

export default useApi;