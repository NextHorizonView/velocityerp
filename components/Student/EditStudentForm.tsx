import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import useSWR from "swr";
import {
  addFormField,
  updateFormField,
  deleteFormField,
  fetchFormFields,
  saveStudentData,
} from "@/components/helper/firebaseHelper";

const EditStudentForm = () => {
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState(null); // Track the field being edited
  const [editedFieldName, setEditedFieldName] = useState(""); // Track the new name for the field
  const userId = localStorage.getItem("userId");

  const { data: fields = [], mutate } = useSWR(userId, fetchFormFields);

  useEffect(() => {
    const initialData = fields.reduce((acc, field) => {
      acc[field.FieldName] = "";
      return acc;
    }, {});
    setFormData(initialData);
  }, [fields]);

  const handleEditClick = (field) => {
    setEditingField(field.FormFieldID);
    setEditedFieldName(field.FieldName);
  };

  const handleEditSave = async (fieldId) => {
    if (!editedFieldName.trim()) {
      alert("Field name cannot be empty.");
      return;
    }

    try {
      await updateFormField(userId, fieldId, { FieldName: editedFieldName });
      setEditingField(null);
      mutate(); // Refresh the fields after updating
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      try {
        await deleteFormField(userId, fieldId);
        mutate(); // Refresh the fields after deletion
      } catch (error) {
        console.error("Error deleting field:", error);
      }
    }
  };

  const renderField = (field) => {
    if (editingField === field.FormFieldID) {
      return (
        <div className="flex items-center space-x-4" key={field.FormFieldID}>
          <input
            type="text"
            value={editedFieldName}
            onChange={(e) => setEditedFieldName(e.target.value)}
            className="border rounded p-2"
          />
          <button
            onClick={() => handleEditSave(field.FormFieldID)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setEditingField(null)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between" key={field.FormFieldID}>
        <div>
          <label className="font-semibold">{field.FieldName}</label>
          {/* Render field based on its type (RADIO, SELECT, etc.) */}
        </div>
        <div className="flex space-x-4">
          <FaEdit
            onClick={() => handleEditClick(field)}
            className="cursor-pointer text-gray-800"
          />
          <FaTrash
            onClick={() => handleDeleteField(field.FormFieldID)}
            className="cursor-pointer text-gray-800"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Student Form</h1>
      <div className="space-y-4">
        {fields.map((field) => renderField(field))}
      </div>
      <button
        onClick={() => saveStudentData(userId, formData)}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Data
      </button>
    </div>
  );
};

export default EditStudentForm;
