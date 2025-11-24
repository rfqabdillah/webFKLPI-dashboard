import apiClient from './users';

export const login = async (email, password) => {
  try {
    const data = {
      email: email,
      password: password
    };

    const response = await apiClient.post("/auth", data);
    
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};