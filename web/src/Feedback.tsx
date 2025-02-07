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

  // Convert data to CSV format
  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // header row
      ...data.map(row => headers.map(header => JSON.stringify(row[header]).replace(/"/g, '')).join(','))
    ];
    return csvRows.join('\n');
  };
  // Download CSV file
  // const downloadCSV = () => {
  //   const csvData = convertToCSV(tableData);
  //   const blob = new Blob([csvData], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.setAttribute('hidden', '');
  //   a.setAttribute('href', url);
  //   a.setAttribute('download', 'feedback_data.csv');
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // };

  return (
    <>
      <FilterMenu filters={filters} onFilterChange={handleFilterChange} />
      {/* <button onClick={downloadCSV} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Export to CSV
      </button> */}
      <FeedbackDataTable 
        data={tableData || []} 
      />
    </>
  );
}