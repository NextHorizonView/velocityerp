"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { Edit as FaEdit, Trash2 as FaTrash } from "lucide-react";

import useSWR, { mutate } from "swr";
import {
  addFormFieldTeacher,
  fetchFormFieldsTeacher,
  deleteFormFieldTeacher,
  updateFormFieldTeacher,
  saveTeacherData,
} from "@/components/helper/firebaseHelper";
import {
  FormField,
  FieldType,
  FormData,
} from "@/components/helper/firebaseHelper";
import FadeLoader from "../Loader";

const TeacherForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  // const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>(FieldType.TEXT);
  const [newFieldOptions, setNewFieldOptions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if we're in edit mode

  // Define a type for allowed field names
  type FieldNameType =
    | "Email"
    | "Pincode"
    | "First Name"
    | "Last Name"
    | "Address"
    | "Phone"
    | string; // Add `string` if there are dynamic field names

  // Function to get placeholder text
  const getPlaceholder = (fieldName: FieldNameType): string => {
    const placeholders: Record<FieldNameType, string> = {
      Email: "Enter your email address",
      Pincode: "Enter your area pincode",
      "First Name": "Enter your first name",
      "Last Name": "Enter your last name",
      Address: "Enter your address",
      Phone: "Enter your phone number",
    };

    // Return the placeholder for the given fieldName or a default value
    return placeholders[fieldName] || "Enter your input";
  };

  const handleEditClick = (formFieldId: string, fieldName: string) => {
    const updatedLabel = prompt("Enter new label:", fieldName);
    if (updatedLabel) {
      handleUpdateField(formFieldId, fieldName, { FieldName: updatedLabel });
    }
  };
  // Simulate authentication
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const { data: fields = [], error } = useSWR<FormField[]>(
    userId ? `formFields-${userId}` : null,
    userId ? () => fetchFormFieldsTeacher(userId) : null,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (fields && fields.length > 0) {
      const initialFormData = fields.reduce(
        (acc: Record<string, string>, field) => {
          acc[field.FieldName] = field.DefaultValue || "";
          return acc;
        },
        {}
      );

      if (JSON.stringify(formData) !== JSON.stringify(initialFormData)) {
        setFormData(initialFormData);
      }
    } else {
      if (Object.keys(formData).length > 0) {
        setFormData({});
      }
    }
  }, [fields]);

  if (!userId) {
    return <div>User not authenticated. Please log in.</div>;
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddField = async () => {
    if (!newFieldName.trim() || !userId) return;

    setIsLoading(true);

    const newField: FormField = {
      FormFieldSchoolId: userId,
      FieldName: newFieldName,
      FieldType: newFieldType,
      IsRequired: true,
      Sequence: (fields?.length || 0) + 1,
      DefaultValue: "",
      CanChange: true,
      Options:
        newFieldType === FieldType.RADIO || newFieldType === FieldType.SELECT
          ? newFieldOptions.split(",").map((option) => option.trim())
          : undefined,
    };

    try {
      await addFormFieldTeacher(userId, newField);
      mutate(`formFields-${userId}`);
      setNewFieldName("");
      setNewFieldType(FieldType.TEXT);
      setNewFieldOptions("");
    } catch (error) {
      console.error("Error adding field:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateField = async (
    formFieldId: string,
    currentFieldName: string,
    updates: Partial<FormField>
  ) => {
    if (!userId || !formFieldId || !currentFieldName) return;

    setIsLoading(true);

    try {
      await updateFormFieldTeacher(formFieldId, currentFieldName, updates);
      mutate(`formFields-${userId}`);
      // setEditingFieldId(null);
    } catch (error) {
      console.error("Error updating field:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteField = async (formFieldId: string, fieldName: string) => {
    if (!userId || !formFieldId || !fieldName) return;

    setIsLoading(true);

    try {
      await deleteFormFieldTeacher(formFieldId, fieldName);
      mutate(`formFields-${userId}`);
    } catch (error) {
      console.error("Error deleting field:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    const { FormFields } = field;

    if (!FormFields || FormFields.length === 0) return null;

    return FormFields.map((f: FormField) => {
      const { FieldName, FieldType: type, Options } = f;

      const fieldKey = `${FieldName}-${type}`;

      switch (type) {
        case FieldType.RADIO:
          return (
            <div key={fieldKey} className=" p-4 rounded-md mb-4">
              <div className="flex  justify-between">
                <label className="block text-m font-medium text-[#576086] mb-2">
                  {FieldName}
                </label>
                <div className="flex space-x-4">
                  <FaTrash
                    className="cursor-pointer text-gray-800"
                    onClick={() =>
                      handleDeleteField(field.FormFieldID || "", FieldName)
                    }
                  />
                  <FaEdit
                    onClick={() =>
                      handleEditClick(field.FormFieldID || "", FieldName)
                    }
                    className="cursor-pointer text-gray-800"
                  />
                </div>
              </div>

              {Options?.map((option: string) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={FieldName}
                    value={option}
                    checked={formData[FieldName] === option}
                    onChange={handleChange}
                    className="h-4 w-4 text-gray-600 bg-white border-gray-300 rounded-full focus:ring-0 focus:ring-gray-500 focus:outline-none"
                  />
                  <span className="text-sm text-gray-600 select-none">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          );
        case FieldType.SELECT:
          return (
            <div key={fieldKey} className="p-4 rounded-md mb-4">
              <div className="flex justify-between">
                <label className="text-m text-[#576086]">{FieldName}</label>
                <div className="flex space-x-4">
                  {FieldName === "City" || FieldName === "State" ? (
                    <></>
                  ) : (
                    <>
                      <FaTrash
                        className="cursor-pointer text-gray-800"
                        onClick={() =>
                          handleDeleteField(field.FormFieldID || "", FieldName)
                        }
                      />
                      <FaEdit
                        onClick={() =>
                          handleEditClick(field.FormFieldID || "", FieldName)
                        }
                        className="cursor-pointer text-gray-800"
                      />
                    </>
                  )}
                </div>
              </div>

              <select
                name={FieldName}
                value={formData[FieldName]}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 border border-[#CCCCCC] rounded-md focus:ring-[#576086] focus:outline-none"
              >
                <option value="">Select...</option>
                {Options?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        case FieldType.DATE:
          return (
            <div key={fieldKey} className=" p-4 rounded-md mb-4">
              <div className="flex justify-between">
                <label className="text-m text-[#576086]">{FieldName}</label>
                {isEditMode ? (
                  <>
                    <FaTrash
                      className="cursor-pointer text-gray-800"
                      onClick={() =>
                        handleDeleteField(field.FormFieldID || "", FieldName)
                      }
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
              <input
                type="date"
                name={FieldName}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 border border-[#CCCCCC] rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          );
        default:
          return (
            <div key={fieldKey} className="p-4 rounded-md mb-4">
              <div className="flex justify-between">
                <label className="text-m text-[#576086]">{FieldName}</label>

                {FieldName === "Email" ||
                FieldName === "Pincode" ||
                FieldName === "First Name" ||
                FieldName === "Last Name" ? (
                  <></>
                ) : isEditMode ? (
                  <>
                    <div className="flex space-x-4">
                      <FaTrash
                        className="cursor-pointer text-gray-800"
                        onClick={() =>
                          handleDeleteField(field.FormFieldID || "", FieldName)
                        }
                      />
                      <FaEdit
                        onClick={() =>
                          handleEditClick(field.FormFieldID || "", FieldName)
                        }
                        className="cursor-pointer text-gray-800"
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <input
                name={FieldName}
                placeholder={getPlaceholder(FieldName)}
                value={formData[FieldName] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 border border-[#CCCCCC] rounded-md focus:ring-2 focus:ring-gray-700"
              />
            </div>
          );
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveTeacherData(formData);
      console.log(formData);
      setFormData({});
    } catch (error) {
      console.error("Error saving teacher data:", error);
      alert("Failed to save teacher data.");
    }
  };

  const handleEditFormToggle = () => {
    if (isEditMode) {
      setIsEditMode(false); // Save changes and stop editing
    } else {
      setIsEditMode(true); // Allow adding new fields
    }
  };

  if (!fields && !error)
    return (
      <p>
        <FadeLoader />
      </p>
    );
  if (error) return <p>Error loading fields</p>;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-[#FAFAF8] shadow-sm rounded-lg">
      <div className="rounded-3xl">
        <h2 className="text-3xl w-full flex items-center  justify-center m-2 font-semibold text-[#576086] py-4">
          Please enter teacher Details
        </h2>
      </div>

      <form>
        {fields?.map((field) => (
          <div
            key={field.FormFieldID}
            className="bg-[#FAFAF8] px-16 py-2 rounded-3xl my-2"
          >
            {renderField(field)}
          </div>
        ))}
      </form>

      {isEditMode && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl text-[#0A3749]">Add New Field</h2>
          <div className="mb-4">
            <input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Field Name"
            />
          </div>

          <div className="mb-4">
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as FieldType)}
              className="p-2 border rounded w-full"
            >
              <option value={FieldType.TEXT}>Text</option>
              <option value={FieldType.SELECT}>Select</option>
              <option value={FieldType.RADIO}>Radio</option>
              <option value={FieldType.DATE}>Date</option>
            </select>
          </div>

          <div className="mb-4">
            {newFieldType === FieldType.SELECT ||
            newFieldType === FieldType.RADIO ? (
              <input
                value={newFieldOptions}
                onChange={(e) => setNewFieldOptions(e.target.value)}
                type="text"
                className="p-2 border rounded w-full"
                placeholder="Options (comma separated)"
              />
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleAddField}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            {isLoading ? "Adding..." : "Add Field"}
          </button>
        </div>
      )}
      <div className="flex justify-between mx-20">
        <div className="mt-6 flex">
          <button
            type="button"
            onClick={handleEditFormToggle}
            className="bg-[#576086] text-white px-4 py-2 rounded"
          >
            {isEditMode ? "Save Changes" : "Edit Form"}
          </button>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#576086] text-white px-4 py-2 rounded"
            disabled={isEditMode}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
