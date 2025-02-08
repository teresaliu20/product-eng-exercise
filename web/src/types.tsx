export type Filters = {
  importance: string[];
  type: string[];
  customer: string[];
  date?: DateFilter;
};

export type DateFilter = {
  timeframe: string;
  startDate?: string;
  endDate?: string;
};