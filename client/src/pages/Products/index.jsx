// src/pages/Products/index.jsx
import { useLoaderData, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { LoginContext } from "../../context/loginContext";
import { createChat } from "../../utils/api/fetch";
import "./Products.css";

function ProductCard({ product, onChatClick }) {
  const imageUrl = product.images?.length > 0 
    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/products/${product._id}/${product.images[0]}`
    : 'https://via.placeholder.com/300x200';

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-category">
          <span className="category-tag">{product.category}</span>
        </div>
        <button className="chat-button" onClick={() => onChatClick(product)}>
          Chat with Seller
        </button>
      </div>
    </div>
  );
}

function ProductFilters({ onFilterChange }) {
  return (
    <div className="filters-section">
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => onFilterChange('search', e.target.value)}
        className="search-input"
      />
      <select 
        onChange={(e) => onFilterChange('category', e.target.value)}
        className="category-select"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
        <option value="other">Other</option>
      </select>
      <select 
        onChange={(e) => onFilterChange('sort', e.target.value)}
        className="sort-select"
      >
        <option value="">Sort by</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );
}

function Products() {
  const { id } = useContext(LoginContext);
  const navigate = useNavigate();
  const allProducts = useLoaderData();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: ''
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          product.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || product.category === filters.category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const handleGotoChat = async (product) => {
    if (!id) {
      navigate('/login');
      return;
    }
    try {
      const response = await createChat(product, id);
      navigate(`/chat/${response._id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="products-page">
      <h1 className="page-title">Available Products</h1>
      <ProductFilters onFilterChange={handleFilterChange} />
      
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found matching your criteria</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onChatClick={handleGotoChat}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;