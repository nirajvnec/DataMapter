import React, { useState, FC } from "react";
import * as XLSX from "xlsx";
import { ColumnDetail } from "./types";

interface Props {
  sourceSchema: ColumnDetail[];
  destinationSchema: ColumnDetail[];
  onJoinComplete: (joins: { [tableName: string]: string }) => void;
}

const JoinComponent: FC<Props> = ({
  sourceSchema,
  destinationSchema,
  onJoinComplete,
}) => {
  const [sourceTableData, setSourceTableData] = useState<ColumnDetail[]>([]);
  const [joins, setJoins] = useState<{ [tableName: string]: string }>({});

  const handleSourceFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: ColumnDetail[] = XLSX.utils.sheet_to_json(worksheet);
        setSourceTableData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleJoinChange = (tableName: string, columnName: string) => {
    setJoins((prevJoins) => ({ ...prevJoins, [tableName]: columnName }));
  };

  return (
    <div className="join-component">
      <h3>Upload Source DB Table File</h3>
      <input type="file" onChange={handleSourceFileChange} />

      <h3>Join Columns</h3>
      {sourceTableData.map((columnDetail, idx) => (
        <div key={idx}>
          <div>
            {columnDetail.TableName}.{columnDetail.ColumnName}
          </div>
          <select
            value={joins[columnDetail.TableName] || ""}
            onChange={(e) =>
              handleJoinChange(columnDetail.TableName, e.target.value)
            }
          >
            <option value="" disabled>
              Select destination column
            </option>
            {destinationSchema.map((destCol, destIdx) => (
              <option
                key={destIdx}
                value={`${destCol.TableName}.${destCol.ColumnName}`}
              >
                {destCol.TableName}.{destCol.ColumnName}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        onClick={() => {
          onJoinComplete(joins);
          console.log("source_join_clause_details:", joins);
        }}
      >
        Submit for Review
      </button>
    </div>
  );
};

export default JoinComponent;
