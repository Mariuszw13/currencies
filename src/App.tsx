import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import CurrencyConverter from './components/currency/CurrencyConverter';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CurrencyConverter />
    </ThemeProvider>
  );
}

export default App;
