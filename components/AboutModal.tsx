import React from 'react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-brand-black w-full max-w-2xl rounded-lg overflow-hidden mx-4 my-8 relative shadow-lg border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="p-8 space-y-6">
          <h2 className="font-display text-4xl md:text-5xl text-brand-red">About Meiyazhagan</h2>
          <p className="text-gray-300">
            Welcome to Meiyazhagan, a modern web application for browsing movies and TV series, inspired by Netflix. This project showcases a seamless user experience built with cutting-edge front-end technologies.
          </p>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Core Features:</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li><span className="font-semibold text-gray-200">Dynamic Content:</span> Fetches and displays the latest movies and TV shows from The Movie Database (TMDb) API.</li>
                <li><span className="font-semibold text-gray-200">AI-Powered Suggestions:</span> Leverages the Google Gemini API to provide intelligent movie recommendations based on your mood or description.</li>
                <li><span className="font-semibold text-gray-200">Responsive Design:</span> A fully responsive interface that looks great on desktops, tablets, and mobile devices.</li>
                <li><span className="font-semibold text-gray-200">Advanced Search:</span> Quickly find any movie or TV show with the powerful multi-search feature.</li>
            </ul>
          </div>
           <div className="border-t border-gray-700 pt-4">
               <p className="text-center text-gray-500 text-sm">Developed with ❤️ by Raj.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;