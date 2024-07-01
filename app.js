import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000' // Change this to your backend URL if deployed
});

export const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const addTodo = async (task) => {
  const response = await api.post('/todos', { task });
  return response.data;
};

export const updateTodo = async (id, updatedTodo) => {
  const response = await api.put(`/todos/${id}`, updatedTodo);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
