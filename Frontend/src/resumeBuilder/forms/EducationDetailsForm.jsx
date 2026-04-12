import React from "react";
import { Input } from "../components/Inputs";
import { Plus, Trash2 } from "lucide-react";

export const EducationDetailsForm = ({
  educationInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className="p-8 bg-gradient-to-br from-white to-blue-50">
      <h2 className="text-2xl font-black text-slate-900 mb-8">Education</h2>

      <div className="space-y-6 mb-6">
        {educationInfo.map((edu, index) => (
          <div
            key={index}
            className="relative bg-white border border-blue-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800">
                Education {index + 1}
              </h3>

              {educationInfo.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Degree / Program"
                placeholder="BSc Computer Science"
                value={edu.degree || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "degree", target.value)
                }
              />

              <Input
                label="Institution"
                placeholder="ABC College"
                value={edu.institution || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "institution", target.value)
                }
              />

              <Input
                label="Start Date"
                type="month"
                value={edu.startDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "startDate", target.value)
                }
              />

              <Input
                label="End Date"
                type="month"
                value={edu.endDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "endDate", target.value)
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            addArrayItem({
              degree: "",
              institution: "",
              startDate: "",
              endDate: "",
            })
          }
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0066FF] text-white hover:bg-blue-700 font-semibold transition shadow"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>
    </div>
  );
};

export default EducationDetailsForm;