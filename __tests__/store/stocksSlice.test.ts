import stocksReducer, {
  setStocks,
  addToWatchlist,
  removeFromWatchlist,
  searchStocks,
  updateWatchlistPrices,
} from '../../app/store/stocksSlice';
import { configureStore } from '@reduxjs/toolkit';

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
    expect(store.getState().stocks).toEqual({
      stocks: [],
      watchlistStocks: [],
      searchQuery: '',
      isLoading: false,
      error: null
    });
  });

  it('should handle setStocks', () => {
    store.dispatch(setStocks([mockStock]));
    expect(store.getState().stocks.stocks).toEqual([mockStock]);
    expect(store.getState().stocks.searchQuery).toBe('');
  });

  describe('watchlist operations', () => {
    it('should add stock to watchlist', () => {
      store.dispatch(addToWatchlist(mockStock));
      expect(store.getState().stocks.watchlistStocks).toContainEqual(mockStock);
    });

    it('should not add duplicate stock to watchlist', () => {
      store.dispatch(addToWatchlist(mockStock));
      store.dispatch(addToWatchlist(mockStock));
      expect(store.getState().stocks.watchlistStocks).toHaveLength(1);
    });

    it('should remove stock from watchlist', () => {
      store.dispatch(addToWatchlist(mockStock));
      store.dispatch(removeFromWatchlist(mockStock.symbol));
      expect(store.getState().stocks.watchlistStocks).toHaveLength(0);
    });
  });

  describe('async actions', () => {
    it('should set loading state during search', () => {
      store.dispatch(searchStocks.pending('', ''));
      expect(store.getState().stocks.isLoading).toBe(true);
      expect(store.getState().stocks.error).toBe(null);
    });

    it('should handle search success', () => {
      store.dispatch(searchStocks.fulfilled({ results: [mockStock], query: 'AAPL' }, '', 'AAPL'));
      expect(store.getState().stocks.stocks).toEqual([mockStock]);
      expect(store.getState().stocks.searchQuery).toBe('AAPL');
      expect(store.getState().stocks.isLoading).toBe(false);
    });

    it('should handle search failure', () => {
      store.dispatch(searchStocks.rejected(new Error('Network error'), '', ''));
      expect(store.getState().stocks.isLoading).toBe(false);
      expect(store.getState().stocks.error).toBe('Network error');
    });

    it('should update watchlist prices', () => {
      const updatedStock = { ...mockStock, price: 155.25 };
      store.dispatch(addToWatchlist(mockStock));
      store.dispatch(updateWatchlistPrices.fulfilled([updatedStock], '', []));
      expect(store.getState().stocks.watchlistStocks[0].price).toBe(155.25);
    });
  });
}); 