import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LINKPREVIEW_API_KEY = '69231dae4b00cc2c2c0e42467d927daf'; // LinkPreview API 키 필요

const Home = () => {
  const { user, updateUserScraps } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // LinkPreview API 호출
      const response = await axios.get('https://api.linkpreview.net', {
        params: {
          q: url,
          key: LINKPREVIEW_API_KEY
        }
      });

      const scrapedData = {
        id: Date.now().toString(),
        url: url,
        title: response.data.title || '제목 없음',
        summary: response.data.description || '설명 없음',
        imageUrl: response.data.image || 'https://via.placeholder.com/400',
        thumbnailUrl: response.data.image || 'https://via.placeholder.com/400',
        createdAt: new Date().toISOString()
      };

      // 사용자의 스크랩 목록 업데이트
      const updatedScraps = [...user.scraps, scrapedData];
      updateUserScraps(updatedScraps);
      
      // 스크랩북 페이지로 이동
      navigate('/scrapbook');
    } catch (error) {
      console.error('URL 스크래핑 오류:', error);
      setError('URL을 스크래핑하는 데 실패했습니다. API 키를 확인하거나 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          간편한 웹 스크래핑
        </h1>
        <p className="text-xl text-gray-600">
          URL을 입력하면 이미지, 썸네일, 요약 정보를 자동으로 추출합니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="스크래핑할 URL을 입력하세요..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? '스크래핑 중...' : '스크랩하기'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {!user && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            스크랩을 저장하려면{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              로그인
            </Link>
            이 필요합니다
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;