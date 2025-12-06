import React, { useState } from 'react';

interface ApiKeyModalProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-black z-50 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Enter TMDb API Key</h2>
        <p className="text-gray-400 mb-6">
          To browse movies, please provide your API key from The Movie Database (TMDb).
          You can get a free key from{' '}
          <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
            the TMDb website
          </a>.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your TMDb API Key (v3 auth)"
            className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
          />
          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 bg-brand-red text-white font-bold rounded-md transition-colors hover:bg-red-700 disabled:bg-gray-500"
            disabled={!apiKey.trim()}
          >
            Start Browsing
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;
