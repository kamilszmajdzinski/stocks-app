"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  searchStocks,
  clearSearch,
  selectIsLoading,
} from "../store/stocksSlice";
import type { AppDispatch } from "../store/store";

export default function SearchStocks() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectIsLoading);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      dispatch(clearSearch());
      return;
    }
    dispatch(searchStocks(query));
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company name or ticker symbol..."
          className="w-full p-4 pr-12 rounded-lg border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <MagnifyingGlassIcon className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}
