import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StockData } from '../lib/stocks';
import { searchStocksAction } from '../actions/stockActions';
import type { RootState } from './store';

interface StocksState {
  stocks: StockData[];
  watchlistStocks: StockData[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: StocksState = {
  stocks: [],
  watchlistStocks: [],
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const searchStocks = createAsyncThunk(
  'stocks/search',
  async (query: string) => {
    const results = await searchStocksAction(query);
    return { results, query };
  }
);

export const updateWatchlistPrices = createAsyncThunk(
  'stocks/updateWatchlistPrices',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const watchlistStocks = state.stocks.watchlistStocks;
    const symbols = watchlistStocks.map(stock => stock.symbol);
    
    if (symbols.length === 0) return [];
    
    const results = await searchStocksAction(symbols.join(' '));
    return results;
  }
);

export const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<StockData[]>) => {
      state.stocks = action.payload;
      state.searchQuery = '';
    },
    clearSearch: (state) => {
      state.searchQuery = '';
    },
    addToWatchlist: (state, action: PayloadAction<StockData>) => {
      if (!state.watchlistStocks.some(stock => stock.symbol === action.payload.symbol)) {
        state.watchlistStocks.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlistStocks = state.watchlistStocks.filter(
        stock => stock.symbol !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchStocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stocks = action.payload.results;
        state.searchQuery = action.payload.query;
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(updateWatchlistPrices.fulfilled, (state, action) => {
        // Update prices for watchlist stocks
        state.watchlistStocks = state.watchlistStocks.map(watchlistStock => {
          const updatedStock = action.payload.find(
            stock => stock.symbol === watchlistStock.symbol
          );
          return updatedStock || watchlistStock;
        });
      });
  },
});

// Selectors
export const selectStocks = (state: { stocks: StocksState }) => state.stocks.stocks;
export const selectWatchlist = (state: { stocks: StocksState }) => state.stocks.watchlistStocks;
export const selectIsWatchlisted = (symbol: string) => 
  (state: { stocks: StocksState }) => 
    state.stocks.watchlistStocks.some(stock => stock.symbol === symbol);
export const selectIsSearching = (state: { stocks: StocksState }) => state.stocks.searchQuery !== '';
export const selectIsLoading = (state: { stocks: StocksState }) => state.stocks.isLoading;
export const selectError = (state: { stocks: StocksState }) => state.stocks.error;

export const { setStocks, clearSearch, addToWatchlist, removeFromWatchlist } = stocksSlice.actions;
export default stocksSlice.reducer; 