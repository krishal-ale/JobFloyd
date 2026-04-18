import React, { useEffect, useRef, useState } from "react";
import { LuMail, LuPhone, LuGithub, LuGlobe } from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import {
  EducationInfo,
  WorkExperience,
  ProjectInfo,
  CertificationInfo,
} from "../components/ResumeSection";
import { formatYearMonth } from "../utils/helper";

const Title = ({ text, color = "#0d47a1" }) => (
  <div className="relative w-fit mb-2 resume-section-title">
    <h2
      className="relative text-base font-bold uppercase tracking-wide pb-2"
      style={{ color }}
    >
      {text}
    </h2>
    <div className="w-full h-[2px] mt-1" style={{ backgroundColor: color }} />
  </div>
);

const TemplateOne = ({ resumeData = {}, containerWidth }) => {
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
  const [baseWidth, setBaseWidth] = useState(800);
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
  const validInterests = interests.filter((item) => item?.trim());

  return (
    <div
      ref={resumeRef}
      className="p-6 bg-white font-sans text-gray-800 w-[800px] max-w-none"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: `${baseWidth}px`,
      }}
    >
      <div className="resume-section flex justify-between items-start mb-6 gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold pb-2 break-words">
            {profileInfo.fullName}
          </h1>
          <p className="text-lg font-medium pb-2 break-words">
            {profileInfo.designation}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {contactInfo.email && (
              <div className="flex items-center min-w-0">
                <LuMail className="mr-1 shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:underline break-all"
                >
                  {contactInfo.email}
                </a>
              </div>
            )}
            {contactInfo.phone && (
              <div className="flex items-center min-w-0">
                <LuPhone className="mr-1 shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
            )}
            {contactInfo.location && (
              <div className="flex items-center min-w-0">
                <span className="break-words">{contactInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end text-sm min-w-[140px]">
          {contactInfo.linkedin && (
            <div className="flex items-center mb-1">
              <RiLinkedinLine className="mr-1 shrink-0" />
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </div>
          )}
          {contactInfo.github && (
            <div className="flex items-center mb-1">
              <LuGithub className="mr-1 shrink-0" />
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </div>
          )}
          {contactInfo.website && (
            <div className="flex items-center">
              <LuGlobe className="mr-1 shrink-0" />
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Portfolio
              </a>
            </div>
          )}
        </div>
      </div>

      {profileInfo.summary && (
        <div className="resume-section mb-3">
          <Title text="Professional Summary" />
          <p className="text-sm leading-relaxed break-words">
            {profileInfo.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4 min-w-0">
          {workExperience.length > 0 && (
            <div className="resume-section min-w-0">
              <Title text="Work Experience" />
              <div className="space-y-5">
                {workExperience.map((exp, i) => (
                  <WorkExperience
                    key={i}
                    company={exp.company}
                    role={exp.role}
                    duration={`${formatYearMonth(exp.startDate)} - ${formatYearMonth(
                      exp.endDate
                    )}`}
                    description={exp.description}
                  />
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div className="resume-section min-w-0">
              <Title text="Projects" />
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <ProjectInfo
                    key={i}
                    title={proj.title}
                    description={proj.description}
                    githubLink={proj.github}
                    liveDemoUrl={proj.liveDemo}
                    headingClass="pb-2"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-5 min-w-0">
          {validSkills.length > 0 && (
            <div className="resume-section min-w-0">
              <Title text="Skills" />
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700 break-words">
                {validSkills.map((skill, i) => (
                  <li key={i} className="leading-relaxed break-words">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {education.length > 0 && (
            <div className="resume-section min-w-0">
              <Title text="Education" />
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <EducationInfo
                    key={i}
                    degree={edu.degree}
                    institution={edu.institution}
                    duration={`${formatYearMonth(edu.startDate)} - ${formatYearMonth(
                      edu.endDate
                    )}`}
                  />
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="resume-section min-w-0">
              <Title text="Certifications" />
              <div className="space-y-2">
                {certifications.map((cert, i) => (
                  <CertificationInfo
                    key={i}
                    title={cert.title}
                    issuer={cert.issuer}
                    year={cert.year}
                  />
                ))}
              </div>
            </div>
          )}

          {validLanguages.length > 0 && (
            <div className="resume-section min-w-0">
              <Title text="Languages" />
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700 break-words">
                {validLanguages.map((lang, i) => (
                  <li key={i} className="leading-relaxed break-words">
                    {lang.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validInterests.length > 0 && (
            <div className="resume-section min-w-0">
              <Title text="Interests" />
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700 break-words">
                {validInterests.map((interest, i) => (
                  <li key={i} className="leading-relaxed break-words">
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;