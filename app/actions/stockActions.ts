'use server';

import yahooFinance from 'yahoo-finance2';
import { StockData } from '../lib/stocks';

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
          .filter(result => result.symbol)
          .map(async (result) => {
            console.log('result', result);

            try {
              const quote = await yahooFinance.quote(result.symbol);
              return {
                symbol: result.symbol,
                name: quote.longName || quote.shortName || result.symbol,
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