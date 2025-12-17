import React, { useState } from "react";
import styles from "./style.module.scss";

interface SearchableSelectProps {
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  onSelect,
  placeholder = "Select...",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setQuery(value);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (selectedValue) {
      onSelect(selectedValue);
      alert(`Submitted: ${selectedValue}`);
    } else {
      alert("Please select a value before submitting");
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onClick={() => setIsOpen(true)}
        className={styles.input}
      />

      {isOpen && filteredOptions.length > 0 && (
        <ul className={styles.dropdown}>
          {filteredOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={styles.option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit
      </button>
    </div>
  );
};

export default SearchableSelect;
