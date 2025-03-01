import { getPopularStocks } from "./lib/stocks";
import SearchStocks from "./components/SearchStocks";
import StocksDisplay from "./components/StocksDisplay";

export default async function Home() {
  const initialStocks = await getPopularStocks();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SearchStocks />
        <StocksDisplay initialStocks={initialStocks} />
      </div>
    </main>
  );
}
