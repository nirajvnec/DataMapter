import React, { useState, ChangeEvent, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import * as XLSX from "xlsx";

interface Option {
  label: string;
  value: string;
}

interface Condition {
  column: string | null;
  operator: string | null;
  value: string;
}

const ExcelToJsonConverter = () => {
  const [sourceFile, setSourceFile] = useState<File>();
  const [destinationFile, setDestinationFile] = useState<File>();
  const [sourceColumns, setSourceColumns] = useState<Option[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([
    { column: null, operator: null, value: "" },
  ]);

  const readExcel = (
    file: File,
    setColumns: React.Dispatch<React.SetStateAction<Option[]>>
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const json = XLSX.utils.sheet_to_json<{
        TableName: string;
        ColumnName: string;
      }>(worksheet);

      const columns = json.map((row) => ({
        label: `${row.TableName}.${row.ColumnName}`,
        value: `${row.TableName}.${row.ColumnName}`,
      }));

      setColumns(columns);
    };

    reader.readAsBinaryString(file);
  };

  const handleWhereClause = () => {
    console.log("Conditions:", conditions);
  };

  const handleConditionChange = (
    index: number,
    field: keyof Condition,
    value: any
  ) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
  };

  return (
    <div>
      {/* Source File Upload */}
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSourceFile(file);
            readExcel(file, setSourceColumns);
          }
        }}
      />

      {/* Display Source Columns if available */}
      {sourceColumns.length > 0 && (
        <div>
          <h2>Source Columns</h2>
          <ul>
            {sourceColumns.map((col, index) => (
              <li key={index}>{col.label}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Condition Builder */}
      <div>
        <h2>Conditions</h2>
        {conditions.map((condition, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            {/* Column Selection */}
            <Typeahead
              id={`column-typeahead-${index}`}
              labelKey="label"
              options={sourceColumns.map((option) => option.label)} // Changed this line
              placeholder="Choose a column"
              onChange={(selected) => {
                if (selected[0]) {
                  handleConditionChange(index, "column", selected[0]); // Changed this line
                }
              }}
            />

            {/* Operator Selection */}
            <select
              value={condition.operator || ""}
              onChange={(e) =>
                handleConditionChange(index, "operator", e.target.value)
              }
            >
              <option value="" disabled>
                Select operator
              </option>
              <option value="=">=</option>
              <option value="!=">!=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
              <option value=">">&gt;</option>
              <option value=">=">&gt;=</option>
            </select>

            {/* Value Input */}
            <input
              type="text"
              value={condition.value}
              onChange={(e) =>
                handleConditionChange(index, "value", e.target.value)
              }
            />

            {/* Add more conditions */}
            {index === conditions.length - 1 && (
              <button
                onClick={() =>
                  setConditions([
                    ...conditions,
                    { column: null, operator: null, value: "" },
                  ])
                }
              >
                Add Condition
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Handle Where Clause Button */}
      <button onClick={handleWhereClause}>Apply Conditions</button>

      {/* Destination File Upload */}
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setDestinationFile(file);
          }
        }}
      />
    </div>
  );
};

export default ExcelToJsonConverter;
