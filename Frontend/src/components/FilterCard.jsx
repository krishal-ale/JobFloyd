import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Kathmandu",
      "Lalitpur",
      "Bhaktapur",
      "Pokhara",
      "Biratnagar",
      "Dharan",
      "Janakpur",
      "Rajbiraj",
      "Itahari",
    ],
  },
  {
    filterType: "Industry",
    array: [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "Mobile App Developer",
      "Data Scientist",
      "UI/UX Designer",
    ],
  },
  {
    filterType: "Salary",
    array: [
      "0-15k",
      "15k-30k",
      "30k-50k",
      "50k-75k",
      "75k-100k",
      "100k-150k",
      "150k-200k",
    ],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  const handleItemClick = (e, item) => {
    if (selectedValue === item) {
      e.preventDefault();
      setSelectedValue("");
      dispatch(setSearchJobByText(""));
    }
  };

  useEffect(() => {
    dispatch(setSearchJobByText(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <h1 className="font-bold text-lg text-gray-900 mb-1">Filter Jobs</h1>
      <p className="text-xs text-gray-400 mb-4">Narrow down your job search</p>
      <hr className="mb-4 border-gray-100" />

      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index} className="mb-5">
            <h2 className="font-semibold text-sm text-[#0066FF] uppercase tracking-wide mb-3">
              {data.filterType}
            </h2>

            {data.array.map((item, idx) => {
              const itemId = `r-${index}-${idx}`;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 my-2 cursor-pointer"
                  onClick={(e) => handleItemClick(e, item)}
                >
                  <RadioGroupItem
                    value={item}
                    id={itemId}
                    className="text-[#0066FF]"
                  />
                  <Label
                    htmlFor={itemId}
                    className="text-sm text-gray-600 cursor-pointer hover:text-[#0066FF] transition-colors"
                  >
                    {item}
                  </Label>
                </div>
              );
            })}

            {index < filterData.length - 1 && (
              <hr className="mt-4 border-gray-100" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;