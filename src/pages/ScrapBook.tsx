import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Scrap } from '../types';

const ScrapBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleDelete = (scrapId: string) => {
    // TODO: Implement delete functionality
    console.log('Deleting scrap:', scrapId);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Scraps</h1>
      
      {user.scraps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            You haven't saved any scraps yet. Go to the home page to start scraping!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.scraps.map((scrap: Scrap) => (
            <div key={scrap.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {scrap.imageUrl && (
                <img
                  src={scrap.imageUrl}
                  alt={scrap.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {scrap.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {scrap.summary}
                </p>
                <div className="flex justify-between items-center">
                  <a
                    href={scrap.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Visit</span>
                  </a>
                  <button
                    onClick={() => handleDelete(scrap.id)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScrapBook;