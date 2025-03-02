'use server';

import yahooFinance from 'yahoo-finance2';
import { StockData } from '../lib/stocks';

interface YahooSearchResult {
  symbol: string;
  [key: string]: unknown;
}

export async function searchStocksAction(query: string): Promise<StockData[]> {
  try {
    if (query.length <= 5 && query.toUpperCase() === query) {
      try {
        const quote = await yahooFinance.quote(query);
        return [{
          symbol: query,
          name: quote.longName || quote.shortName || query,
          price: quote.regularMarketPrice || 0,
          change: quote.regularMarketChange || 0,
          changePercent: quote.regularMarketChangePercent || 0,
        }];
      } catch {
        return [];
      }
    }

    try {
      const results = await yahooFinance.search(query);

      const quotes = await Promise.all(
        results.quotes
          .slice(0, 5)
          .filter(result => 'symbol' in result)
          .map(async (result) => {
            const searchResult = result as YahooSearchResult;
            try {
              const quoteResponse = await yahooFinance.quote(searchResult.symbol);
              // Handle the case where quote might be an array
              const quote = Array.isArray(quoteResponse) ? quoteResponse[0] : quoteResponse;
              
              return {
                symbol: searchResult.symbol,
                name: quote.longName || quote.shortName || searchResult.symbol,
                price: quote.regularMarketPrice || 0,
                change: quote.regularMarketChange || 0,
                changePercent: quote.regularMarketChangePercent || 0,
              };
            } catch {
              return null;
            }
          })
      );

      return quotes.filter((quote): quote is StockData => quote !== null);
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
} 