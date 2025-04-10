// features/exchangeRates/exchangeRatesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import { fetchExchangeRates as fetchFromAPI } from "../../services/exchangeRateService";

type ExchangeRateState = {
  rates: Record<string, number>;
  base: string;
  lastUpdated: string;
  loading: boolean;
  error: string | null;
};

const initialState: ExchangeRateState = {
  rates: {},
  base: "USD",
  lastUpdated: "",
  loading: false,
  error: null,
};

const exchangeRatesSlice = createSlice({
  name: "exchangeRates",
  initialState,
  reducers: {
    fetchRatesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRatesSuccess(
      state,
      action: PayloadAction<{
        rates: Record<string, number>;
        base: string;
        lastUpdated: string;
      }>
    ) {
      state.loading = false;
      state.rates = action.payload.rates;
      state.base = action.payload.base;
      state.lastUpdated = action.payload.lastUpdated;
    },
    fetchRatesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.base = action.payload;
    },
  },
});

export const {
  fetchRatesStart,
  fetchRatesSuccess,
  fetchRatesFailure,
  setBaseCurrency,
} = exchangeRatesSlice.actions;

export const fetchExchangeRatesThunk = (base: string = "USD") => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchRatesStart());

    let attempts = 0;
    const maxRetries = 3;

    while (attempts < maxRetries) {
      try {
        const { rates, base: usedBase, date } = await fetchFromAPI(base);
        dispatch(
          fetchRatesSuccess({
            rates,
            base: usedBase,
            lastUpdated: date,
          })
        );
        return;
      } catch (error: any) {
        attempts++;
        if (attempts === maxRetries) {
          dispatch(
            fetchRatesFailure(error.message || "Failed after 3 attempts")
          );
        }
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  };
};

export default exchangeRatesSlice.reducer;
