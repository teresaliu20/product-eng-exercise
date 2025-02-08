import { useState } from 'react';
import { CalendarDays, UserRoundSearch, ListChecks, CircleAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { Filters } from '../types'

type FilterOptions = {
  importance: string[];
  type: string[];
  customer: string[];
  date: string[];
};

type TableFilterProps = {
  filters: Filters;
  onFilterChange: any; // note: was getting really weird typescript issues
}

const TableFilter = ({ filters, onFilterChange }: TableFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<keyof FilterOptions | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filterOptions: FilterOptions = {
    importance: ['High', 'Medium', 'Low'],
    type: ["Sales", "Customer", "Research"],
    customer: ["Loom", "Ramp", "Brex", "Vanta", "Notion", "Linear", "OpenAI"],
    date: ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Date Range'] };

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter as keyof FilterOptions);
    setShowDatePicker(false);
  };

  const handleBackClick = () => {
    setSelectedFilter(null);
    setShowDatePicker(false);
  };

  const handleOptionToggle = (option: string) => {
    if (!selectedFilter) return; 
  
    onFilterChange((prev: Filters) => {
      const key = selectedFilter as keyof Filters; 
      const currentSelections = Array.isArray(prev[key]) ? prev[key] : [];
      const newSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option)
        : [...currentSelections, option];
  
      return {
        ...prev,
        [key]: newSelections,
      };
    });
  };

  const handleDateClick = (option: string) => {
    if (option === 'Custom Date Range') {
      setShowDatePicker(true);
    } else {
      onFilterChange((prev: Filters) => ({
        ...prev,
        date: {
          timeframe: option
        }
      }));
    }
  };

 const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
  const selectedDate = new Date(e.target.value);
  if (isNaN(selectedDate.getTime())) return;

  if (type === 'start') {
    setStartDate(selectedDate);
    if (endDate) {
      onFilterChange((prev: Filters) => ({
        ...prev,
        date: {
          ...prev.date, // Preserve other possible properties in date
          timeframe: 'Custom Date Range',
          startDate: selectedDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      }));
    }
  } else {
    setEndDate(selectedDate);
    if (startDate) {
      onFilterChange((prev: Filters) => ({
        ...prev,
        date: {
          ...prev.date,
          timeframe: 'Custom Date Range',
          startDate: startDate.toISOString().split('T')[0],
          endDate: selectedDate.toISOString().split('T')[0],
        },
      }));
    }
  }
};

  return (
    <div className="relative w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-30 px-4 py-2 text-left border rounded-lg bg-white hover:bg-gray-50 flex items-center justify-between"
      >
        <p>Filter</p>
        {
          isOpen ? 
          <ChevronUp className="w-4 h-4 ml-2" /> :
          <ChevronDown className="w-4 h-4 ml-2" />
        }
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
          {!selectedFilter ? (
            <div className="p-2">
              {Object.keys(filterOptions).map(filter => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded flex items-center"
                >
                  {filter === 'importance' && <CircleAlert className="w-4 h-4 mr-2" />}
                  {filter === 'type' && <ListChecks className="w-4 h-4 mr-2" />}
                  {filter === 'customer' && <UserRoundSearch className="w-4 h-4 mr-2" />}
                  {filter === 'date' && <CalendarDays className="w-4 h-4 mr-2" />}
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2">
              <button
                onClick={handleBackClick}
                className="w-full px-4 py-2 mb-2 text-left hover:bg-gray-100 rounded flex items-center"
              >
                <span className="mr-2">←</span>
                {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
              </button>
              
              {selectedFilter === 'date' ? (
                <div className="border-t pt-2">
                  {!showDatePicker ? (
                    <>
                      {filterOptions.date.map(option => (
                        <button
                          key={option}
                          onClick={() => handleDateClick(option)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded"
                        >
                          {option}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div>
                      <div className="p-2">
                        <label className="block mb-1">Start Date</label>
                        <input
                          type="date"
                          onChange={(e) => handleDateSelect(e, 'start')}
                          className="w-full p-2 border rounded"
                          value={startDate ? startDate.toISOString().split('T')[0] : ''}
                        />
                      </div>
                      <div className="p-2">
                        <label className="block mb-1">End Date</label>
                        <input
                          type="date"
                          onChange={(e) => handleDateSelect(e, 'end')}
                          className="w-full p-2 border rounded"
                          value={endDate ? endDate.toISOString().split('T')[0] : ''}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t pt-2">
                  {filterOptions[selectedFilter].map((option: string) => (
                    <label
                      key={option}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      <input
                        type="checkbox"

                        className="mr-2 accent-purple-900"
                        checked={(filters[selectedFilter] || []).includes(option)}
                        onChange={() => handleOptionToggle(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableFilter;