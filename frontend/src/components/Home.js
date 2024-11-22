import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(localStorage.getItem("chandantoken"));

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white p-8 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Welcome to HTTP Code Manager
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-300 rounded shadow hover:bg-gray-50 transition">
            <h2 className="text-lg font-bold mb-2 text-gray-800">
              Add New HTTP Code List
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Create and save custom lists of HTTP response codes and their
              descriptions.
            </p>
            <button
              onClick={() => navigate("/search")}
              className={`px-4 py-2 rounded transition ${
                isLoggedIn
                  ? "text-white bg-blue-500 hover:bg-blue-600"
                  : "text-gray-400 bg-gray-200 cursor-not-allowed"
              }`}
              disabled={!isLoggedIn}
            >
              Go to Search
            </button>
          </div>
          <div className="p-4 border border-gray-300 rounded shadow hover:bg-gray-50 transition">
            <h2 className="text-lg font-bold mb-2 text-gray-800">
              View Saved Lists
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              View, edit, and manage the lists of HTTP response codes you’ve
              saved.
            </p>
            <button
              onClick={() => navigate("/lists")}
              className={`px-4 py-2 rounded transition ${
                isLoggedIn
                  ? "text-white bg-blue-500 hover:bg-blue-600"
                  : "text-gray-400 bg-gray-200 cursor-not-allowed"
              }`}
              disabled={!isLoggedIn}
            >
              View Lists
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
