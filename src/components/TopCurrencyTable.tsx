"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  fromCurrency: string;
}

const topCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "INR",
  "AUD",
  "CAD",
  "CHF",
  "BRL",
  "BGN",
  "CYP",
];

const TopCurrencyTable: React.FC<Props> = ({ fromCurrency }) => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError("");

      try {
        const symbols = topCurrencies
          .filter((cur) => cur !== fromCurrency)
          .join(",");
        const url = `https://api.frankfurter.dev/v1/latest?base=${fromCurrency}&symbols=${symbols}`;

        const response = await axios.get(url);
        setRates(response.data.rates);
      } catch (err) {
        setError("Failed to fetch top currencies.");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency]);

  return (
    <div className="p-6 md:p-8 mt-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Top Currency Rates (Base: {fromCurrency})
      </h3>

      {loading ? (
        <p className="text-indigo-500 text-center font-medium">
          Loading rates...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center font-medium">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3 border">Currency</th>
                <th className="px-4 py-3 border">Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rates).map(([currency, rate]) => (
                <tr key={currency} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border font-medium text-gray-800">
                    {currency}
                  </td>
                  <td className="px-4 py-3 border text-indigo-600 font-semibold">
                    {rate.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopCurrencyTable;
