import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/loginContext";
import { login } from "../../utils/api/fetch";
import "./Auth.css";

function Login() {
  const { setId } = useContext(LoginContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      const response = await login(formData.email, formData.password);
      
      if (response._id) {
        setId(response._id);
        navigate('/');
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;