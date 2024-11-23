import { config } from './config.js';
import { ScrapingService } from './services/scraping.service.js';

async function checkRankPosition(keyword, domain) {
  const scraper = new ScrapingService(config.scrapingBeeApiKey);
  
  console.log(`\n🔍 Checking ranking for "${keyword}" on ${domain}...`);
  
  try {
    const result = await scraper.scrapeRankData(keyword, domain);
    
    console.log('\n📊 Ranking Results:');
    console.log('------------------');
    console.log(`🎯 Keyword: ${result.keyword}`);
    console.log(`🌐 Domain: ${result.domain}`);
    console.log(`🏆 Position: ${result.position}`);
    console.log(`⏰ Checked at: ${result.timestamp}`);
    console.log(`✨ Status: ${result.status}`);
    
    return result;
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    const keyword = 'digital marketing';
    const domain = 'hubspot.com'; // Using a real domain for better testing
    await checkRankPosition(keyword, domain);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();