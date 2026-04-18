import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Edit,
  Camera,
  Trash2,
  Check,
  CalendarIcon,
} from "lucide-react";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const Input = ({
  value,
  onChange,
  label,
  placeholder,
  type = "text",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4 group">
      {label && (
        <label className="block text-sm font-bold text-gray-800 mb-2 group-focus-within:text-[#0066FF] transition-colors">
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center bg-gray-50 border-2 px-3 py-2.5 rounded-xl transition-all duration-300 ${
          isFocused
            ? "border-[#0066FF] ring-4 ring-blue-100 shadow-md shadow-blue-100"
            : "border-gray-300 hover:border-blue-300"
        }`}
      >
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium text-sm"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-[#0066FF] transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export const MonthPickerInput = ({
  value,
  onChange,
  label,
  placeholder = "Select month",
}) => {
  const [open, setOpen] = useState(false);

  const parsedDate = value ? parse(value, "yyyy-MM", new Date()) : undefined;

  const handleSelect = (selectedDate) => {
    if (!selectedDate) return;
    const formattedValue = format(selectedDate, "yyyy-MM");
    onChange({ target: { value: formattedValue } });
    setOpen(false);
  };

  return (
    <div className="mb-4 group">
      {label && (
        <label className="block text-sm font-bold text-gray-800 mb-2 group-focus-within:text-[#0066FF] transition-colors">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full flex items-center justify-between bg-gray-50 border-2 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
              open
                ? "border-[#0066FF] ring-4 ring-blue-100 shadow-md shadow-blue-100"
                : "border-gray-300 hover:border-blue-300"
            }`}
          >
            <span className={parsedDate ? "text-gray-800 font-medium" : "text-gray-500 font-medium"}>
              {parsedDate ? format(parsedDate, "MMM yyyy") : placeholder}
            </span>
            <CalendarIcon size={18} className="text-gray-500 shrink-0" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-2">
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={handleSelect}
            captionLayout="dropdown"
            fromYear={1980}
            toYear={2035}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(preview || null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (preview) setPreviewUrl(preview);
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreview?.(url);
    }
  };

  const handleRemove = () => {
    setImage(null);
    setPreviewUrl(null);
    setPreview?.(null);
  };

  const chooseFile = () => inputRef.current.click();

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          className={`relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-full cursor-pointer transition-all duration-300 ${
            hovered ? "border-[#0066FF] bg-blue-50" : ""
          }`}
          onClick={chooseFile}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button
            type="button"
            className="absolute -bottom-2 -right-2 w-11 h-11 flex items-center justify-center bg-[#0066FF] hover:bg-blue-700 text-white rounded-full transition-all shadow-lg hover:scale-110"
          >
            <Camera size={18} />
          </button>
        </div>
      ) : (
        <div
          className="relative group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg transition-all duration-300 ${
              hovered ? "group-hover:border-blue-400" : ""
            }`}
            onClick={chooseFile}
          >
            <img
              src={previewUrl}
              alt="profile"
              className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-800 rounded-full hover:bg-blue-50 transition-all mr-2"
              onClick={chooseFile}
            >
              <Edit size={16} />
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
              onClick={handleRemove}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const TitleInput = ({ title, setTitle }) => {
  const [editing, setEditing] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex items-center gap-3 min-w-0">
      {editing ? (
        <>
          <input
            type="text"
            placeholder="Resume title"
            className={`text-lg sm:text-xl font-bold bg-transparent outline-none text-gray-800 border-b-2 pb-2 transition-all duration-300 min-w-0 w-full ${
              focused ? "border-[#0066FF]" : "border-gray-300"
            }`}
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
          />
          <button
            className="p-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white transition-all shrink-0"
            onClick={() => setEditing(false)}
          >
            <Check className="w-5 h-5" />
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{title}</h2>
          <button
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all group shrink-0"
            onClick={() => setEditing(true)}
          >
            <Edit className="w-5 h-5 text-gray-600 group-hover:text-[#0066FF] transition-colors" />
          </button>
        </>
      )}
    </div>
  );
};