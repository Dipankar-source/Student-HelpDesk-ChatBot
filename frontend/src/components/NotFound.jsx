import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import cavemanAnimation from "./Caveman - 404 Page.json";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-3xl w-full text-center">
        {/* Animation Container */}
        <div className="relative w-full h-64 md:h-80 mb-8">
          <div className="caveman-animation">
            <div className="w-full h-full bg-zinc-50 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Lottie
                  animationData={cavemanAnimation}
                  loop={true}
                  className="w-full h-full relative"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-8xl md:text-9xl font-bold text-orange-700 mb-2">
          404
        </h1>
        <div className="mb-10"></div>
        <div className="mb-8">
          <p className="text-gray-500 text-lg">Error Code: 404</p>
        </div>

        <div className="mt-10">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out font-semibold shadow-md"
          >
            Back to previous Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
