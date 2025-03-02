"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import StockCard from "../components/StockCard";
import WatchlistPriceUpdater from "../components/WatchlistPriceUpdater";
import { selectWatchlist } from "../store/stocksSlice";

export default function WatchlistPage() {
  const watchlistStocks = useSelector(selectWatchlist);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <WatchlistPriceUpdater />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">My Watchlist</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Stocks
          </Link>
        </div>

        {watchlistStocks.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-watchlist">
            <p className="text-gray-600 text-lg mb-4">
              Your watchlist is empty
            </p>
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Browse stocks to add to your watchlist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {watchlistStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} showPriceUpdate />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
