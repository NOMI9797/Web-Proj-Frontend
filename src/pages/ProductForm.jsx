// frontend/src/pages/ProductForm.jsx

import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct, fetchProducts } from '../services/productService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import {
  TextField, Button, Typography, Paper,
  Grid, Select, MenuItem, InputLabel, FormControl,
  FormHelperText, Box, CircularProgress
} from '@mui/material';

const ProductForm = () => {
  const { authState } = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [],
    stock: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingProduct, setExistingProduct] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      // Fetch the existing product details
      const fetchExistingProduct = async () => {
        try {
          const products = await fetchProducts();
          const product = products.find(p => p._id === id);
          if (product) {
            setExistingProduct(product);
            setFormData({
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              images: product.images,
              stock: product.stock,
            });
          } else {
            console.error('Product not found');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      fetchExistingProduct();
    }
  }, [id, isEditMode]);

  const validate = () => {
    const tempErrors = {};

    if (!formData.name.trim()) tempErrors.name = 'Product name is required';
    if (!formData.description.trim()) tempErrors.description = 'Description is required';
    if (!formData.price || isNaN(formData.price)) tempErrors.price = 'Valid price is required';
    if (!formData.category.trim()) tempErrors.category = 'Category is required';
    if (!formData.stock || isNaN(formData.stock)) tempErrors.stock = 'Valid stock quantity is required';
    if (formData.images.length === 0) tempErrors.images = 'At least one image is required';

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: filePreviews,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // In a real app, you would upload images to a storage service and get their URLs
      // For simplicity, we'll assume images are already URLs

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      };

      if (isEditMode) {
        await updateProduct(id, productData);
      } else {
        await addProduct(productData);
      }

      navigate('/seller/products');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., show notification)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />
          </Grid>

          {/* Price */}
          <Grid item xs={6}>
            <TextField
              label="Price ($)"
              fullWidth
              type="number"
              inputProps={{ step: '0.01' }}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={Boolean(errors.price)}
              helperText={errors.price}
            />
          </Grid>

          {/* Stock */}
          <Grid item xs={6}>
            <TextField
              label="Stock"
              fullWidth
              type="number"
              inputProps={{ step: '1' }}
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              error={Boolean(errors.stock)}
              helperText={errors.stock}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.category)}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Button variant="contained" component="label">
              Upload Images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {errors.images && <FormHelperText error>{errors.images}</FormHelperText>}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
              {formData.images.map((img, index) => (
                <Box key={index} sx={{ position: 'relative', marginRight: 1, marginBottom: 1 }}>
                  <img src={img} alt={`Product ${index}`} width="100" height="100" style={{ objectFit: 'cover', borderRadius: 4 }} />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Product' : 'Add Product')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;
