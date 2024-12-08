// frontend/src/services/productService.js

import axios from 'axios';

// Fetch all products for the seller
export const fetchProducts = async () => {
  const response = await axios.get('/api/seller/products');
  return response.data;
};

// Add a new product
export const addProduct = async (productData) => {
  const response = await axios.post('/api/seller/products', productData);
  return response.data;
};

// Update an existing product
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`/api/seller/products/${id}`, productData);
  return response.data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const response = await axios.delete(`/api/seller/products/${id}`);
  return response.data;
};
