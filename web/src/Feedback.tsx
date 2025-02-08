import { FeedbackDataTable } from "./components/FeedbackDataTable";
import { useFeedbackQuery } from "./hooks";
import { useState, useCallback, useMemo } from "react";
import FilterMenu from "./components/FilterMenu";
import { Filters } from './types'


export function Feedback() {
  const [filters, setFilters] = useState<Filters>({
    importance: [],
    type: [],
    customer: [],
    date: {
      timeframe: "",
      startDate: "",
      endDate: "",
    },
  });

  const { data } = useFeedbackQuery(filters);
  
  // Memoize the data to ensure stable reference
  const tableData = useMemo(() => data?.data || [], [data?.data]);

  // Handle filter changes with a stable callback
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <>
      <FilterMenu filters={filters} onFilterChange={handleFilterChange} />
      <FeedbackDataTable 
        data={tableData || []} 
      />
    </>
  );
}