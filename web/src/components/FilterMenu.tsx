import { useState } from 'react';
import { Calendar } from 'lucide-react';

const TableFilter = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState('');
  const [dateComparison, setDateComparison] = useState('after'); // 'before' or 'after'
  const [selectedDate, setSelectedDate] = useState(null);

  const filterOptions = {
    importance: ['High', 'Medium', 'Low'],
    type: ["Sales", "Customer", "Research"],
    customer: ["Loom", "Ramp", "Brex", "Vanta", "Notion", "Linear", "OpenAI"],
    date: ['1day', '3days', '1week', '1month', '3months', 'custom']
  };

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
    if (option === 'custom') {
      setShowDatePicker(true);
    } else {
      const today = new Date();
      let targetDate = new Date();
      
      switch (option) {
        case '1day':
          targetDate.setDate(today.getDate() + 1);
          break;
        case '3days':
          targetDate.setDate(today.getDate() + 3);
          break;
        case '1week':
          targetDate.setDate(today.getDate() + 7);
          break;
        case '1month':
          targetDate.setMonth(today.getMonth() + 1);
          break;
        case '3months':
          targetDate.setMonth(today.getMonth() + 3);
          break;
        default:
          break;
      }

      setSelectedDate(targetDate);
      setDateRange(option);
      onFilterChange(prev => ({
        ...prev,
        date: {
          timeframe: option,
          comparison: dateComparison,
          date: targetDate.toISOString().split('T')[0]
        }
      }));
    }
  };

  const handleDateSelect = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
    onFilterChange(prev => ({
      ...prev,
      date: {
        timeframe: 'custom',
        comparison: dateComparison,
        date: date.toISOString().split('T')[0]
      }
    }));
  };

  const handleComparisonChange = (comparison) => {
    setDateComparison(comparison);
    if (selectedDate) {
      onFilterChange(prev => ({
        ...prev,
        date: {
          ...prev.date,
          comparison
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
        className="w-20 px-4 py-2 text-left border rounded-lg bg-white hover:bg-gray-50 flex items-center justify-between"
      >
        <span>Filter</span>
        {/* {filters.date && (
          <span className="text-sm text-gray-600">
            {dateComparison} {formatDate(filters.date.value)}
          </span>
        )} */}
      </button>
      <div>
        <span>
        {
          filters?.date?.comparison && "Due Date " + filters?.date?.comparison + " " + filters?.date?.date || filters?.date?.timeframe
        }
        </span>
        
      </div>

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
                  {filter === 'date' && <Calendar className="w-4 h-4 mr-2" />}
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
                      <div className="flex space-x-2 mb-4">
                        <button
                          onClick={() => handleComparisonChange('before')}
                          className={`px-3 py-1 rounded ${
                            dateComparison === 'before'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          Before
                        </button>
                        <button
                          onClick={() => handleComparisonChange('after')}
                          className={`px-3 py-1 rounded ${
                            dateComparison === 'after'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          After
                        </button>
                      </div>
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
                    <div className="p-2">
                      <input
                        type="date"
                        onChange={handleDateSelect}
                        className="w-full p-2 border rounded"
                        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                      />
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
                        className="mr-2"
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