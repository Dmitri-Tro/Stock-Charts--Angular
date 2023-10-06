export interface ChartData {
  chart: {
    result: {
      meta: {
        currency: string;
        symbol: string;
      };
      timestamp: number[];
      comparisons: {
        symbol: string;
        high: number[];
        low: number[];
        open: number[];
        close: number[];
      }[];
    }[];
  };
}
