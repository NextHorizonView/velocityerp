"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useSWR, { mutate } from "swr";
import {
  addFormField,
  fetchFormFields,
  deleteFormField,
  updateFormField,
  saveStudentData,
} from "@/components/helper/firebaseHelper";
import {
  FormField,
  FieldType,
  FormData,
} from "@/components/helper/firebaseHelper";

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>(FieldType.TEXT);
  const [newFieldOptions, setNewFieldOptions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if we're in edit mode

  // Simulate authentication
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  if (!userId) {
    return <div>User not authenticated. Please log in.</div>;
  }

  const { data: fields, error } = useSWR<FormField[]>(
    userId ? `formFields-${userId}` : null,
    () => fetchFormFields(userId),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (fields) {
      const initialFormData: FormData = {};
      fields.forEach((field) => {
        initialFormData[field.FieldName] = field.DefaultValue || "";
      });
      setFormData(initialFormData);
    }
  }, [fields]);

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
      CanChange: true,
      FormFieldSchoolId: userId,
      FieldName: newFieldName,
      FieldType: newFieldType,
      IsRequired: true,
      Sequence: (fields?.length || 0) + 1,
      DefaultValue: "",
      Options:
        newFieldType === FieldType.RADIO || newFieldType === FieldType.SELECT
          ? newFieldOptions.split(",").map((option) => option.trim())
          : undefined,
    };

    try {
      await addFormField(userId, newField);
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
      await updateFormField(formFieldId, currentFieldName, updates);
      mutate(`formFields-${userId}`);
      setEditingFieldId(null);
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
      await deleteFormField(formFieldId, fieldName);
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

    return FormFields.map((f: any) => {
      const { FieldName, FieldType: type, Options } = f;

      const fieldKey = `${FieldName}-${type}`;

      switch (type) {
        case FieldType.RADIO:
          return (
            <div key={fieldKey} className="border p-4 rounded-md mb-4">
              <label>{FieldName}</label>
              {Options?.map((option: any) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={FieldName}
                    value={option}
                    checked={formData[FieldName] === option}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-0"
                  />
                  <span className="text-sm text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          );
        case FieldType.SELECT:
          return (
            <div key={fieldKey} className="border p-4 rounded-md mb-4">
              <label>{FieldName}</label>
              <select
                name={FieldName}
                value={formData[FieldName]}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {Options?.map((option: any) => (
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
              <label>{FieldName}</label>
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
            <div key={fieldKey} className="border p-4 rounded-md mb-4">
              <label>{FieldName}</label>
              <input
                name={FieldName}
                value={formData[FieldName] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          );
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStudentData(formData);
      alert("Student data saved successfully!");
    } catch (error) {
      console.error("Error saving student data:", error);
      alert("Failed to save student data.");
    }
  };

  const handleEditFormToggle = () => {
    if (isEditMode) {
      setIsEditMode(false); // Save changes and stop editing
    } else {
      setIsEditMode(true); // Allow adding new fields
    }
  };

  const handleSaveChanges = () => {
    // Save any modifications to the existing fields
    // Call save or update methods for fields if necessary
    setIsEditMode(false); // Exit edit mode after saving
  };

  if (!fields && !error) return <p>Loading...</p>;
  if (error) return <p>Error loading fields</p>;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-sm rounded-lg">
      <div className="rounded-3xl" style={{ backgroundColor: "#576086" }}>
        <h2 className="text-3xl w-full flex items-center justify-center m-2 font-medium text-white py-4">
          Please enter Student Details
        </h2>
      </div>

      <form>
        {fields?.map((field) => (
          <div key={field.FormFieldID} className="bg-gray-200">
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

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={handleEditFormToggle}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          {isEditMode ? "Save Changes" : "Edit Form"}
        </button>
      </div>
    </div>
  );
};

export default StudentForm;
