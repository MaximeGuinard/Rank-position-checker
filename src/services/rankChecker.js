import axios from 'axios';

const API_KEY = 'HX9LVBEK047YVML2RFQ5LFPY0FN5CLTX828MRKFVNC5J4ODJQQK3C1Q3IJTXMU19744Y1BTZC15YL2EH';

export class RankChecker {
  async checkRanking(keyword, domain) {
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').trim();
    const searchQuery = `${keyword} site:${cleanDomain}`;
    const encodedUrl = encodeURIComponent(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=100`);
    
    const options = {
      method: 'GET',
      url: 'https://app.scrapingbee.com/api/v1/',
      params: {
        'api_key': API_KEY,
        'url': encodedUrl,
        'render_js': false,
        'premium_proxy': true,
        'country_code': 'us'
      }
    };

    try {
      const response = await axios(options);
      const html = response.data;
      
      // Simple regex pattern to find the domain in search results
      const pattern = new RegExp(`<cite[^>]*>.*?${cleanDomain}.*?</cite>`, 'i');
      const match = html.match(pattern);
      
      let position = 'Not found in top 100';
      if (match) {
        // Count citations before this one to determine position
        const beforeMatch = html.slice(0, match.index);
        const citationsBeforeCount = beforeMatch.match(/<cite/g)?.length || 0;
        position = citationsBeforeCount + 1;
      }

      return {
        keyword,
        domain: cleanDomain,
        position,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error('Failed to check ranking. Please try again later.');
    }
  }
}