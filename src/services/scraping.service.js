import axios from 'axios';
import { load } from 'cheerio';

export class ScrapingService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://app.scrapingbee.com/api/v1/';
    this.maxRetries = 3;
    this.retryDelay = 2000;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validateInputs(keyword, domain) {
    if (!keyword || typeof keyword !== 'string') {
      throw new Error('Invalid keyword: Keyword must be a non-empty string');
    }
    if (!domain || typeof domain !== 'string') {
      throw new Error('Invalid domain: Domain must be a non-empty string');
    }
    if (!this.apiKey) {
      throw new Error('API key is missing or invalid');
    }
  }

  async scrapeRankData(keyword, domain) {
    this.validateInputs(keyword, domain);

    // Construct Google search URL with proper encoding
    const searchQuery = `${keyword} site:${domain}`;
    const targetUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=100`;
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`📡 Attempt ${attempt}/${this.maxRetries}...`);
        
        const response = await axios({
          method: 'get',
          url: this.baseUrl,
          params: {
            'api_key': this.apiKey,
            'url': targetUrl,
            'render_js': true,
            'premium_proxy': true,
            'country_code': 'us',
            'block_ads': true,
            'block_resources': true
          },
          validateStatus: status => status === 200,
          timeout: 30000
        });

        if (!response.data) {
          throw new Error('Empty response received');
        }

        return this.parseRankData(response.data, keyword, domain);
      } catch (error) {
        lastError = error;
        console.log(`⚠️ Attempt ${attempt} failed: ${error.message}`);
        
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw new Error(`Scraping failed after ${this.maxRetries} attempts. Last error: ${lastError.message}`);
  }

  parseRankData(html, keyword, domain) {
    try {
      const $ = load(html);
      let position = 'Not found';
      let found = false;

      // Look for search results in Google's format
      $('.g').each((index, element) => {
        const cite = $(element).find('cite').text().toLowerCase();
        if (cite && cite.includes(domain.toLowerCase())) {
          position = index + 1;
          found = true;
          return false; // Break the loop
        }
      });

      return {
        keyword,
        domain,
        position: found ? position : 'Not found in top 100',
        timestamp: new Date().toISOString(),
        status: found ? 'success' : 'not_found'
      };
    } catch (error) {
      throw new Error(`Failed to parse search results: ${error.message}`);
    }
  }
}