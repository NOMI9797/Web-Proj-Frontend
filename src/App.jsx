// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/seller/products"
            element={
              <PrivateRoute
                element={<ProductList />}
                roles={['seller']}
              />
            }
          />
          <Route
            path="/seller/products/add"
            element={
              <PrivateRoute
                element={<ProductForm />}
                roles={['seller']}
              />
            }
          />
          <Route
            path="/seller/products/edit/:id"
            element={
              <PrivateRoute
                element={<ProductForm />}
                roles={['seller']}
              />
            }
          />

          {/* Default Route */}
          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
