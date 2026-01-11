import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-600 mb-2 text-center">
      404
    </h1>
    <div className="text-xl sm:text-2xl md:text-3xl text-white font-semibold mb-4 text-center">
      Page Not Found
    </div>
    <Link
      to="/"
      className="text-rose-600 underline hover:text-pink-400 text-base sm:text-lg transition-colors duration-200"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
