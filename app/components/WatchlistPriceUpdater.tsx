"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectWatchlist, updateWatchlistPrices } from "../store/stocksSlice";
import type { AppDispatch } from "../store/store";

const POLLING_INTERVAL = 30000; // 30 seconds

export default function WatchlistPriceUpdater() {
  const dispatch = useDispatch<AppDispatch>();
  const watchlistStocks = useSelector(selectWatchlist);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updatePrices = () => {
      dispatch(updateWatchlistPrices());
    };

    timerRef.current = setInterval(updatePrices, POLLING_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("watchlistStocks 2", watchlistStocks);
  }, [watchlistStocks]);

  return null;
}
