import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const httpCodes = [
  100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300,
  301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404, 405, 406,
  407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423,
  424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507,
  508, 510, 511,
];

const httpCodeImages = httpCodes.reduce((acc, code) => {
  acc[code] = `https://http.dog/${code}.jpg`;
  return acc;
}, {});

const SearchPage = () => {
  const { logout } = useAuth(); // Use the useAuth hook to get user info
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("chandanuser"));
  useEffect(() => {
    if (filter) {
      const regex = new RegExp(`^${filter.replace(/x/g, "\\d")}`);
      const filteredCodes = httpCodes.filter((code) =>
        regex.test(code.toString())
      );
      setResults(
        filteredCodes.map((code) => ({
          code,
          image: httpCodeImages[code],
        }))
      );
    } else {
      setResults([]);
    }
  }, [filter]);

  const handleSave = async () => {
    if (!name) {
      alert("Please enter a list name.");
      return;
    }
    const isloggedin = localStorage.getItem("chandantoken");

    if (!isloggedin) {
      alert("User not logged in!");
      navigate("/login");
      return;
    }

    try {
      console.log("Saving list for user:", user);
      await axios.post(
        "http://localhost:5000/api/lists",
        {
          name,
          userId: user.id,
          responseCodes: results.map((r) => r.code),
          imageLinks: results.map((r) => r.image),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("chandantoken")}`, // Send JWT token
          },
        }
      );
      alert("List saved successfully!");
      navigate("/lists");
    } catch (error) {
      alert("Error saving list!");
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className="max-w-3xl m-auto my-20">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Search HTTP Codes
        </h1>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by code (e.g., 2xx, 20x)"
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none mb-6"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          {results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.code}
                className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={result.image}
                  alt={`HTTP ${result.code}`}
                  className="w-full rounded-lg shadow-sm"
                />
                <p className="mt-2 text-lg font-semibold text-gray-700">
                  {result.code}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No results found. Try another filter.
            </p>
          )}
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter List Name"
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none mb-6"
        />
        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200"
        >
          Save List
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
