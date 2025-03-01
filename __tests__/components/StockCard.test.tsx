import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import StockCard from "../../app/components/StockCard";
import stocksReducer, {
  addToWatchlist,
  removeFromWatchlist,
} from "../../app/store/stocksSlice";

// Mock stock data
const mockStock = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 150.25,
  change: 2.5,
  changePercent: 1.67,
};

// Setup store for testing
const setupStore = () => {
  return configureStore({
    reducer: {
      stocks: stocksReducer,
    },
  });
};

describe("StockCard", () => {
  it("renders stock information correctly", () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <StockCard stock={mockStock} />
      </Provider>
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("$150.25")).toBeInTheDocument();
    expect(screen.getByText("2.50 (1.67%)")).toBeInTheDocument();
  });

  it("shows green arrow and color for positive change", () => {
    const store = setupStore();
    const { container } = render(
      <Provider store={store}>
        <StockCard stock={mockStock} />
      </Provider>
    );

    const priceChange = screen.getByText("2.50 (1.67%)");
    expect(priceChange.className).toContain("text-green-600");
  });

  it("shows red arrow and color for negative change", () => {
    const store = setupStore();
    const negativeStock = { ...mockStock, change: -2.5, changePercent: -1.67 };
    const { container } = render(
      <Provider store={store}>
        <StockCard stock={negativeStock} />
      </Provider>
    );

    const priceChange = screen.getByText("-2.50 (-1.67%)");
    expect(priceChange.className).toContain("text-red-600");
  });

  it("toggles watchlist status when star is clicked", () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <StockCard stock={mockStock} />
      </Provider>
    );

    const starButton = screen.getByRole("button");

    // Click to add to watchlist
    fireEvent.click(starButton);
    expect(store.getState().stocks.watchlistStocks).toContainEqual(mockStock);

    // Click again to remove from watchlist
    fireEvent.click(starButton);
    expect(store.getState().stocks.watchlistStocks).not.toContainEqual(
      mockStock
    );
  });

  it("shows price update indicator when showPriceUpdate prop is true", () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <StockCard stock={mockStock} showPriceUpdate={true} />
      </Provider>
    );

    const indicator = screen.getByRole("presentation", { hidden: true });
    expect(indicator).toHaveClass("animate-pulse");
  });

  it("does not show price update indicator when showPriceUpdate prop is false", () => {
    const store = setupStore();
    const { container } = render(
      <Provider store={store}>
        <StockCard stock={mockStock} showPriceUpdate={false} />
      </Provider>
    );

    const indicator = container.querySelector(".animate-pulse");
    expect(indicator).not.toBeInTheDocument();
  });
});
