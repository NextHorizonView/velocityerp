'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

// Define an enum for field types
enum FieldType {
  TEXT = 'text',
  RADIO = 'radio',
  DATE = 'date',
  SELECT = 'select',
}

interface FormField {
  name: string;
  label: string; // Added label property
  type: FieldType;
  options?: string[]; // For radio and select types
}

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
    gender: '',
    dateOfBirth: '', // Date field
    nationality: '',
    religion: '',
  });

  const [fields, setFields] = useState<FormField[]>([
    { name: 'firstName', label: 'First Name', type: FieldType.TEXT },
    { name: 'lastName', label: 'Last Name', type: FieldType.TEXT },
    { name: 'education', label: 'Education', type: FieldType.TEXT },
    { name: 'skills', label: 'Skills', type: FieldType.TEXT },
    { name: 'address', label: 'Address', type: FieldType.TEXT },
    { name: 'gender', label: 'Gender', type: FieldType.RADIO, options: ['Male', 'Female'] },
    { name: 'dateOfBirth', label: 'Date of Birth', type: FieldType.DATE }, // Calendar field
    { name: 'nationality', label: 'Nationality', type: FieldType.TEXT },
    { name: 'religion', label: 'Religion', type: FieldType.TEXT },
  ]);

  const [isEditingFieldNames, setIsEditingFieldNames] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>(FieldType.TEXT);
  const [newFieldOptions, setNewFieldOptions] = useState('');

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

  const handleFieldLabelChange = (fieldName: string, newLabel: string) => {
    if (newLabel.trim()) {
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.name === fieldName ? { ...field, label: newLabel } : field
        )
      );
      setEditingField(null);
    }
  };

  // const handleFieldNameChange = (oldName: string, newName: string) => {
  //   if (newName.trim() && oldName !== newName) {
  //     // Update form data
  //     setFormData((prev) => {
  //       const newFormData = { ...prev };
  //       newFormData[newName] = newFormData[oldName];
  //       delete newFormData[oldName];
  //       return newFormData;
  //     });

  //     // Update fields
  //     setFields((prevFields) =>
  //       prevFields.map((field) =>
  //         field.name === oldName ? { ...field, name: newName } : field
  //       )
  //     );

  //     setEditingField(null);
  //   }
  // };

  const handleAddField = () => {
    if (newFieldName.trim() && !formData[newFieldName]) {
      const newField: FormField = {
        name: newFieldName,
        label: newFieldName.charAt(0).toUpperCase() + newFieldName.slice(1), // Capitalize first letter
        type: newFieldType,
      };

      if ((newFieldType === FieldType.RADIO || newFieldType === FieldType.SELECT) && newFieldOptions) {
        newField.options = newFieldOptions.split(',').map((option) => option.trim());
      }

      setFormData((prev) => ({
        ...prev,
        [newFieldName]: '',
      }));

      setFields((prevFields) => [...prevFields, newField]);

      setNewFieldName('');
      setNewFieldType(FieldType.TEXT);
      setNewFieldOptions('');
    }
  };

  const handleDeleteField = (fieldName: string) => {
    if (['firstName', 'lastName'].includes(fieldName)) {
      return;
    }

    setFormData((prev) => {
      const newFormData = { ...prev };
      delete newFormData[fieldName];
      return newFormData;
    });

    setFields((prevFields) => prevFields.filter((field) => field.name !== fieldName));
  };

  const renderField = (field: FormField) => {
    const { name, label, type, options } = field;

    switch (type) {
      case FieldType.RADIO:
        return (
          <div className="relative border border-gray-300 rounded-md">
            {editingField === name ? (
              <input
                type="text"
                defaultValue={label}
                onBlur={(e) => handleFieldLabelChange(name, e.target.value)}
                className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749] w-32"
                autoFocus
              />
            ) : (
              <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
                {label}
              </label>
            )}
            <div className="flex items-center space-x-4 px-3 pt-5 py-2">
              {options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={name}
                    value={option}
                    checked={formData[name] === option}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-0"
                  />
                  <span className="text-sm text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case FieldType.DATE:
        return (
          <div className="relative border border-gray-300 rounded-md pt-2">
            {editingField === name ? (
              <input
                type="text"
                defaultValue={label}
                onBlur={(e) => handleFieldLabelChange(name, e.target.value)}
                className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749] w-32"
                autoFocus
              />
            ) : (
              <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
                {label}
              </label>
            )}
            <input
              type="date"
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 pt-2 border-0 focus:ring-0 focus:outline-none"
            />
          </div>
        );

      case FieldType.SELECT:
        return (
          <div className="relative border border-gray-300 rounded-md pt-2">
            {editingField === name ? (
              <input
                type="text"
                defaultValue={label}
                onBlur={(e) => handleFieldLabelChange(name, e.target.value)}
                className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749] w-32"
                autoFocus
              />
            ) : (
              <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
                {label}
              </label>
            )}
            <select
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
            >
              <option value="" disabled>
                -- Select an option --
              </option>
              {options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return (
          <div className="relative border border-gray-300 rounded-md pt-2">
            {editingField === name ? (
              <input
                type="text"
                defaultValue={label}
                onBlur={(e) => handleFieldLabelChange(name, e.target.value)}
                className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749] w-32"
                autoFocus
              />
            ) : (
              <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
                {label}
              </label>
            )}
            <input
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
            />
          </div>
        );
    }
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
            {fields.map((field) => (
              <div key={field.name} className="relative group">
                {renderField(field)}
                {isEditingFieldNames && (
                  <div className="absolute top-0 right-0 flex space-x-2">
                    {field.name !== 'firstName' && field.name !== 'lastName' && (
                      <>
                        {editingField === field.name ? (
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            className="text-green-500 p-2 hover:bg-green-100 rounded-full"
                            title="Save"
                          >
                            ✓
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingField(field.name)}
                            className="text-blue-500 p-2 hover:bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Edit Field"
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteField(field.name)}
                          className="text-black p-2 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          title="Delete Field"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isEditingFieldNames && (
              <div className="flex flex-col items-start space-y-3">
                <div className="w-full grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="Enter field name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none"
                  />
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none"
                  >
                    <option value={FieldType.TEXT}>Text</option>
                    <option value={FieldType.RADIO}>Radio</option>
                    <option value={FieldType.DATE}>Date</option>
                    <option value={FieldType.SELECT}>Select</option>
                  </select>
                </div>

                {(newFieldType === FieldType.RADIO || newFieldType === FieldType.SELECT) && (
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="Enter options (comma-separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none"
                  />
                )}

                <button
                  type="button"
                  onClick={handleAddField}
                  className="w-full py-2 bg-[#576086] text-white rounded-md"
                >
                  Add Field
                </button>
              </div>
            )}

            <div className="flex flex-col max-w-screen justify-center space-y-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsEditingFieldNames(!isEditingFieldNames);
                  setEditingField(null);
                }}
                className={`py-2 px-4 flex justify-center items-center space-x-2 rounded-md text-white transition-colors ${isEditingFieldNames ? 'bg-blue-500' : 'bg-gray-500'}`}
                style={{
                  backgroundColor: '#576086',
                }}
              >
                <FaEdit />
                <span>{isEditingFieldNames ? 'Save Changes' : 'Edit Fields'}</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Proceeding')} // Replace with your logic
                className="py-2 px-8 bg-[#F7B696] text-[#0A3749] font-semibold rounded-md text-lg hover:bg-[#f79e7b] transition-colors duration-200"
              >
                Click to proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;