import React, { useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  placeholder?: string;
};

const Select: React.FC<SelectProps> = ({ options, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="select-container">
      <div className="select-input">
        <input
          type="text"
          placeholder={placeholder || "Select..."}
          value={selectedOption ? selectedOption.label : searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <ul className="options-list">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelectOption(option)}
              className="option-item"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .select-container {
          position: relative;
          width: 200px;
        }
        .select-input input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .options-list {
          position: absolute;
          top: 100%;
          width: 100%;
          background-color: white;
          border: 1px solid #ccc;
          max-height: 150px;
          overflow-y: auto;
          z-index: 10;
        }
        .option-item {
          padding: 8px;
          cursor: pointer;
        }
        .option-item:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Select;
