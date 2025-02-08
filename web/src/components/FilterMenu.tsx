import { useState } from 'react';
import { CalendarDays, UserRoundSearch, ListChecks, CircleAlert, ChevronDown, ChevronUp } from 'lucide-react';

const TableFilter = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  const filterOptions = {
    importance: ['High', 'Medium', 'Low'],
    type: ["Sales", "Customer", "Research"],
    customer: ["Loom", "Ramp", "Brex", "Vanta", "Notion", "Linear", "OpenAI"],
    date: ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Date Range'] };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setShowDatePicker(false);
  };

  const handleBackClick = () => {
    setSelectedFilter(null);
    setShowDatePicker(false);
  };

  const handleOptionToggle = (option) => {
    onFilterChange(prev => {
      const currentSelections = prev[selectedFilter] || [];
      const newSelections = currentSelections.includes(option)
        ? currentSelections.filter(item => item !== option)
        : [...currentSelections, option];
      
      return {
        ...prev,
        [selectedFilter]: newSelections
      };
    });
  };

  const handleDateClick = (option) => {
    if (option === 'Custom Date Range') {
      setShowDatePicker(true);
    } else {
      onFilterChange(prev => ({
        ...prev,
        date: {
          timeframe: option
        }
      }));
    }
  };

  const handleDateSelect = (e, type) => {
    const selectedDate = new Date(e.target.value);
    if (isNaN(selectedDate.getTime())) {
      return
    }

    if (type === 'start') {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }

    if (type === 'start' && endDate) {
      onFilterChange(prev => ({
        ...prev,
        date: {
          timeframe: 'Custom Date Range',
          startDate: selectedDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      }));
    } else if (type === 'end' && startDate) {
      onFilterChange(prev => ({
        ...prev,
        date: {
          timeframe: 'Custom Date Range',
          startDate: startDate.toISOString().split('T')[0],
          endDate: selectedDate.toISOString().split('T')[0]
        }
      }));
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
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
                  {filterOptions[selectedFilter].map(option => (
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