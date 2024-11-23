import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SCRAPINGBEE_API_KEY = 'HX9LVBEK047YVML2RFQ5LFPY0FN5CLTX828MRKFVNC5J4ODJQQK3C1Q3IJTXMU19744Y1BTZC15YL2EH';

async function checkRankPosition(keyword, domain) {
  try {
    // Encode the RankRanger URL we want to scrape
    const rankRangerUrl = encodeURIComponent(`https://www.rankranger.com/rank-checker?keyword=${encodeURIComponent(keyword)}&domain=${encodeURIComponent(domain)}`);
    
    const response = await axios.get(`https://app.scrapingbee.com/api/v1/`, {
      params: {
        'api_key': SCRAPINGBEE_API_KEY,
        'url': rankRangerUrl,
        'render_js': 'true', // Enable JavaScript rendering
        'wait': '5000' // Wait for dynamic content to load
      }
    });

    if (response.status === 200) {
      console.log('Response:', response.data);
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error checking rank position:', error.message);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    const keyword = 'digital marketing';
    const domain = 'example.com';
    
    console.log(`Checking ranking for keyword "${keyword}" on domain "${domain}"...`);
    const result = await checkRankPosition(keyword, domain);
    console.log('Ranking results:', result);
  } catch (error) {
    console.error('Main error:', error.message);
  }
}

main();