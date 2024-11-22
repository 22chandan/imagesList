import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import Auth from "./components/Signup";
import SearchPage from "./components/Search";
import Home from "./components/Home";
import Lists from "./components/Lists";
import NotFound from "./components/NotFound";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const isloggedin = localStorage.getItem("chandantoken");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for logout confirmation
  const { logout } = useAuth(); // Access the login function from context
  const handleLogout = () => {
    localStorage.removeItem("chandantoken"); // Clear token from localStorage
    localStorage.removeItem("chandanuser"); // Clear user from localStorage
    setShowLogoutConfirm(false); // Hide confirmation dialog
    logout();
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-lg font-bold">HTTP Code Manager</h1>
            <nav>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `mr-4 ${isActive ? "underline font-bold" : ""}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `mr-4 ${isActive ? "underline font-bold" : ""}`
                }
              >
                Search
              </NavLink>
              {isloggedin && (
                <NavLink
                  to="/lists"
                  className={({ isActive }) =>
                    `${isActive ? "underline font-bold" : ""}`
                  }
                >
                  Lists
                </NavLink>
              )}
              {!isloggedin && (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `ml-4 ${isActive ? "underline font-bold" : ""}`
                  }
                >
                  Login
                </NavLink>
              )}
              {isloggedin && (
                <button
                  onClick={() => setShowLogoutConfirm(true)} // Show confirmation dialog
                  className="ml-4 text-white hover:underline cursor-pointer"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route
              path="/search"
              element={isloggedin ? <SearchPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/lists"
              element={isloggedin ? <Lists /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; 2024 HTTP Code Manager. All rights reserved.</p>
        </footer>

        {/* Logout Confirmation Dialog */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-bold text-gray-800">
                Are you sure you want to log out?
              </h2>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)} // Close dialog
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout} // Perform logout
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
