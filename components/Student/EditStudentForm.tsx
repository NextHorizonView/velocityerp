"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import {
  fetchFormFields,
  FieldType,
  FormField,
  saveStudentData,
  fetchStudentDataById,
} from "../helper/firebaseHelper";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

interface EditStudentFormProps {
  studentid: string;
}
const EditStudentForm: React.FC<EditStudentFormProps> = ({ studentid }) => {
  console.log(studentid);
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  console.log(userId);

  const { data: fields = [], error } = useSWR<FormField[]>(
    userId ? `formFields-${userId}` : null,
    userId ? () => fetchFormFields(userId) : null,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (studentid) {
      const fetchStudentData = async () => {
        try {
          const studentData = await fetchStudentDataById(studentid); // Fetch data based on studentid
          console.log(studentData, "Fetched Student Data");

          setFormData(studentData);
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };

      fetchStudentData();
    }
  }, [studentid, fields]);

  if (!userId) {
    return <div>User not authenticated. Please log in.</div>;
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FormField) => {
    const { FormFields } = field;
    const router = useRouter();

    if (!FormFields || FormFields.length === 0) return null;

    return FormFields.map((f: FormField) => {
      const { FieldName, FieldType: type, Options } = f;

      const fieldKey = `${FieldName}-${type}`;

      switch (type) {
        case FieldType.RADIO:
          return (
            <div key={fieldKey} className=" p-4 rounded-md mb-4">
              <div className="flex  justify-between">
                <label className="text-xl text-gray-800">{FieldName}</label>
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
                <label className="text-xl">{FieldName}</label>
              </div>

              <select
                name={FieldName}
                value={formData[FieldName]}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-2 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
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
            <div key={fieldKey} className="p-4 rounded-md mb-4">
              <div className="flex justify-between">
                <label className="text-xl">{FieldName}</label>
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
    });
  };

  const handleSave = async () => {
    try {
      const studentDocRef = doc(db, "students", studentid.toString());
      await updateDoc(studentDocRef, formData);

      console.log("Student updated successfully!");

      mutate("students");
      router.push("/students");

      setFormData({});
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-sm rounded-lg">
      <div className="rounded-3xl bg-slate-700">
        <h2 className="text-3xl w-full flex items-center justify-center m-2 font-medium text-white py-4">
          Edit Student Details
        </h2>
      </div>

      <div>editng the information of student: {formData.Email} </div>

      <form>
        {fields?.map((field) => (
          <div
            key={field.FormFieldID}
            className="bg-gray-100 px-16 py-2 rounded-3xl my-2"
          >
            {renderField(field)}
          </div>
        ))}
      </form>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={handleSave}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditStudentForm;
