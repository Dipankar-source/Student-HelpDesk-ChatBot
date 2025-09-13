import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-center px-4">
      <h1 className="text-7xl md:text-9xl font-extrabold text-gray-800 drop-shadow-lg">
        404
      </h1>
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-700">
        Oops! Page Not Found
      </h2>
      <p className="mt-2 text-gray-500 max-w-lg">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
