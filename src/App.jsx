import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { RankChecker } from './services/rankChecker';

function App() {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!keyword.trim() || !domain.trim()) {
      toast.error('Please enter both keyword and domain');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Checking ranking...');

    try {
      const checker = new RankChecker();
      const data = await checker.checkRanking(keyword, domain);
      setResult(data);
      
      toast.dismiss(loadingToast);
      if (data.position === 'Not found in top 100') {
        toast.info('Domain not found in top 100 results');
      } else {
        toast.success(`Found at position ${data.position}!`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            SEO Rank Checker
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., digital marketing"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g., example.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Ranking'}
            </button>
          </form>

          {result && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-lg font-medium mb-4">Results</h2>
              <div className="space-y-2">
                <p><strong>Keyword:</strong> {result.keyword}</p>
                <p><strong>Domain:</strong> {result.domain}</p>
                <p><strong>Position:</strong> {result.position}</p>
                <p><strong>Checked at:</strong> {new Date(result.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;