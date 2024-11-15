import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { render } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
const MonthGrid = ({ selectedYear, onSelectMonth, onChangeYear }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <ChevronLeftIcon
          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
          onClick={() => onChangeYear(selectedYear - 1)}
        />
        <span className="text-sm font-medium">{selectedYear}</span>
        <ChevronRightIcon
          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
          onClick={() => onChangeYear(selectedYear + 1)}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => onSelectMonth(index)}
            className="px-2 py-1 text-sm rounded hover:bg-blue-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"

          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
};
export default function DateRangeSelector() {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [asOfDate, setAsOfDate] = useState(new Date());
  const [view, setView] = useState("date");
  const [isEnabled, setIsEnabled] = useState(true);
  const [rangeType, setRangeType] = useState("current");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const modalRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Utility function to check valid date
  const isValidDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      return true;
    }
    // Log the invalid date
    console.error("Invalid Date Value: ", date);
    return false;
  };

  // Handle date changes and ensure the date is valid
  const handleDateChange = (newDate) => {
    if (isValidDate(newDate)) {
      setSelectedDate(newDate); // Only update if the date is valid
    } else {
      console.error('Received invalid date:', newDate);
    }
  };

  // Format the selectedDate only if it's valid
  const formattedDate = isValidDate(selectedDate) ? format(selectedDate, 'yyyy-MM-dd') : 'Invalid Date';
  console.log('Formatted Date:', formattedDate);

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const getCurrentMonth = () => {
    const start = new Date();
    start.setDate(1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return [start, end];
  };
  const getNext30Days = () => {
    const start = new Date();
    const end = new Date(start.getTime());
    end.setDate(start.getDate() + 29);
    return [start, end];
  };
  const getNext60Days = () => {
    const start = new Date();
    const end = new Date(start.getTime());
    end.setDate(start.getDate() + 59);
    return [start, end];
  };
  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime()))
      return "Not selected";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };
  const formatDateRange = (start, end) => {
    if (
      !start ||
      !end ||
      !(start instanceof Date) ||
      !(end instanceof Date) ||
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    )
      return "";
    return `${start.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    })} - ${end.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    })}, ${end.getFullYear()}`;
  };
  const selectWeek = (startDate) => {
    if (!Array.isArray(startDate) || startDate.length < 2) {
      console.error("Expected an array with two dates, but received:", startDate);
      return;
    }
  
    const [start, end] = startDate;
  
    // Ensure that both start and end dates are valid Date objects
    if (!(start instanceof Date) || isNaN(start.getTime())) {
      console.error("Invalid start date:", start);
      return;
    }
  
    if (end !== null && (!(end instanceof Date) || isNaN(end.getTime()))) {
      console.error("Invalid end date:", end);
      return;
    }
  
    const correctedEndDate = new Date(start.getTime());
    correctedEndDate.setDate(start.getDate() + 6);
  
    // If the end date is invalid, we can set it based on the start date
    setDateRange([start, correctedEndDate]);
  };
  const selectMonth = (startDate) => {
    if (!startDate || isNaN(startDate.getTime())) return;
    const endDate = new Date(startDate.getTime());
    endDate.setDate(startDate.getDate() + 29);
    setDateRange([startDate, endDate]);
  };
  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">
            STAY DATES - AS OF {formatDate(new Date())}
          </span>
        </div>
        <div className="relative inline-block w-12 h-6">
          <input
            type="checkbox"
            id="date-toggle"
            className="sr-only"
            checked={isEnabled}
            onChange={() => setIsEnabled(!isEnabled)}
            aria-checked={isEnabled}
            role="switch"
            aria-label="Enable date selection"
          />
          <label
            htmlFor="date-toggle"
            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${isEnabled ? "bg-blue-500" : "bg-gray-300"} rounded-full transition-all duration-300 before:absolute before:h-5 before:w-5 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all before:duration-300 ${isEnabled ? "before:translate-x-6" : ""}`}
          >
            <span className="sr-only">Enable date selection</span>
          </label>
        </div>
      </div>

      {isEnabled ? (
        <div className="relative">
          <div
            className="flex items-center justify-between px-2 py-2 mb-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronLeftIcon
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                const newStart = new Date(startDate);
                const newEnd = new Date(endDate);
                if (view === "weeks") {
                  newStart.setDate(startDate.getDate() - 7);
                  newEnd.setDate(endDate.getDate() - 7);
                } else if (view === "months") {
                  newStart.setDate(startDate.getDate() - 30);
                  newEnd.setDate(endDate.getDate() - 30);
                } else {
                  newStart.setDate(startDate.getDate() - 1);
                  newEnd.setDate(endDate.getDate() - 1);
                }
                setDateRange([newStart, newEnd]);
              }}
            />
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {formatDateRange(startDate, endDate)}
              </span>
              <ChevronRightIcon
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
              />
            </div>
            <ChevronRightIcon
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                const newStart = new Date(startDate);
                const newEnd = new Date(endDate);
                if (view === "weeks") {
                  newStart.setDate(startDate.getDate() + 7);
                  newEnd.setDate(endDate.getDate() + 7);
                } else if (view === "months") {
                  newStart.setDate(startDate.getDate() + 30);
                  newEnd.setDate(endDate.getDate() + 30);
                } else {
                  newStart.setDate(startDate.getDate() + 1);
                  newEnd.setDate(endDate.getDate() + 1);
                }
                setDateRange([newStart, newEnd]);
              }}
            />
          </div>

          {isOpen && (
            <div
              ref={modalRef}
              className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50"
            >
              <div className="p-4">
                <div className="flex space-x-2 mb-4">
                  <button
                    className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none  ${view === "date" ? "bg-gray-200" : "bg-white"}`}
                    onClick={() => setView("date")}
                  >
                    Date
                  </button>
                  <button
                    className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none  ${view === "range" ? "bg-gray-200" : "bg-white"}`}
                    onClick={() => setView("range")}
                  >
                    Range
                  </button>
                  <button
                    className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none  ${view === "weeks" ? "bg-gray-200" : "bg-white"}`}
                    onClick={() => {
                      setView("weeks");
                      selectWeek(startDate || new Date());
                    }}
                  >
                    Weeks
                  </button>
                  <button
                    className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none  ${view === "months" ? "bg-gray-200" : "bg-white"}`}
                    onClick={() => {
                      setView("months");
                      const currentYear = new Date().getFullYear();
                      setSelectedYear(currentYear);
                    }}
                  >
                    Months
                  </button>
                </div>

                {view === "months" ? (
                  <MonthGrid
                    selectedYear={selectedYear}
                    onSelectMonth={(monthIndex) => {
                      const start = new Date(selectedYear, monthIndex, 1);
                      const end = new Date(selectedYear, monthIndex + 1, 0);
                      setDateRange([start, end]);
                    }}
                    onChangeYear={(year) => setSelectedYear(year)}
                  />
                ) : view === "range" ? (
                  <div className="space-y-4">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        if (rangeType === "custom") {
                          setDateRange([date, endDate]);
                        }
                      }}
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      monthsShown={1}
                      inline
                    />
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="current-month"
                          name="range-type"
                          value="current"
                          checked={rangeType === "current"}
                          onChange={(e) => {
                            setRangeType(e.target.value);
                            setDateRange(getCurrentMonth());
                          }}
                          className="text-blue-500 focus:ring-blue-400"
                        />
                        <label
                          htmlFor="current-month"
                          className="text-sm text-gray-600"
                        >
                          Current Month
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="next-30"
                          name="range-type"
                          value="next30"
                          checked={rangeType === "next30"}
                          onChange={(e) => {
                            setRangeType(e.target.value);
                            setDateRange(getNext30Days());
                          }}
                          className="text-blue-500 focus:ring-blue-400"
                        />
                        <label
                          htmlFor="next-30"
                          className="text-sm text-gray-600"
                        >
                          Next 30 Days
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="next-60"
                          name="range-type"
                          value="next60"
                          checked={rangeType === "next60"}
                          onChange={(e) => {
                            setRangeType(e.target.value);
                            setDateRange(getNext60Days());
                          }}
                          className="text-blue-500 focus:ring-blue-400"
                        />
                        <label
                          htmlFor="next-60"
                          className="text-sm text-gray-600"
                        >
                          Next 60 Days
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="custom"
                          name="range-type"
                          value="custom"
                          checked={rangeType === "custom"}
                          onChange={(e) => {
                            setRangeType(e.target.value);
                          }}
                          className="text-blue-500 focus:ring-blue-400"
                        />
                        <label
                          htmlFor="custom"
                          className="text-sm text-gray-600"
                        >
                          Custom Range
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      if (view === "weeks") {
                        selectWeek(date);
                      } else if (view === "months") {
                        selectMonth(date);
                      } else {
                        setDateRange([date, date]);
                      }
                    }}
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    monthsShown={1}
                    inline
                  />
                )}

                <div className="mt-4">
                  <button
                    className="w-full py-2 bg-blue-600  rounded hover:bg-blue-500 transition-colors text-white"
                    onClick={() => {
                      let message = "";
                      switch (view) {
                        case "date":
                          message = `Selected Date: ${formatDate(startDate)}`;
                          break;
                        case "weeks":
                          message = `Selected Week:\nFrom: ${formatDate(startDate)}\nTo: ${formatDate(endDate)}`;
                          break;
                        case "months":
                          message = `Selected Month Period:\nFrom: ${formatDate(startDate)}\nTo: ${formatDate(endDate)}`;
                          break;
                        case "range":
                          message = `Selected ${rangeType === "custom" ? "Custom" : rangeType === "current" ? "Current Month" : rangeType === "next30" ? "Next 30 Days" : "Next 60 Days"} Range:\nFrom: ${formatDate(startDate)}\nTo: ${formatDate(endDate)}`;
                          break;
                        default:
                          message = `Selected Range:\nFrom: ${formatDate(startDate)}\nTo: ${formatDate(endDate)}`;
                      }
                      alert(message);
                      setIsOpen(false);
                    }}
                  >
                    Apply Date Range
                  </button>
                </div>

                <div className="my-4 border-t border-gray-200"></div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      As Of Date
                    </label>
                    <DatePicker
                      selected={asOfDate}
                      onChange={(date) => setAsOfDate(date)}
                      className="w-full p-2 border rounded"
                      dateFormat="MM/dd/yyyy"
                    />
                  </div>

                  <button
                    className="w-full py-2 bg-blue-600  rounded hover:bg-blue-500 transition-colors text-white"
                    onClick={() => {
                      alert(`Selected As Of Date: ${formatDate(asOfDate)}`);
                    }}
                  >
                    Apply As Of Date
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          Toggle the switch to enable date selection
        </div>
      )}
    </div>
  );
}
export { DateRangeSelector };
