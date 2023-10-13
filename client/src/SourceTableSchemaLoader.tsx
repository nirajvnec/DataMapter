import React, { FC, ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";

interface Props {
  onSchemaLoad: (schema: any[]) => void;
}

const SourceTableSchemaLoader: FC<Props> = ({ onSchemaLoad }) => {
  const [fileName, setFileName] = useState<string>("");
  const [schema, setSchema] = useState<any[]>([]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const sheetData = XLSX.utils.sheet_to_json(sheet);
      setSchema(sheetData);
      onSchemaLoad(sheetData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="mb-3">
      <label className="form-label">
        Upload Source Table Schema Excel File:
      </label>
      <input
        type="file"
        className="form-control"
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
      />
      {fileName && <p className="mt-2">File Uploaded: {fileName}</p>}

      {schema.length > 0 && (
        <table className="table mt-3">
          <thead>
            <tr>
              {Object.keys(schema[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schema.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {String(cell)}
                  </td> /* Updated this line */
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SourceTableSchemaLoader;
