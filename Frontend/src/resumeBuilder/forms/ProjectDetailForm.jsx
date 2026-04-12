import React from "react";
import { Input } from "../components/Inputs";
import { Plus, Trash2 } from "lucide-react";

export const ProjectDetailForm = ({
  projectInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className="p-8 bg-gradient-to-br from-white to-blue-50">
      <h2 className="text-2xl font-black text-slate-900 mb-8">Projects</h2>

      <div className="space-y-6 mb-6">
        {projectInfo.map((project, index) => (
          <div
            key={index}
            className="relative bg-white border border-blue-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800">
                Project {index + 1}
              </h3>

              {projectInfo.length > 1 && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition"
                  onClick={() => removeArrayItem(index)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Project Title"
                  placeholder="Portfolio Website"
                  value={project.title || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "title", target.value)
                  }
                />
              </div>

              

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Description
                </label>
                <textarea
                  placeholder="Short description about the project"
                  className="w-full p-4 bg-white border border-blue-200 rounded-xl focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
                  rows={3}
                  value={project.description || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "description", target.value)
                  }
                />
              </div>

              <Input
                label="GitHub Link"
                placeholder="https://github.com/username/project"
                value={project.github || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "github", target.value)
                }
              />

              <Input
                label="Live Demo URL"
                placeholder="https://yourproject.live"
                value={project.liveDemo || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "liveDemo", target.value)
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
  description: "",
  github: "",
  liveDemo: "",
})
          }
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0066FF] text-white hover:bg-blue-700 font-semibold transition shadow"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailForm;