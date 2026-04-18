import React from "react";
import TemplateOne from "../templates/TemplateOne";
import TemplateTwo from "../templates/TemplateTwo";
import TemplateThree from "../templates/TemplateThree";

const RenderResume = ({ templateId, resumeData, containerWidth }) => {
  switch (templateId) {
    case "01":
      return (
        <TemplateOne
          resumeData={resumeData}
          containerWidth={containerWidth}
        />
      );

    case "02": 
      return (
        <TemplateTwo
          resumeData={resumeData}
          containerWidth={containerWidth}
        />
      );

    case "03":
      return (
        <TemplateThree
          resumeData={resumeData}
          containerWidth={containerWidth}
        />
      );

    default:
      return (
        <TemplateThree
          resumeData={resumeData}
          containerWidth={containerWidth}
        />
      );
  }
};

export default RenderResume;