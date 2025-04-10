// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import exchangeRatesReducer from "../features/exchangeRates/exchangeRatesSlice";

export const rootReducer = combineReducers({
  exchangeRates: exchangeRatesReducer,
});
