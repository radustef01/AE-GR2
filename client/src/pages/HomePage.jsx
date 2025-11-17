// client/src/pages/HomePage.jsx
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="bg-white">
      
      <div className="relative w-full h-[70vh]">
        <img
          src="https://a57.foxnews.com/static.foxbusiness.com/foxbusiness.com/content/uploads/2024/10/931/523/ferrari9.jpg?ve=1&tl=1"
          alt="Ferrari"
          className="w-full h-full object-cover"
        />

        
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-4xl sm:text-6xl font-extrabold drop-shadow-lg">
            Welcome to Our Store
          </h1>

          
          <Link
            to="/products"
            className="mt-8 inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition"
          >
            Explore Products
          </Link>
        </div>
      </div>

      
      <div className="max-w-3xl mx-auto text-center py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          The Best Deals Await You
        </h2>
        <p className="text-gray-600 text-lg">
          Explore our wide range of high-quality products — from electronics to
          fashion, lifestyle items, accessories, and more. New items added
          regularly!
        </p>
      </div>
    </div>
  );
}
