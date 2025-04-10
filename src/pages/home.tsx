import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExchangeRatesThunk } from "../features/exchangeRates/exchangeRatesSlice";
import { RootState, AppDispatch } from "../store";
import CurrencyConverter from "../components/currencyConverter";
import OnlineStatusBanner from "../components/onlineStatusBanner";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { base, lastUpdated, loading, error } = useSelector(
    (state: RootState) => state.exchangeRates
  );

  useEffect(() => {
    dispatch(fetchExchangeRatesThunk(base));
  }, [dispatch, base]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <OnlineStatusBanner />

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-700">
            💱 Live Exchange Rates
          </h1>
        </div>

        {loading && (
          <div className="text-center text-indigo-500 font-medium">
            Loading latest exchange rates...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-semibold">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <CurrencyConverter />
            <p className="text-sm text-gray-500 text-center">
              Last updated: {lastUpdated}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
