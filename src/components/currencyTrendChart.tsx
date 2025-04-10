"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  fromCurrency: string;
  toCurrency: string;
}

const CurrencyTrendChart: React.FC<Props> = ({ fromCurrency, toCurrency }) => {
  const [data, setData] = useState<{ date: string; rate: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [predictedRate, setPredictedRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistoricalRates = async () => {
      setLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);

        const format = (d: Date) => d.toISOString().split("T")[0];
        const url = `https://api.frankfurter.dev/v1/${format(
          startDate
        )}..${format(endDate)}?base=${fromCurrency}&symbols=${toCurrency}`;
        const response = await axios.get(url);
        const rates = response.data.rates;

        const formattedData = Object.entries(rates).map(([date, rateObj]) => ({
          date,
          rate: rateObj[toCurrency],
        }));

        setData(formattedData);
        runPrediction(formattedData);
      } catch (err) {
        console.error("Error fetching historical data", err);
      } finally {
        setLoading(false);
      }
    };

    const runPrediction = (
      trendData: { date: string; rate: number }[]
    ): void => {
      const x = trendData.map((_, i) => i); // 0 to 6
      const y = trendData.map((d) => d.rate);

      const n = x.length;
      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
      const sumXX = x.reduce((acc, val) => acc + val * val, 0);

      const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const b = (sumY - m * sumX) / n;

      const predicted = m * 7 + b; // x = 7 (next day)
      setPredictedRate(predicted);
    };

    if (fromCurrency !== toCurrency) {
      fetchHistoricalRates();
    }
  }, [fromCurrency, toCurrency]);

  return (
    <div className="p-4 mt-6 bg-white rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">
        7-Day Trend + Next Day Prediction
      </h3>
      {loading ? (
        <p className="text-center text-blue-500">Loading chart...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="date" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {predictedRate !== null && (
            <p className="text-center text-sm text-gray-700 mt-2">
              <strong>Prediction:</strong> Tomorrow's estimated rate ={" "}
              <span className="text-green-600 font-bold">
                {predictedRate.toFixed(4)} {toCurrency}
              </span>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default CurrencyTrendChart;
