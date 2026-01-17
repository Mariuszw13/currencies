export interface Currency {
  code: string;
  name: string;
  short_code: string;
  symbol: string;
  thousand_separator: string;
}

export interface CurrenciesResponse {
  response: Currency[];
}

export interface ConvertResponse {
  response: {
    value: number;
  };
}

export interface ConvertParams {
  from: string;
  to: string;
  amount: number;
}
