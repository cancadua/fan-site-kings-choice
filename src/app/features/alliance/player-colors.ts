import { PlayerColor } from '../../core/api/api.models';

export interface PlayerColorOption {
  value: PlayerColor;
  label: string;
  /** Swatch color; null for None (nothing is shown). */
  swatch: string | null;
}

/** Player color markers in API order. Their meaning is up to each alliance. */
export const PLAYER_COLORS: readonly PlayerColorOption[] = [
  { value: 'None', label: 'No color', swatch: null },
  { value: 'Orange', label: 'Orange', swatch: '#ff9800' },
  { value: 'Yellow', label: 'Yellow', swatch: '#ffeb3b' },
  { value: 'White', label: 'White', swatch: '#f5f5f5' },
  { value: 'Green', label: 'Green', swatch: '#66bb6a' },
  { value: 'Blue', label: 'Blue', swatch: '#42a5f5' },
  { value: 'Red', label: 'Red', swatch: '#ef5350' },
  { value: 'DarkRed', label: 'Dark red', swatch: '#8b0000' },
];

export function playerColor(value: PlayerColor): PlayerColorOption {
  return PLAYER_COLORS.find((c) => c.value === value) ?? PLAYER_COLORS[0];
}
