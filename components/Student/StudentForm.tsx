'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaTrash } from 'react-icons/fa'; 

interface FormData {
  [key: string]: string;
}

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    education: '',
    skills: '',
    address: '',
    gender: '', // Updated field
    dateOfBirth: '', // Updated field
    nationality: '',
    religion: '',
  });

  const [fieldOrder, setFieldOrder] = useState<string[]>(Object.keys(formData)); // Maintain the field order
  const [isEditingFieldNames, setIsEditingFieldNames] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleFieldNameChange = (oldName: string, newName: string) => {
    if (newName.trim() && oldName !== newName) {
      setFormData((prev) => {
        const newFormData = { ...prev };
        newFormData[newName] = newFormData[oldName];
        delete newFormData[oldName];
        return newFormData;
      });

      setFieldOrder((prevOrder) =>
        prevOrder.map((field) => (field === oldName ? newName : field))
      );
    }
  };

  const handleAddField = () => {
    if (newFieldName.trim() && !formData[newFieldName]) {
      setFormData((prev) => ({
        ...prev,
        [newFieldName]: '',
      }));

      setFieldOrder((prevOrder) => [...prevOrder, newFieldName]);
      setNewFieldName('');
    }
  };

  const handleDeleteField = (fieldName: string) => {
    setFormData((prev) => {
      const newFormData = { ...prev };
      delete newFormData[fieldName];
      return newFormData;
    });

    setFieldOrder((prevOrder) => prevOrder.filter((field) => field !== fieldName));
  };

  // Helper function to format labels by adding spaces
  const formatLabel = (label: string): string => {
    return label
      .split(/(?=[A-Z])/)
      .join(' ') // Insert spaces before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  return (
    <div className="w-[100vh] max-w-2xl mx-auto p-4">
      <div className="w-full bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="rounded-3xl" style={{ backgroundColor: '#576086' }}>
          <h2 className="text-3xl w-full flex items-center justify-center font-medium text-white py-4">
            Please enter Student Details
          </h2>
        </div>

        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-9">
            {fieldOrder.map((key) => {
              // Gender field as radio buttons
              if (key === 'gender') {
                return (
                  <div key={key} className="relative border border-gray-300 rounded-md">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
                      Gender
                    </label>
                    <div className="flex items-center space-x-4 px-3 pt-5 py-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === 'Male'}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-0"
                        />
                        <span className="text-sm text-gray-600">Male</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === 'Female'}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-0"
                        />
                        <span className="text-sm text-gray-600">Female</span>
                      </label>
                    </div>
                  </div>
                );
              }

              // Date of Birth field with calendar
              if (key === 'dateOfBirth') {
                return (
                  <div key={key} className="relative border border-gray-300 rounded-md">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pt-5  border-0 focus:ring-0 focus:outline-none"
                    />
                  </div>
                );
              }

              // Format the label text for other fields
              const labelText = formatLabel(key);

              return (
                <div key={key} className="relative border border-gray-300 rounded-md">
                  {isEditingFieldNames ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        defaultValue={key}
                        onBlur={(e) => handleFieldNameChange(key, e.target.value)}
                        className="w-1/2 px-3 text-lg py-2 border-0 focus:ring-0 focus:outline-none"
                      />
                      <input
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteField(key)}
                        className="text-black p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
                        {labelText}
                      </label>
                      <input
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                      />
                    </>
                  )}
                </div>
              );
            })}

            {isEditingFieldNames && (
              <div className="flex flex-col items-start space-y-3">
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Enter field name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddField}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Add Field
                </button>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsEditingFieldNames(!isEditingFieldNames)}
                className="py-2 w-1/2 rounded-md text-white bg-[#576086] transition-colors"
              >
                {isEditingFieldNames ? 'Save Fields' : 'Edit Fields'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md text-black transition-colors"
              style={{ backgroundColor: '#FFD4BA' }}
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
