import { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../../context/loginContext';
import { getMyProducts, createProduct, deleteProduct } from '../../utils/api/fetch';
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
          min="0"
          step="0.01"
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
        <label htmlFor="images">Images (up to 5)</label>
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
          max="5"
        />
      </div>

      <div className="form-buttons">
        <button type="button" className="button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button-primary">
          Create Product
        </button>
      </div>
    </form>
  );
}

function ProductCard({ product, onDelete }) {
  const imageUrl = product.images?.length > 0 
    ? `${import.meta.env.VITE_BACKEND_URL}/${product.images[0]}`
    : 'placeholder-image.jpg';

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <p>{product.description}</p>
        <p className="product-category">Category: {product.category}</p>
        <button 
          className="button-delete"
          onClick={() => onDelete(product._id)}
        >
          Delete Product
        </button>
      </div>
    </div>
  );
}

function MyProducts() {
  const { id } = useContext(LoginContext);
  const [products, setProducts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (!id) return;
      
      try {
        const data = await getMyProducts(id);
        setProducts(data || []);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  const handleCreateProduct = async (formData) => {
    try {
      formData.append('owner', id);
      const newProduct = await createProduct(formData);
      setProducts([...products, newProduct]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  if (loading) {
    return <div className="loading">Loading your products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-products-container">
      <div className="header">
        <h1>My Products</h1>
        <button 
          className="button-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Add New Product
        </button>
      </div>

      {showCreateForm ? (
        <CreateProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDeleteProduct}
              />
            ))
          ) : (
            <p className="no-products">You haven't created any products yet</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyProducts;