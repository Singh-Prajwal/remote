class AppConfig {
  readonly apiUrl =
    // "https://v6.exchangerate-api.com/v6/983a9dc0ef8e9308134e4c72/latest/USD";
    "https://v6.exchangerate-api.com/v6/fab819725b57efa4e3851225/latest/USD";
  // process.env.API_URL ??
  // "https://api.exchangeratesapi.io/v1/latest?access_key=35660196d03fab3d6219b57ec28bf1ea&symbols=USD,AUD,CAD,PLN,MXN&format=1";
}
export default new AppConfig();
