export interface City {
  id?: number;
  position?: {
    left: string;
    top: string;
  };
  name: string;
  color?: string;
  code?: string; // Optional for compatibility with uwCities structure
}
