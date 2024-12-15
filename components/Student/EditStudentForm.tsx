"use client";
import React, { ChangeEvent, useState } from "react";

const EditStudentForm: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const fields = [
    {
      FieldName: "First Name",
      FieldType: "text",
      Options: [],
    },
    {
      FieldName: "City",
      FieldType: "select",
      Options: ["New York", "Los Angeles", "Chicago"],
    },
    {
      FieldName: "Gender",
      FieldType: "radio",
      Options: ["Male", "Female", "Other"],
    },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderField = (field: { FieldName: string; FieldType: string; Options: string[] }) => {
    const { FieldName, FieldType: type, Options } = field;

    switch (type) {
      case "radio":
        return (
          <div className="p-4 rounded-md mb-4" key={FieldName}>
            <div className="flex justify-between">
              <label className="text-xl text-gray-800">{FieldName}</label>
              <div className="flex space-x-4">
               
              </div>
            </div>
            {Options.map((option: string) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={FieldName}
                  value={option}
                  checked={formData[FieldName] === option}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-600 bg-white border-gray-300 rounded-full focus:ring-0 focus:ring-gray-500 focus:outline-none"
                />
                <span className="text-sm text-gray-600 select-none">{option}</span>
              </label>
            ))}
          </div>
        );
      case "select":
        return (
          <div className="p-4 rounded-md mb-4" key={FieldName}>
            <div className="flex justify-between">
              <label className="text-xl">{FieldName}</label>
              <div className="flex space-x-4">
                
              </div>
            </div>
            <select
              name={FieldName}
              value={formData[FieldName] || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-2 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              {Options.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      case "date":
        return (
          <div className="p-4 rounded-md mb-4" key={FieldName}>
            <div className="flex justify-between">
              <label className="text-xl">{FieldName}</label>
              
            </div>
            <input
              type="date"
              name={FieldName}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-2 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      default:
        return (
          <div className="p-4 rounded-md mb-4" key={FieldName}>
            <div className="flex justify-between">
              <label className="text-xl">{FieldName}</label>
              <div className="flex space-x-4">
                
              </div>
            </div>
            <input
              name={FieldName}
              value={formData[FieldName] || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-2 border border-gray-900 rounded-md focus:ring-2 focus:ring-gray-700"
            />
          </div>
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    alert("Form submitted!");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-sm rounded-lg">
      <div className="rounded-3xl bg-slate-700">
        <h2 className="text-3xl w-full flex items-center justify-center m-2 font-medium text-white py-4">
          Edit Student Details
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => renderField(field))}
      </form>

      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="bg-slate-700 text-white px-4 py-2 rounded mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditStudentForm;
