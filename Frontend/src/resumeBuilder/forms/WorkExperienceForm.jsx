import React from "react";
import { Input, MonthPickerInput } from "../components/Inputs";
import { Plus, Trash2 } from "lucide-react";

export const WorkExperienceForm = ({
  workExperience,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-5">
        Work Experience
      </h2>

      <div className="space-y-4 mb-4">
        {workExperience.map((exp, index) => (
          <div
            key={index}
            className="relative bg-white border border-blue-100 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                Experience {index + 1}
              </h3>

              {workExperience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title / Role"
                placeholder="Frontend Developer"
                value={exp.role || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "role", target.value)
                }
              />

              <Input
                label="Company Name"
                placeholder="ABC Company"
                value={exp.company || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "company", target.value)
                }
              />

              <MonthPickerInput
                label="Start Date"
                value={exp.startDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "startDate", target.value)
                }
              />

              <MonthPickerInput
                label="End Date"
                value={exp.endDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "endDate", target.value)
                }
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Work Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe what you worked on..."
                  className="w-full p-3 bg-white border-2 border-blue-200 rounded-xl focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none min-h-[110px] text-sm"
                  value={exp.description || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "description", target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            addArrayItem({
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066FF] text-white hover:bg-blue-700 font-semibold transition shadow text-sm"
        >
          <Plus size={16} />
          Add Work Experience
        </button>
      </div>
    </div>
  );
};

export default WorkExperienceForm;