import { FeedbackDataTable } from "./components/FeedbackDataTable";
import { useFeedbackQuery } from "./hooks";
import { useState, useCallback, useMemo } from "react";
import FilterMenu from "./components/FilterMenu";

export function Feedback() {
  const [filters, setFilters] = useState({
    importance: [],
    type: [],
    customer: [],
    date: []
  });

  const { data } = useFeedbackQuery(filters);
  console.log("FILTERS", filters)
  
  // Memoize the data to ensure stable reference
  const tableData = useMemo(() => data?.data || [], [data?.data]);

  // Handle filter changes with a stable callback
  const handleFilterChange = useCallback((newFilters) => {
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