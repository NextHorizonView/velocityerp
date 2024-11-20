'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  education: string;
  skills: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  religion: string;
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

  const [extraFields, setExtraFields] = useState<string[]>([]);
  const [isEditingField, setIsEditingField] = useState(false);
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

  const handleCreateNewField = () => {
    setIsEditingField(true);
  };

  const handleConfirmNewField = () => {
    if (newFieldName.trim()) {
      setExtraFields((prev) => [...prev, newFieldName]);
      setFormData((prev) => ({
        ...prev,
        [newFieldName]: '',
      }));
      setNewFieldName('');
      setIsEditingField(false);
    }
  };

  return (
    <div className="w-[100vh] max-w-2xl mx-auto p-4">
      <div className="w-full bg-white shadow-sm overflow-hidden">
        <div className="rounded-2xl" style={{ backgroundColor: '#576086' }}>
          <h2 className="text-3xl w-full flex items-center justify-center font-medium text-white py-4">
            Please enter Student Details
          </h2>
        </div>

        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-9">
            <div className="flex gap-20">
              <div className="flex-1">
                <div className="relative border border-gray-300 rounded-md">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                    First name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative border border-gray-300 rounded-md">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="relative border border-gray-300 rounded-md">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                Education
              </label>
              <input
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
              />
            </div>

            <div className="relative border border-gray-300 rounded-md">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                Skills
              </label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
              />
            </div>

            <div className="relative border border-gray-300 rounded-md">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
              />
            </div>

            <div className="relative border border-gray-300 rounded-md">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="relative border border-gray-300 rounded-md">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
              />
            </div>

            <div className="relative border border-gray-300 rounded-md">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                Nationality
              </label>
              <input
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
              />
            </div>

            <div className="relative border border-gray-300 rounded-md">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                Religion
              </label>
              <input
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
              />
            </div>

            {extraFields.map((field) => (
              <div key={field} className="relative border border-gray-300 rounded-md">
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                  {field}
                </label>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                />
              </div>
            ))}

            {isEditingField && (
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
                  onClick={handleConfirmNewField}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Confirm Field
                </button>
              </div>
            )}

            {!isEditingField && (
              <button
                type="button"
                onClick={handleCreateNewField}
                className="w-full py-2 rounded-md text-white bg-blue-500 transition-colors"
              >
                + Create new Field
              </button>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-md text-black transition-colors"
              style={{
                backgroundColor: '#FFD4BA',
              }}
            >
              Click to proceed
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
