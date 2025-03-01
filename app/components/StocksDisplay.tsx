"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStocks,
  selectIsSearching,
  selectIsLoading,
  selectError,
  setStocks,
} from "../store/stocksSlice";
import StockCard from "./StockCard";
import { StockData } from "../lib/stocks";
import type { AppDispatch } from "../store/store";

export default function StocksDisplay({
  initialStocks,
}: {
  initialStocks: StockData[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const stocks = useSelector(selectStocks);
  const isSearching = useSelector(selectIsSearching);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (initialStocks && initialStocks.length > 0 && stocks.length === 0) {
      dispatch(setStocks(initialStocks));
    }
  }, [dispatch, initialStocks, stocks.length]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-gray-700">
        {isSearching ? "Search Results" : "Popular Stocks"}
      </h1>

      {error && <div className="text-center text-red-600 mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center">Loading stocks...</div>
      ) : stocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      ) : isSearching ? (
        <div className="text-center text-gray-600">No results found</div>
      ) : (
        <div className="text-center text-gray-600">No stocks available</div>
      )}
    </>
  );
}
