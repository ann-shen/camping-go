import { useState } from "react";
import { DateRange } from "react-date-range";

function MyComponent () {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSelect = (ranges)=>{
    console.log(ranges);
    setStartDate(ranges.selection.startDate)
    setEndDate(ranges.selection.endDate)
  }

    const selectionRange = {
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    };
    return (
      <DateRange
        ranges={[selectionRange]}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
      />
    );
  
}

export default MyComponent
