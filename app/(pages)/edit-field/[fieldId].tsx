'use client';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetchFormFields, updateFormField } from "@/components/helper/firebaseHelper";

const EditFieldPage: React.FC = () => {
  const router = useRouter();
  const { fieldId } = router.query; // Get fieldId from the URL
  const [field, setField] = useState<any>(null);
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    // Ensure this only runs on the client-side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (fieldId && isClient) {
      fetchFormFields(localStorage.getItem("userId") || "").then((fields) => {
        const selectedField = fields.find((f) => f.FormFieldID === fieldId);
        setField(selectedField);
      });
    }
  }, [fieldId, isClient]);

  const handleSave = async () => {
    if (field && fieldId) {
      try {
        await updateFormField(fieldId as string, field.FieldName, field);
        router.push("/"); // Redirect to the homepage or desired page after saving
      } catch (error) {
        console.error("Error saving field:", error);
      }
    }
  };

  if (!field) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-sm rounded-lg">
      <h2 className="text-lg font-bold mb-4">Edit Field</h2>
      <input
        className="border p-2 w-full mb-4"
        value={field.FieldName}
        onChange={(e) => setField((prevField: any) => ({ ...prevField, FieldName: e.target.value }))}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default EditFieldPage;
