import { getStockDetails } from "../../lib/stocks";
import StockChart from "../../components/StockChart";
import { notFound } from "next/navigation";

interface Props {
  params: {
    symbol: string;
  };
}

export default async function StockPage({ params }: Props) {
  const stockDetails = await getStockDetails(params.symbol);

  if (!stockDetails) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{stockDetails.symbol}</h1>
              <p className="text-gray-600 text-xl">{stockDetails.name}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                ${stockDetails.price.toFixed(2)}
              </p>
              <p
                className={`text-lg ${
                  stockDetails.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stockDetails.change.toFixed(2)} (
                {stockDetails.changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>

          <div className="h-[500px]">
            <StockChart data={stockDetails.historicalData} />
          </div>
        </div>
      </div>
    </main>
  );
}
