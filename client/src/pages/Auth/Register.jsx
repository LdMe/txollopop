import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/api/fetch";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.passwordRepeat) {
      throw new Error("Please fill in all fields");
    }
    
    if (formData.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (formData.password !== formData.passwordRepeat) {
      throw new Error("Passwords do not match");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error("Please enter a valid email address");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      validateForm();

      const response = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.passwordRepeat
      );

      if (response._id) {
        navigate('/login');
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

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
            placeholder="Create a password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordRepeat">Confirm Password</label>
          <input
            id="passwordRepeat"
            type="password"
            name="passwordRepeat"
            value={formData.passwordRepeat}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="auth-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;