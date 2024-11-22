import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  // Fetch lists with authentication
  useEffect(() => {
    const fetchLists = async () => {
      const isLoggedIn = localStorage.getItem("chandantoken");
      if (!isLoggedIn) {
        alert("User not logged in!");
        navigate("/login");
        return;
      }

      const user = JSON.parse(localStorage.getItem("chandanuser"));
      console.log("Fetching lists for user:", user);

      try {
        // Attach the token in the request header for authentication
        const response = await axios.get(
          `http://localhost:5000/api/lists/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("chandantoken")}`, // Send JWT token
            },
          }
        );
        setLists(response.data);
      } catch (error) {
        console.error("Error fetching lists", error);
        alert("Failed to fetch lists.");
      }
    };
    fetchLists();
  }, [navigate]);

  // Handle delete with authentication
  const handleDelete = async (id) => {
    const userId = JSON.parse(localStorage.getItem("chandanuser")).id;
    try {
      // Send the token with the delete request for authentication
      await axios.delete(`http://localhost:5000/api/lists/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("chandantoken")}`,
        },
        data: { userId }, // Send userId in the request body
      });
      setLists(lists.filter((list) => list._id !== id));
      if (selectedList && selectedList._id === id) {
        setSelectedList(null);
        setShow(false);
      }
    } catch (error) {
      console.error("Error deleting list", error);
      alert("Failed to delete list.");
    }
  };

  // View images for a list
  const handleViewImages = (list) => {
    setSelectedList(list);
    setShow(true);
  };

  // Remove image from the selected list
  const handleRemoveImage = (index) => {
    const updatedList = { ...selectedList };
    updatedList.imageLinks.splice(index, 1);
    updatedList.responseCodes.splice(index, 1);
    setSelectedList(updatedList);
  };

  // Save updated list with authentication
  const saveUpdatedList = async () => {
    const updatedList = {
      ...selectedList,
      userId: JSON.parse(localStorage.getItem("chandanuser")).id, // Add the userId to the updated data
    };

    try {
      // Send the updated list along with the JWT token
      const response = await axios.put(
        `http://localhost:5000/api/lists/${updatedList._id}`,
        updatedList,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("chandantoken")}`, // Send JWT token
          },
        }
      );
      setLists(
        lists.map((list) => (list._id === updatedList._id ? updatedList : list))
      );
      setShow(false);
    } catch (error) {
      console.error("Error updating list", error);
      alert("Failed to update list.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          📋 Saved Lists
        </h1>
        <ul className="space-y-6">
          {lists.map((list) => (
            <li
              key={list._id}
              className="flex justify-between items-center p-4 bg-blue-50 border border-gray-200 rounded-lg hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  {list.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Created on: {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleViewImages(list)}
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
                >
                  View Images
                </button>
                <button
                  onClick={() => handleDelete(list._id)}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg shadow hover:bg-red-600 focus:ring-4 focus:ring-red-300"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {show && selectedList && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedList.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Created on:{" "}
              {new Date(selectedList.createdAt).toLocaleDateString()}
            </p>
            <div className="grid grid-cols-2 gap-6">
              {selectedList.imageLinks.map((link, index) => (
                <div key={index} className="relative group">
                  <img
                    src={link}
                    alt={`Response code ${selectedList.responseCodes[index]}`}
                    className="w-full h-42 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdatedList}
                className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;
