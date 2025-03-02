"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StockData } from "../lib/stocks";
import {
  addToWatchlist,
  removeFromWatchlist,
  selectIsWatchlisted,
} from "../store/stocksSlice";
import type { AppDispatch } from "../store/store";

interface StockCardProps {
  stock: StockData;
  showPriceUpdate?: boolean;
}

export default function StockCard({
  stock,
  showPriceUpdate = false,
}: StockCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isWatchlisted = useSelector(selectIsWatchlisted(stock.symbol));
  const isPositive = stock.change >= 0;
  const ArrowIcon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWatchlisted) {
      dispatch(removeFromWatchlist(stock.symbol));
    } else {
      dispatch(addToWatchlist(stock));
    }
  };

  return (
    <Link href={`/stock/${stock.symbol}`}>
      <div
        data-testid="stock-card"
        className="p-4 flex flex-col justify-between h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-lg text-gray-700 font-semibold">
                {stock.symbol}
              </h3>
              <button
                data-testid="watchlist-button"
                onClick={handleWatchlistClick}
                className="2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isWatchlisted ? (
                  <StarIconSolid className="w-6 h-6 text-yellow-400" />
                ) : (
                  <StarIconOutline className="w-6 h-6 text-gray-400 hover:text-yellow-400" />
                )}
              </button>
            </div>
            <p className="text-gray-600 text-sm">{stock.name}</p>
          </div>
          <div className="flex items-center gap-1">
            <ArrowIcon className={`w-6 h-6 ${changeColor}`} />
            {showPriceUpdate && (
              <div
                className="group relative"
                data-testid="price-update-indicator"
              >
                <div className="bg-green-700 rounded-full w-2 h-2 animate-pulse cursor-help"></div>
                <div className="absolute bottom-full z-10 left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Price is updated every 30 seconds
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-end">
          <span
            data-testid="stock-price"
            className="text-2xl font-bold text-gray-700"
          >
            ${stock.price.toFixed(2)}
          </span>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${changeColor}`}>
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
