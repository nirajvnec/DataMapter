import React, { ChangeEvent, FC, useState } from "react";

interface Props {
  label: string;
  onTechnologySelect: (technology: string) => void;
}

const technologies = ["MSSQL SERVER", "ORACLE", "POSTGRESQL"];

const DatabaseTechnologySelector: FC<Props> = ({
  label,
  onTechnologySelect,
}) => {
  const [selectedTechnology, setSelectedTechnology] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const technology = event.target.value;
    setSelectedTechnology(technology);
    onTechnologySelect(technology);
  };

  return (
    <div className="mb-3">
      <label htmlFor="database-technology" className="form-label">
        {label}
      </label>
      <select
        id="database-technology"
        value={selectedTechnology}
        onChange={handleChange}
        className="form-select"
      >
        <option value="" disabled>
          Select technology
        </option>
        {technologies.map((tech) => (
          <option key={tech} value={tech}>
            {tech}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DatabaseTechnologySelector;
