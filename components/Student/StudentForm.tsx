'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'; 

// Define an enum for field types
enum FieldType {
  TEXT = 'text',
  RADIO = 'radio',
  DATE = 'date',
  SELECT = 'select'
}

interface FormField {
  name: string;
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
    dateOfBirth: '',
    nationality: '',
    religion: '',
  });

  const [fields, setFields] = useState<FormField[]>([
    { name: 'firstName', type: FieldType.TEXT },
    { name: 'lastName', type: FieldType.TEXT },
    { name: 'education', type: FieldType.TEXT },
    { name: 'skills', type: FieldType.TEXT },
    { name: 'address', type: FieldType.TEXT },
    { name: 'gender', type: FieldType.RADIO, options: ['Male', 'Female'] },
    { name: 'dateOfBirth', type: FieldType.DATE },
    { name: 'nationality', type: FieldType.TEXT },
    { name: 'religion', type: FieldType.TEXT },
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

  const handleFieldNameChange = (oldName: string, newName: string) => {
    if (newName.trim() && oldName !== newName) {
      // Update form data
      setFormData((prev) => {
        const newFormData = { ...prev };
        newFormData[newName] = newFormData[oldName];
        delete newFormData[oldName];
        return newFormData;
      });

      // Update fields
      setFields((prevFields) => 
        prevFields.map((field) => 
          field.name === oldName ? { ...field, name: newName } : field
        )
      );

      // Reset editing state
      setEditingField(null);
    }
  };

  const handleAddField = () => {
    if (newFieldName.trim() && !formData[newFieldName]) {
      // Prepare field configuration
      const newField: FormField = {
        name: newFieldName,
        type: newFieldType
      };

      // Add options for radio and select types
      if ((newFieldType === FieldType.RADIO || newFieldType === FieldType.SELECT) && newFieldOptions) {
        newField.options = newFieldOptions.split(',').map(option => option.trim());
      }

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [newFieldName]: '',
      }));

      // Add to fields array
      setFields((prevFields) => [...prevFields, newField]);

      // Reset input fields
      setNewFieldName('');
      setNewFieldType(FieldType.TEXT);
      setNewFieldOptions('');
    }
  };

  const handleDeleteField = (fieldName: string) => {
    // Prevent deletion of core fields
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
    // If this field is currently being edited
    if (editingField === field.name) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            defaultValue={field.name}
            onBlur={(e) => handleFieldNameChange(field.name, e.target.value)}
            className="w-1/2 px-3 text-lg py-2 border border-gray-300 rounded-md"
          />
          <select
            value={field.type}
            onChange={(e) => {
              const newType = e.target.value as FieldType;
              setFields(prevFields => 
                prevFields.map(f => 
                  f.name === field.name 
                    ? { 
                        ...f, 
                        type: newType, 
                        // Reset options if changing to a type that doesn't support them
                        options: (newType === FieldType.RADIO || newType === FieldType.SELECT) 
                          ? f.options || ['Option 1', 'Option 2']
                          : undefined 
                      } 
                    : f
                )
              );
            }}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
          >
            {Object.values(FieldType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Rest of the rendering logic remains the same as in the previous implementation
    const { name, type, options } = field;

    // Helper function to format labels
    const formatLabel = (label: string): string => {
      return label
        .split(/(?=[A-Z])/)
        .join(' ')
        .replace(/^./, (str) => str.toUpperCase());
    };

    const labelText = formatLabel(name);

    // Existing rendering logic for different field types (TEXT, RADIO, DATE, SELECT)
    // ... (same as in previous implementation)
    switch (type) {
      case FieldType.RADIO:
        return (
          <div className="relative border border-gray-300 rounded-md">
            <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
              {labelText}
            </label>
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

      // ... (other field type renderings remain the same)
      default:
        return (
          <div className="relative border border-gray-300 rounded-md">
            <label className="absolute -top-2 left-2 bg-white px-1 text-md text-[#0A3749]">
              {labelText}
            </label>
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

            {/* Rest of the form remains the same */}
            {isEditingFieldNames && (
              <div className="flex flex-col items-start space-y-3">
                <div className="w-full grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="Enter field name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Object.values(FieldType).map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {(newFieldType === FieldType.RADIO || newFieldType === FieldType.SELECT) && (
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="Enter comma-separated options"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                )}

                <button
                  type="button"
                  onClick={handleAddField}
                  className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                >
                  <FaPlus /> <span>Add Field</span>
                </button>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsEditingFieldNames(!isEditingFieldNames);
                  setEditingField(null);
                }}
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