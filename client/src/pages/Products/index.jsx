import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/loginContext";
import { getProducts, createChat } from "../../utils/api/fetch";
import "./Products.css";

function ProductCard({ product, onChatClick }) {
  const imageUrl = product.images?.length > 0 
    ? `${import.meta.env.VITE_BACKEND_URL}/${product.images[0]}`
    : 'placeholder-image.jpg';

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
        <p className="seller-info">Seller: {product.owner?.name || 'Unknown'}</p>
        <button className="chat-button" onClick={() => onChatClick(product)}>
          Chat with Seller
        </button>
      </div>
    </div>
  );
}

function Products() {
  const { id } = useContext(LoginContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if(typeof id  !== "string") return;
        console.log(id, filters.category);
        const data = await getProducts(id, filters.category);
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, filters.category]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase())
    );
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

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      <h1>Available Products</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onChatClick={handleGotoChat}
            />
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>
    </div>
  );
}

export default Products;