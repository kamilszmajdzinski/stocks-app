"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectWatchlist } from "../store/stocksSlice";

export default function Navigation() {
  const pathname = usePathname();
  const watchlistStocks = useSelector(selectWatchlist);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 gap-2 items-center">
          <p className="text-2xl font-bold text-slate-900">StockWatch</p>
          <div className="flex gap-2 h-full">
            <div className="flex">
              <Link
                data-testid="popular-stocks-link"
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-xs md:text-sm font-medium ${
                  pathname === "/"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Popular Stocks
              </Link>
            </div>
            <div className="flex">
              <Link
                data-testid="watchlist-link"
                href="/watchlist"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-xs md:text-sm font-medium ${
                  pathname === "/watchlist"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Watchlist{" "}
                {watchlistStocks.length > 0 && `(${watchlistStocks.length})`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
