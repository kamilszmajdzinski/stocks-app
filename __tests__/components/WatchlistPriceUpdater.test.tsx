import { render, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import WatchlistPriceUpdater from "../../app/components/WatchlistPriceUpdater";
import stocksReducer, { addToWatchlist } from "../../app/store/stocksSlice";

jest.useFakeTimers();

const mockStock = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 150.25,
  change: 2.5,
  changePercent: 1.67,
};

describe("WatchlistPriceUpdater", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        stocks: stocksReducer,
      },
    });
    jest.clearAllTimers();
  });

  it("should start polling when mounted", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <WatchlistPriceUpdater />
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should update prices at regular intervals", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <WatchlistPriceUpdater />
      </Provider>
    );

    // Add a stock to watchlist
    store.dispatch(addToWatchlist(mockStock));

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(30000); // 30 seconds
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(2); // Initial call + one interval
  });

  it("should clean up interval on unmount", () => {
    const { unmount } = render(
      <Provider store={store}>
        <WatchlistPriceUpdater />
      </Provider>
    );

    unmount();

    const dispatchSpy = jest.spyOn(store, "dispatch");

    // Fast-forward time after unmount
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
