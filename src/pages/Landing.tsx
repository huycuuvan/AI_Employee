import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-lg w-full text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">{t('welcome')}</h1>
        <p className="text-lg text-gray-600 mb-8">Nền tảng AI giúp bạn xây dựng đội ngũ thông minh và tự động hóa công việc hiệu quả.</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition mb-4"
          onClick={handleGetStarted}
        >
          {t('getStarted')}
        </button>
        <div className="flex justify-center gap-2 mt-2">
          <button onClick={() => i18n.changeLanguage('vi')} className={i18n.language === 'vi' ? 'font-bold underline' : ''}>Tiếng Việt</button>
          <span>|</span>
          <button onClick={() => i18n.changeLanguage('en')} className={i18n.language === 'en' ? 'font-bold underline' : ''}>English</button>
        </div>
      </div>
    </div>
  );
};

export default Landing; 