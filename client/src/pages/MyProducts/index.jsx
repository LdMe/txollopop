// src/pages/MyProducts.jsx
import { useState, useContext, useEffect } from 'react';
import { LoginContext } from '../../context/loginContext';
import './MyProducts.css';

function CreateProductForm({ onSubmit, onCancel }) {
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (const image of images) {
      formData.append('images', image);
    }
    onSubmit(formData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          type="text"
          name="name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          name="price"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" required>
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="images">Images</label>
        <input
          id="images"
          type="file"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
          accept="image/*"
        />
      </div>

      <div className="form-buttons">
        <button type="button" className="button button-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          Create Product
        </button>
      </div>
    </form>
  );
}

function ProductCard({ product, onDelete }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="product-price">${product.price}</p>
      <p className="product-category">Category: {product.category}</p>
      <button 
        className="button button-outline" 
        onClick={() => onDelete(product._id)}
      >
        Delete Product
      </button>
    </div>
  );
}

function MyProducts() {
  const { id } = useContext(LoginContext);
  const [products, setProducts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products?owner=${id}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  const handleCreateProduct = async (formData) => {
    try {
      formData.append('owner', id);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product`, {
        method: 'POST',
        body: formData,
      });
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/${productId}`, {
        method: 'DELETE',
      });
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>My Products</h1>
        <button 
          className="button button-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Product
        </button>
      </div>

      {showCreateForm ? (
        <CreateProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;