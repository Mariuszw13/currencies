import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import type { Currency } from '../../services/currency/types';
import { fetchCurrencies, convertCurrency } from '../../services/currency/currencyApi';
import { CurrencySelect } from './CurrencySelect';

const DECIMAL_NUMBER_REGEX = /^\d*\.?\d*$/;
const DECIMAL_NUMBER_PATTERN = '[0-9]*\\.?[0-9]*';

function formatConvertedAmount(amount: number | null): string {
  if (amount === null) {
    return '--';
  }
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [amount, setAmount] = useState<string>('1');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const {
    data: currencies = [],
    isLoading: isLoadingCurrencies,
    error: currenciesError,
  } = useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
  });

  const {
    data: conversionResult,
    isLoading: isConverting,
    error: conversionError,
  } = useQuery<number>({
    queryKey: ['convert', fromCurrency, toCurrency, amount],
    queryFn: () =>
      convertCurrency({
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount) || 0,
      }),
    enabled: Boolean(fromCurrency && toCurrency && amount && parseFloat(amount) > 0),
  });

  useEffect(() => {
    if (conversionResult !== undefined) {
      setConvertedAmount(conversionResult);
    }
  }, [conversionResult]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || DECIMAL_NUMBER_REGEX.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Currency Converter
        </Typography>

        {currenciesError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load currencies. Please check your API key and try again.
          </Alert>
        )}

        {conversionError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to convert currency. Please try again.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <CurrencySelect
              currencies={currencies}
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              disabled={isLoadingCurrencies}
              label="From Currency"
              id="from-currency"
            />

            <TextField
              fullWidth
              label="Amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              slotProps={{
                htmlInput: {
                  pattern: DECIMAL_NUMBER_PATTERN,
                },
                input: {
                  inputMode: 'decimal',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <CurrencySelect
              currencies={currencies}
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              disabled={isLoadingCurrencies}
              label="To Currency"
              id="to-currency"
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '56px',
                border: '1px solid black',
                borderRadius: '4px',
                bgcolor: 'lightgray',
              }}
            >
              {isConverting ? (
                <CircularProgress size={24} />
              ) : (
                <Typography
                  variant="body1"
                  color={convertedAmount !== null ? undefined : 'text.secondary'}
                >
                  {formatConvertedAmount(convertedAmount)}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {isLoadingCurrencies && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Container>
  );
}
