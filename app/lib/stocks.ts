import yahooFinance from 'yahoo-finance2';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockDetails extends StockData {
  historicalData: HistoricalDataPoint[];
}

export async function getPopularStocks(): Promise<StockData[]> {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD'];
  
  try {
    const quotes = await Promise.all(
      symbols.map(symbol => yahooFinance.quote(symbol))
    );

    return quotes.map(quote => ({
      symbol: quote.symbol,
      name: quote.longName || quote.shortName || quote.symbol,
      price: quote.regularMarketPrice || 0, 
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    }));
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}

export async function searchStocks(query: string): Promise<StockData[]> {
  try {
    const results = await yahooFinance.search(query);
    const quotes = await Promise.all(
      results.quotes
        .slice(0, 8)
        .map(result => yahooFinance.quote(result.symbol))
    );

    return quotes.map(quote => ({
      symbol: quote.symbol,
      name: quote.longName || quote.shortName || quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
    }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

export async function getStockDetails(symbol: string): Promise<StockDetails | null> {
  try {
    const quote = await yahooFinance.quote(symbol);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const historical = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    });

    return {
      symbol: symbol,
      name: quote.longName || quote.shortName || symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      historicalData: historical.map(data => ({
        date: data.date.toISOString().split('T')[0],
        open: data.open || 0,
        high: data.high || 0,
        low: data.low || 0,
        close: data.close || 0,
        volume: data.volume || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching stock details:', error);
    return null;
  }
} 