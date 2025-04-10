"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import CurrencyTrendChart from "./currencyTrendChart";
import TopCurrencyTable from "./TopCurrencyTable";

const currencies = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"];

const CurrencyConverter = () => {
  const { rates, loading } = useSelector(
    (state: RootState) => state.exchangeRates
  );

  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [converted, setConverted] = useState<number | null>(null);

  useEffect(() => {
    if (!rates || !rates[toCurrency] || !rates[fromCurrency]) {
      setConverted(null);
      return;
    }

    const toRate = rates[toCurrency] / rates[fromCurrency];
    const result = amount * toRate;
    setConverted(result);
  }, [amount, fromCurrency, toCurrency, rates]);

  return (
    <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto space-y-6 border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-indigo-700">
        Currency Converter
      </h2>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            From
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-2 text-center">
        {loading ? (
          <p className="text-indigo-500 font-medium">
            Fetching latest rates...
          </p>
        ) : converted !== null ? (
          <p className="text-xl font-semibold text-gray-700">
            {amount} {fromCurrency} ={" "}
            <span className="text-green-600 font-bold">
              {converted.toFixed(4)} {toCurrency}
            </span>
          </p>
        ) : (
          <p className="text-gray-500">Conversion unavailable</p>
        )}
      </div>

      <CurrencyTrendChart fromCurrency={fromCurrency} toCurrency={toCurrency} />
      <TopCurrencyTable fromCurrency={fromCurrency} />
    </div>
  );
};

export default CurrencyConverter;
