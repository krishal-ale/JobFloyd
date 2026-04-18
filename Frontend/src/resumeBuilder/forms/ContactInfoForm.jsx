import React from "react";
import { Input } from "../components/Inputs";
import { contactInfoStyles } from "../assets/dummystyle.js";

export const ContactInfoForm = ({ contactInfo, updateSection }) => {
  return (
    <div className={contactInfoStyles.container}>
      <h2 className={contactInfoStyles.heading}>Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          value={contactInfo.email || ""}
          onChange={({ target }) => updateSection("email", target.value)}
        />
        <Input
          label="Phone"
          value={contactInfo.phone || ""}
          onChange={({ target }) => updateSection("phone", target.value)}
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;