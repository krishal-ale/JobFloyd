import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const normalizeUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const TemplateThree = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
    languages = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(1100);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualBaseWidth);
      if (containerWidth > 0) {
        setScale(containerWidth / actualBaseWidth);
      }
    }
  }, [containerWidth]);

  const groupedSkills = {
    "Automation & Test tools": [],
    "Product Management": [],
    Languages: [],
    "Other Skills": [],
  };

  skills.forEach((skill) => {
    if (!skill?.name?.trim()) return;

    if (["Selenium/Webdriver", "TestNG", "Jenkins"].includes(skill.name)) {
      groupedSkills["Automation & Test tools"].push(skill.name);
    } else if (
      ["Agile", "Scrum", "JIRA", "Microsoft TFS"].includes(skill.name)
    ) {
      groupedSkills["Product Management"].push(skill.name);
    } else if (
      ["Python", "Java", "Javascript", "Databases (MySQL)"].includes(skill.name)
    ) {
      groupedSkills.Languages.push(skill.name);
    } else {
      groupedSkills["Other Skills"].push(skill.name);
    }
  });

  return (
    <div
      ref={resumeRef}
      className="bg-white font-sans a4-wrapper text-black max-w-screen-lg mx-auto"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        height: "auto",
      }}
    >
      <header className="px-8 pt-8 pb-4 mb-2">
        <div className="text-center">
          <h1 className="text-3xl font-bold uppercase mb-3">
            {profileInfo.fullName}
          </h1>

          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {profileInfo.designation}
          </h2>
        </div>

        <p className="text-sm text-gray-700 leading-tight mb-4">
          {profileInfo.summary}
        </p>
      </header>

      <div className="grid grid-cols-12 gap-4 px-8 pb-8">
        <aside className="col-span-5 space-y-5 pr-4 border-r border-gray-300">
          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider">
              CONTACT
            </h2>
            <ul className="text-xs text-gray-700 space-y-2 pb-2">
              <li className="flex items-start">
                <span className="font-semibold min-w-[65px]">Location:</span>
                {contactInfo.location}
              </li>

              <li className="flex items-start">
                <span className="font-semibold min-w-[65px]">Phone:</span>
                {contactInfo.phone}
              </li>

              <li className="flex items-start">
                <span className="font-semibold min-w-[65px]">Email:</span>
                <span className="text-blue-600">{contactInfo.email}</span>
              </li>

              {contactInfo.linkedin && (
                <li className="flex items-start">
                  <span className="font-semibold min-w-[65px]">LinkedIn:</span>
                  <a
                    href={normalizeUrl(contactInfo.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline truncate pb-1"
                    title={contactInfo.linkedin}
                  >
                    linkedin.com/in/{contactInfo.linkedin.split("/").pop()}
                  </a>
                </li>
              )}

              {contactInfo.github && (
                <li className="flex items-start">
                  <span className="font-semibold min-w-[65px]">GitHub:</span>
                  <a
                    href={normalizeUrl(contactInfo.github)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline pb-2 truncate"
                    title={contactInfo.github}
                  >
                    github.com/{contactInfo.github.split("/").pop()}
                  </a>
                </li>
              )}

              {contactInfo.website && (
                <li className="flex items-start">
                  <span className="font-semibold min-w-[65px]">Portfolio:</span>
                  <a
                    href={normalizeUrl(contactInfo.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline pb-2 truncate"
                    title={contactInfo.website}
                  >
                    {contactInfo.website.replace(/(^\w+:|^)\/\//, "")}
                  </a>
                </li>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider">
              SKILLS
            </h2>
            {Object.entries(groupedSkills).map(
              ([category, skillsList]) =>
                skillsList.length > 0 && (
                  <div key={category} className="mb-2">
                    {category !== "Other Skills" && (
                      <h3 className="text-xs font-semibold italic mb-1">
                        {category}:
                      </h3>
                    )}
                    <ul className="text-xs text-gray-700">
                      {skillsList.map((skill, idx) => (
                        <li key={idx} className="mb-1">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </section>

          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <h3 className="font-bold pb-2">{edu.institution}</h3>
                    <p className="pb-1">{edu.degree}</p>
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-gray-500 italic">
                        {formatYearMonth(edu.startDate)} –{" "}
                        {formatYearMonth(edu.endDate)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider">
                CERTIFICATIONS
              </h2>
              <ul className="text-xs text-gray-700 space-y-1">
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    {cert.title}
                    {cert.year ? ` (${cert.year})` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {languages.length > 0 && languages.some((l) => l.name?.trim()) && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider">
                LANGUAGES
              </h2>

              <ul className="text-xs text-gray-700 space-y-1">
                {languages
                  .filter((l) => l.name?.trim())
                  .map((lang, idx) => (
                    <li key={idx}>• {lang.name}</li>
                  ))}
              </ul>
            </section>
          )}

          {interests.length > 0 && interests.some((i) => i?.trim()) && (
  <section>
    <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider">
      INTERESTS
    </h2>

    <ul className="text-xs text-gray-700 space-y-1">
      {interests
        .filter((i) => i?.trim())
        .map((interest, idx) => (
          <li key={idx}>• {interest}</li>
        ))}
    </ul>
  </section>
)}
        </aside>

        <main className="col-span-7 space-y-5 pl-4">
          {workExperience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider border-b border-gray-400 pb-1">
                WORK EXPERIENCE
              </h2>
              <div className="space-y-5">
                {workExperience.map((exp, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold pb-2">{exp.role}</h3>
                        <p className="italic">
                          {exp.company}
                          {exp.location && `, ${exp.location}`}
                        </p>
                      </div>

                      {exp.startDate && exp.endDate && (
                        <div className="text-right italic">
                          {formatYearMonth(exp.startDate)} –{" "}
                          {formatYearMonth(exp.endDate)}
                        </div>
                      )}
                    </div>

                    <ul className="list-disc list-inside space-y-1 mt-1 pl-1">
                      {exp.description
                        ?.split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider border-b border-gray-400 pb-1">
                PROJECTS
              </h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{proj.title}</h3>
                    </div>

                    <p className="mt-1 mb-1">{proj.description}</p>

                    <div className="flex flex-wrap gap-3 mt-1">
                      {proj.github && (
                        <a
                          href={normalizeUrl(proj.github)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          GitHub
                        </a>
                      )}

                      {proj.liveDemo && (
                        <a
                          href={normalizeUrl(proj.liveDemo)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default TemplateThree;