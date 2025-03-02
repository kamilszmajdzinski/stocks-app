import stocksReducer, {
  setStocks,
  addToWatchlist,
  removeFromWatchlist,
  searchStocks,
  updateWatchlistPrices,
} from '../../app/store/stocksSlice';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import '@testing-library/jest-dom';

const mockStock = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.25,
  change: 2.5,
  changePercent: 1.67
};

describe('stocks reducer', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        stocks: stocksReducer
      }
    });
  });

  it('should handle initial state', () => {
    const state = store.getState() as RootState
    expect(state.stocks).toEqual({
      stocks: [],
      watchlistStocks: [],
      searchQuery: '',
      isLoading: false,
      error: null
    });
  });

  it('should handle setStocks', () => {
    store.dispatch(setStocks([mockStock]));

    const state = store.getState() as RootState
    expect(state.stocks.stocks).toEqual([mockStock]);
    expect(state.stocks.searchQuery).toBe('');
  });

  describe('watchlist operations', () => {
    it('should add stock to watchlist', () => {
      store.dispatch(addToWatchlist(mockStock));

      const state = store.getState() as RootState
      expect(state.stocks.watchlistStocks).toContainEqual(mockStock);
    });

    it('should not add duplicate stock to watchlist', () => {
      store.dispatch(addToWatchlist(mockStock));
      store.dispatch(addToWatchlist(mockStock));

      const state = store.getState() as RootState
      expect(state.stocks.watchlistStocks).toHaveLength(1);
    });

    it('should remove stock from watchlist', () => {
      store.dispatch(addToWatchlist(mockStock));
      store.dispatch(removeFromWatchlist(mockStock.symbol));

      const state = store.getState() as RootState
      expect(state.stocks.watchlistStocks).toHaveLength(0);
    });
  });

  describe('async actions', () => {
    it('should set loading state during search', () => {
      store.dispatch(searchStocks.pending('', ''));

      const state = store.getState() as RootState
      expect(state.stocks.isLoading).toBe(true);
      expect(state.stocks.error).toBe(null);
    });

    it('should handle search success', () => {
      store.dispatch(searchStocks.fulfilled({ results: [mockStock], query: 'AAPL' }, '', 'AAPL'));

      const state = store.getState() as RootState
      expect(state.stocks.stocks).toEqual([mockStock]);
      expect(state.stocks.searchQuery).toBe('AAPL');
      expect(state.stocks.isLoading).toBe(false);
    });

    it('should handle search failure', () => {
      store.dispatch(searchStocks.rejected(new Error('Network error'), '', ''));

      const state = store.getState() as RootState
      expect(state.stocks.isLoading).toBe(false);
      expect(state.stocks.error).toBe('Network error');
    });

    it('should update watchlist prices', () => {
      const updatedStock = { ...mockStock, price: 155.25 };
      store.dispatch(addToWatchlist(mockStock));
      store.dispatch(updateWatchlistPrices.fulfilled([updatedStock], '', [] as unknown as void));

      const state = store.getState() as RootState
      expect(state.stocks.watchlistStocks[0].price).toBe(155.25);
    });
  });
}); 