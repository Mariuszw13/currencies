import type { Currency, CurrenciesResponse, ConvertResponse, ConvertParams } from './types';

const API_BASE_URL = 'https://api.currencybeacon.com/v1';
const API_KEY = import.meta.env.VITE_CURRENCY_BEACON_API_KEY;

if (!API_KEY) {
  console.warn('VITE_CURRENCY_BEACON_API_KEY is not set in environment variables');
}

export async function fetchCurrencies(): Promise<Currency[]> {
  const response = await fetch(`${API_BASE_URL}/currencies?api_key=${API_KEY}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.statusText}`);
  }

  const data: CurrenciesResponse = await response.json();
  return data.response || [];
}

export async function convertCurrency(params: ConvertParams): Promise<number> {
  const { from, to, amount } = params;
  const response = await fetch(
    `${API_BASE_URL}/convert?api_key=${API_KEY}&from=${from}&to=${to}&amount=${amount}`
  );

  if (!response.ok) {
    throw new Error(`Failed to convert currency: ${response.statusText}`);
  }

  const data: ConvertResponse = await response.json();
  return data.response.value;
}
