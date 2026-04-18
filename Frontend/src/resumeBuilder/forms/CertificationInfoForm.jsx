import React from "react";
import { Input } from "../components/Inputs";
import { Plus, Trash2 } from "lucide-react";

export const CertificationInfoForm = ({
  certifications,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-5">
        Certifications
      </h2>

      <div className="space-y-4 mb-4">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="relative bg-white border border-blue-100 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                Certification {index + 1}
              </h3>

              {certifications.length > 1 && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition text-sm"
                  onClick={() => removeArrayItem(index)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Certificate Title"
                placeholder="Full Stack Web Developer"
                value={cert.title || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "title", target.value)
                }
              />

              <Input
                label="Issuer"
                placeholder="Coursera / Google / etc."
                value={cert.issuer || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "issuer", target.value)
                }
              />

              <Input
                label="Year"
                placeholder="2024"
                value={cert.year || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "year", target.value)
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            addArrayItem({
              title: "",
              issuer: "",
              year: "",
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066FF] text-white hover:bg-blue-700 font-semibold transition shadow text-sm"
        >
          <Plus size={16} />
          Add Certification
        </button>
      </div>
    </div>
  );
};

export default CertificationInfoForm;