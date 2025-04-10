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

interface RateData {
  date: string;
  rate: number | null;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
  from: string;
  to: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  from,
  to,
}) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 text-sm">
        <p className="font-semibold">{label}</p>
        <p>
          1 <span className="font-medium">{from}</span> ={" "}
          <span className="text-indigo-600 font-bold">{payload[0].value}</span>{" "}
          <span className="font-medium">{to}</span>
        </p>
      </div>
    );
  }
  return null;
};

const formatDate = (d: Date): string => d.toISOString().split("T")[0];

const CurrencyTrendChart: React.FC<Props> = ({ fromCurrency, toCurrency }) => {
  const [data, setData] = useState<RateData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistoricalRates = async () => {
      setLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);

        const url = `https://api.frankfurter.dev/v1/${formatDate(
          startDate
        )}..${formatDate(endDate)}?base=${fromCurrency}&symbols=${toCurrency}`;

        const response = await axios.get(url);
        const rates = response.data.rates;

        const days: RateData[] = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          const dateStr = formatDate(date);
          return {
            date: dateStr,
            rate: rates[dateStr]?.[toCurrency] ?? null,
          };
        });

        setData(days);
      } catch (err) {
        console.error("Error fetching historical data", err);
      } finally {
        setLoading(false);
      }
    };

    if (fromCurrency !== toCurrency) {
      fetchHistoricalRates();
    }
  }, [fromCurrency, toCurrency]);

  return (
    <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
        7-Day Exchange Rate Trend
      </h3>

      {loading ? (
        <p className="text-center text-indigo-500 font-medium">
          Loading chart...
        </p>
      ) : (
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip
                content={(props) => (
                  <CustomTooltip
                    {...props}
                    from={fromCurrency}
                    to={toCurrency}
                  />
                )}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CurrencyTrendChart;
