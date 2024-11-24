import React, { useState } from 'react';

interface DropdownItemProps {
  children: React.ReactNode;
  onClick: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick }) => {
  return (
    <div
      className="hover:bg-gray-100 py-2 px-4 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode[];
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div onClick={handleToggle}>{trigger}</div>
      {isOpen && (
        <div
          className="absolute bg-white shadow-md py-2 w-48 mt-2"
          onClick={(e) => e.stopPropagation()} // Prevents closing on click inside
        >
          {children.map((child, index) => (
            <React.Fragment key={index}>{child}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export { Dropdown, DropdownItem };