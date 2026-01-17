import type { ChangeEvent } from 'react';
import type { Currency } from '../../services/currency/types';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { ReactNode } from 'react';

type MuiChangeEventHandler = (
  event:
    | ChangeEvent<Omit<HTMLInputElement, 'value'> & { value: string }>
    | (Event & { target: { value: string; name: string } }),
  child: ReactNode
) => void;

interface CurrencySelectProps {
  currencies: Currency[];
  value: string;
  onChange: MuiChangeEventHandler;
  disabled: boolean;
  label: string;
  id: string;
}

export const CurrencySelect = ({
  currencies,
  value,
  onChange,
  disabled,
  label,
  id,
}: CurrencySelectProps) => {
  const labelId = `${id}-label`;
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        value={value}
        label={label}
        onChange={onChange}
        disabled={disabled}
      >
        {currencies.map((currency) => (
          <MenuItem key={currency.code} value={currency.short_code}>
            {currency.short_code} - {currency.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
