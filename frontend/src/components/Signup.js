import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            username,
            password,
          }
        );

        // Use context login function
        login(response.data.user, response.data.token); // Pass user data and token
        console.log("User logged in:", response.data.user.username);
        navigate("/search"); // Redirect to search page after login
      } else {
        // Sign-up logic
        await axios.post("http://localhost:5000/api/users/signup", {
          username,
          password,
        });

        alert("Sign up successful! Please log in.");
        setIsLogin(true); // Switch to login screen after successful sign-up
      }
    } catch (err) {
      // Improved error handling
      const message =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(message);
      console.error("Error during authentication:", err); // Log error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md">
        <div className="flex justify-center">
          <img
            src="https://www.moengage.com/wp-content/uploads/2022/06/moengage-logo-dark-2.svg"
            alt="Logo"
            className="h-12"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            } shadow-lg transform transition-transform duration-150 ease-in-out hover:scale-105`}
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-2 text-indigo-600 underline hover:text-indigo-800"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
