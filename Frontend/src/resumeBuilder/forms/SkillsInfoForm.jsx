import React from "react";
import { Input } from "../components/Inputs";
import { Plus, Trash2 } from "lucide-react";
import { commonStyles, skillsInfoStyles } from "../assets/dummystyle.js";

export const SkillsInfoForm = ({
  skillsInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className={skillsInfoStyles.container}>
      <h2 className={skillsInfoStyles.heading}>Skills</h2>

      <div className="space-y-4 mb-4">
        {skillsInfo.map((skill, index) => (
          <div
            key={index}
            className={`${skillsInfoStyles.item} gap-3 items-end`}
          >
            <div className="flex-1">
              <Input
                label="Skill Name"
                placeholder="JavaScript"
                value={skill.name || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "name", target.value)
                }
              />
            </div>

            {skillsInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            addArrayItem({
              name: "",
              progress: 0,
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066FF] text-white hover:bg-blue-700 font-semibold transition shadow text-sm"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>
    </div>
  );
};

export default SkillsInfoForm;