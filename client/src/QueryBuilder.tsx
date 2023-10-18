import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

interface QueryBuilderProps {
  onSubmit: (query: string) => void;
}

interface JoinClause {
  joinTable: string;
  onCondition: string;
}

interface WhereClause {
  condition: string;
}

interface QuerySection {
  table: string;
  joinClauses: JoinClause[];
  whereClauses: WhereClause[];
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({ onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [querySections, setQuerySections] = useState<QuerySection[]>([
    {
      table: "",
      joinClauses: [{ joinTable: "", onCondition: "" }],
      whereClauses: [{ condition: "" }],
    },
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  useEffect(() => {
    const loadTables = () => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const workbook = XLSX.read(event.target!.result, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json<{ TableName: string }>(
            firstSheet
          );
          const uniqueTables = Array.from(
            new Set(data.map((item) => item.TableName))
          );
          setTables(uniqueTables);
        };
        reader.readAsBinaryString(file);
      }
    };

    loadTables();
  }, [file]);

  const handleAddJoinClause = (index: number) => {
    const updatedSections = [...querySections];
    updatedSections[index].joinClauses.push({ joinTable: "", onCondition: "" });
    setQuerySections(updatedSections);
  };

  const handleAddWhereClause = (index: number) => {
    const updatedSections = [...querySections];
    updatedSections[index].whereClauses.push({ condition: "" });
    setQuerySections(updatedSections);
  };

  const handleAddSection = () => {
    setQuerySections([
      ...querySections,
      {
        table: "",
        joinClauses: [{ joinTable: "", onCondition: "" }],
        whereClauses: [{ condition: "" }],
      },
    ]);
  };

  const handleQuerySubmission = () => {
    const query = querySections
      .map((section) => {
        const joinClausesString = section.joinClauses
          .map(
            (joinClause) =>
              `JOIN ${joinClause.joinTable} ON ${joinClause.onCondition}`
          )
          .join(" ");
        const whereClausesString = section.whereClauses
          .map((whereClause) => whereClause.condition)
          .join(" AND ");
        return `SELECT * FROM ${section.table} ${joinClausesString} WHERE ${whereClausesString}`;
      })
      .join("; ");

    onSubmit(query);
  };

  const handleRemoveJoinClause = (sectionIndex: number, joinIndex: number) => {
    const updatedSections = [...querySections];
    updatedSections[sectionIndex].joinClauses.splice(joinIndex, 1);
    setQuerySections(updatedSections);
  };

  const handleRemoveWhereClause = (
    sectionIndex: number,
    whereIndex: number
  ) => {
    const updatedSections = [...querySections];
    updatedSections[sectionIndex].whereClauses.splice(whereIndex, 1);
    setQuerySections(updatedSections);
  };

  return (
    <div className="container">
      <input type="file" onChange={handleFileChange} />
      {querySections.map((section, index) => (
        <div key={index} className="mb-3">
          <div className="mb-3">
            <label className="form-label">Table:</label>
            <select
              className="form-select"
              value={section.table}
              onChange={(e) => {
                const updatedSections = [...querySections];
                updatedSections[index].table = e.target.value;
                setQuerySections(updatedSections);
              }}
            >
              <option value="">Select a table</option>
              {tables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          {section.joinClauses.map((joinClause, joinIndex) => (
            <div key={joinIndex} className="mb-3">
              <label className="form-label">Join Table:</label>
              <select
                className="form-select"
                value={joinClause.joinTable}
                onChange={(e) => {
                  const updatedSections = [...querySections];
                  updatedSections[index].joinClauses[joinIndex].joinTable =
                    e.target.value;
                  setQuerySections(updatedSections);
                }}
              >
                <option value="">Select a join table</option>
                {tables.map((table) => (
                  <option key={table} value={table}>
                    {table}
                  </option>
                ))}
              </select>
              <label className="form-label">ON Condition:</label>
              <input
                type="text"
                className="form-control"
                value={joinClause.onCondition}
                onChange={(e) => {
                  const updatedSections = [...querySections];
                  updatedSections[index].joinClauses[joinIndex].onCondition =
                    e.target.value;
                  setQuerySections(updatedSections);
                }}
              />
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleRemoveJoinClause(index, joinIndex)}
              >
                Remove Join Clause
              </button>
            </div>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() => handleAddJoinClause(index)}
          >
            Add Join Clause
          </button>

          {section.whereClauses.map((whereClause, whereIndex) => (
            <div key={whereIndex} className="mb-3">
              <label className="form-label">WHERE Condition:</label>
              <input
                type="text"
                className="form-control"
                value={whereClause.condition}
                onChange={(e) => {
                  const updatedSections = [...querySections];
                  updatedSections[index].whereClauses[whereIndex].condition =
                    e.target.value;
                  setQuerySections(updatedSections);
                }}
              />
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleRemoveWhereClause(index, whereIndex)}
              >
                Remove Where Clause
              </button>
            </div>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() => handleAddWhereClause(index)}
          >
            Add WHERE Clause
          </button>
        </div>
      ))}
      <button className="btn btn-primary" onClick={handleAddSection}>
        Add Section
      </button>
      <button className="btn btn-success mt-3" onClick={handleQuerySubmission}>
        Submit Query
      </button>
    </div>
  );
};

export default QueryBuilder;
