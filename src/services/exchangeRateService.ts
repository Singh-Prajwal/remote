// services/exchangeRateService.ts
import axios from "axios";
import config from "../config/config";

const MAX_RETRIES = 3;

export const fetchExchangeRates = async (
  base: string = "USD",
  retries: number = MAX_RETRIES
): Promise<{
  rates: Record<string, number>;
  base: string;
  date: string;
}> => {
  const url = config.apiUrl;

  try {
    const response = await axios.get(url);
    const data = response.data;
    return {
      rates: data.conversion_rates,
      base: data.base,
      date: data.time_last_update_utc,
    };
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`Retrying... (${MAX_RETRIES - retries + 1})`);
      console.error("Error fetching rates:", error?.message || error);
      return fetchExchangeRates(base, retries - 1);
    } else {
      console.error("ExchangeRate API failed after multiple retries.");
      throw new Error("Failed to fetch exchange rates.");
    }
  }
};
