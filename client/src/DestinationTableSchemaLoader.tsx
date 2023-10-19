import React, { FC, ChangeEvent, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { ColumnDetail } from "./types"; // Make sure the import path is correct

interface Props {
  onSchemaLoad: (schema: ColumnDetail[]) => void;
}

const DestinationTableSchemaLoader: FC<Props> = ({ onSchemaLoad }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading status

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleLoadSchema = useCallback(() => {
    if (file) {
      setIsLoading(true); // Set loading to true when starting to load the schema
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];

        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Ensure to cast it to any[] before mapping it to ColumnDetail
        const rows = jsonData as any[];
        const columns: ColumnDetail[] = rows.slice(1).map((row) => ({
          TableName: row[0],
          ColumnName: row[1],
          DataType: row[2],
          Length: row[3],
          IsKey: row[4],
          KeyType: row[5],
          IsNullAllowed: row[6],
        }));

        onSchemaLoad(columns);
        setIsLoading(false); // Set loading to false after loading the schema
      };
      reader.readAsBinaryString(file);
    }
  }, [file, onSchemaLoad]);

  return (
    <div className="mb-3">
      <label className="form-label">
        Upload Destination Table Schema Excel File:
      </label>
      <input
        type="file"
        className="form-control"
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
      />
      {file && <p className="mt-2">File Uploaded: {file.name}</p>}
      <button onClick={handleLoadSchema} disabled={isLoading}>
        {" "}
        {/* Disable the button when loading */}
        {isLoading ? "Loading..." : "Load Destination Schema"}{" "}
        {/* Show loading text when loading */}
      </button>
    </div>
  );
};

export default DestinationTableSchemaLoader;
