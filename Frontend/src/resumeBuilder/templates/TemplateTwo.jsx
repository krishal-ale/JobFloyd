"use client";
import React, { useEffect, useRef, useState } from "react";
import { LuExternalLink, LuGithub } from "react-icons/lu";
import { formatYearMonth } from "../utils/helper";

const sectionTitleClass =
  "text-base font-bold uppercase tracking-wide mb-1 pb-1 border-b border-gray-300";

const TemplateTwo = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    languages = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(794);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualWidth);
      setScale(Math.min(containerWidth / actualWidth, 1));
    } else {
      setScale(1);
    }
  }, [containerWidth]);

  const validSkills = skills.filter((skill) => skill?.name?.trim());
  const validLanguages = languages.filter((lang) => lang?.name?.trim());
  const validInterests = interests.filter(Boolean);

  return (
    <div
      ref={resumeRef}
      className="resume-section p-4 bg-white font-sans text-black mx-auto w-[794px] max-w-none"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: `${baseWidth}px`,
        minHeight: "1123px",
        overflow: "hidden",
      }}
    >
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          {profileInfo.fullName}
        </h1>
        <p className="text-sm text-gray-600 font-medium mb-2">
          {profileInfo.designation}
        </p>
        <div className="flex flex-wrap justify-center gap-1 text-[11px] text-gray-700">
          {contactInfo.phone && <span>{contactInfo.phone}</span>}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="hover:underline text-blue-600 break-all"
            >
              {contactInfo.email}
            </a>
          )}
          {contactInfo.linkedin && (
            <a href={contactInfo.linkedin} className="hover:underline text-blue-600">
              LinkedIn
            </a>
          )}
          {contactInfo.github && (
            <a href={contactInfo.github} className="hover:underline text-blue-600">
              GitHub
            </a>
          )}
          {contactInfo.website && (
            <a href={contactInfo.website} className="hover:underline text-blue-600">
              Portfolio
            </a>
          )}
        </div>
      </div>

      <hr className="border-gray-300 mb-2" />

      {profileInfo.summary && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Summary</h2>
          <p className="text-[11px] text-gray-800 leading-tight break-words">
            {profileInfo.summary}
          </p>
        </section>
      )}

      {workExperience.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Experience</h2>
          <div className="space-y-2">
            {workExperience.map((exp, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[12px] pb-2 text-gray-800">
                      {exp.role}
                    </h3>
                    <p className="italic text-[11px] pb-2 text-gray-600">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-[11px] text-right text-gray-600 shrink-0">
                    <p className="italic">
                      {formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}
                    </p>
                    {exp.location && <p className="text-[11px]">{exp.location}</p>}
                  </div>
                </div>

                <ul className="mt-0.5 text-[12px] text-gray-700">
                  {exp.description?.split("\n").map((line, i) => (
                    <li key={i} className="pb-1 break-words">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Projects</h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-semibold text-[12px] text-gray-800">
                    {proj.title}
                  </h3>
                </div>

                <p className="text-[11px] pb-2 text-gray-700 break-words">
                  {proj.description}
                </p>

                <div className="flex gap-2 mt-0.5 pt-1 text-[11px]">
                  {proj.github && (
                    <a
                      href={proj.github}
                      className="flex items-center gap-1 hover:underline text-blue-600"
                    >
                      <LuGithub size={10} /> GitHub
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a
                      href={proj.liveDemo}
                      className="flex items-center gap-1 hover:underline text-blue-600"
                    >
                      <LuExternalLink size={10} /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Education</h2>
          <div className="space-y-1">
            {education.map((edu, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-center gap-3">
                  <h3 className="font-semibold text-[12px] pb-2 text-gray-800">
                    {edu.degree}
                  </h3>
                  <p className="italic text-[11px] pb-2 text-gray-600 shrink-0">
                    {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                  </p>
                </div>
                <p className="italic text-[11px] text-gray-700 break-words">
                  {edu.institution}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {validSkills.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Skills</h2>
          <ul className="list-disc pl-4 text-[11px] text-gray-800 space-y-1">
            {validSkills.map((skill, idx) => (
              <li key={idx} className="break-words leading-relaxed">
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Certifications</h2>
          <ul className="list-disc list-inside text-[11px] text-gray-700">
            {certifications.map((cert, idx) => (
              <li key={idx} className="leading-tight break-words">
                {cert.title} — {cert.issuer} ({cert.year})
              </li>
            ))}
          </ul>
        </section>
      )}

      {(validLanguages.length > 0 || validInterests.length > 0) && (
        <section className="mb-0">
          <div className="grid grid-cols-2 gap-2">
            {validLanguages.length > 0 && (
              <div>
                <h2 className={sectionTitleClass}>Languages</h2>
                <ul className="list-disc pl-4 text-[11px] text-gray-700 space-y-1">
                  {validLanguages.map((lang, idx) => (
                    <li key={idx} className="break-words">
                      {lang.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validInterests.length > 0 && (
              <div>
                <h2 className={sectionTitleClass}>Interests</h2>
                <ul className="list-disc pl-4 text-[11px] text-gray-700 space-y-1">
                  {validInterests.map((int, idx) => (
                    <li key={idx} className="break-words">
                      {int}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateTwo;