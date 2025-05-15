import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-lg w-full text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Chào mừng đến với Superb AI</h1>
        <p className="text-lg text-gray-600 mb-8">Nền tảng AI giúp bạn xây dựng đội ngũ thông minh và tự động hóa công việc hiệu quả.</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing; 