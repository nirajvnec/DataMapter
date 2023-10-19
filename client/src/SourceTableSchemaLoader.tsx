import React, { FC, useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { ColumnDetail } from "./types";

interface Props {
  onSchemaLoad: (schema: ColumnDetail[]) => void;
  isSource: boolean;
}

const SourceTableSchemaLoader: FC<Props> = ({ onSchemaLoad, isSource }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleLoadSchema = useCallback(() => {
    if (file) {
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
      };
      reader.readAsBinaryString(file);
    }
  }, [file, onSchemaLoad]);

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          Choose a file
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          onChange={handleFileUpload}
        />
      </div>
      <button className="btn btn-primary" onClick={handleLoadSchema}>
        Load {isSource ? "Source" : "Destination"} Schema
      </button>
    </div>
  );
};

export default SourceTableSchemaLoader;
