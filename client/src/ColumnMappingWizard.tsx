import React, { useState, FC } from "react";
import { ColumnDetail, Mapping } from "./types";

interface Props {
  sourceSchema: ColumnDetail[];
  destinationSchema: ColumnDetail[];
  onMappingComplete: (mappings: Mapping[]) => void;
}
const ColumnMappingWizard: FC<Props> = ({
  sourceSchema,
  destinationSchema,
  onMappingComplete,
}) => {
  const [selectedSourceColumn, setSelectedSourceColumn] =
    useState<ColumnDetail | null>(null);
  const [selectedDestinationColumn, setSelectedDestinationColumn] =
    useState<ColumnDetail | null>(null);
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const handleAddMapping = () => {
    if (selectedSourceColumn && selectedDestinationColumn) {
      setMappings((prev) => [
        ...prev,
        {
          source: selectedSourceColumn,
          destination: selectedDestinationColumn,
        },
      ]);
      setSelectedSourceColumn(null);
      setSelectedDestinationColumn(null);
    }
  };

  const handleRemoveMapping = (mapping: Mapping) => {
    setMappings((prev) => prev.filter((m) => m !== mapping));
  };

  const getMappedColumn = (column: ColumnDetail) => {
    const mapping = mappings.find(
      (m) => m.source === column || m.destination === column
    );
    if (mapping) {
      return mapping.source === column ? mapping.destination : mapping.source;
    }
    return null;
  };

  return (
    <div className="mapping-wizard">
      <div className="source-columns">
        <h5>Source Columns</h5>
        {sourceSchema.map((col, index) => {
          const mappedColumn = getMappedColumn(col);
          return (
            <div
              key={index}
              className={selectedSourceColumn === col ? "selected" : ""}
              onClick={() => setSelectedSourceColumn(col)}
            >
              {col.TableName}.{col.ColumnName}{" "}
              {mappedColumn &&
                `-> mapped to ${mappedColumn.TableName}.${mappedColumn.ColumnName}`}
            </div>
          );
        })}
      </div>

      <div className="destination-columns">
        <h5>Destination Columns</h5>
        {destinationSchema.map((col, index) => {
          const mappedColumn = getMappedColumn(col);
          return (
            <div
              key={index}
              className={selectedDestinationColumn === col ? "selected" : ""}
              onClick={() => setSelectedDestinationColumn(col)}
            >
              {col.TableName}.{col.ColumnName}{" "}
              {mappedColumn &&
                `-> mapped to ${mappedColumn.TableName}.${mappedColumn.ColumnName}`}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleAddMapping}
        disabled={!selectedSourceColumn || !selectedDestinationColumn}
      >
        Add Mapping
      </button>

      <div className="mappings">
        <h5>Mappings</h5>
        {mappings.map((mapping, index) => (
          <div key={index}>
            {mapping.source.TableName}.{mapping.source.ColumnName} {"->"}
            {mapping.destination.TableName}.{mapping.destination.ColumnName}
            <button onClick={() => handleRemoveMapping(mapping)}>Remove</button>
          </div>
        ))}
      </div>

      <button
        onClick={() => onMappingComplete(mappings)}
        disabled={mappings.length === 0}
      >
        Complete Mapping
      </button>
    </div>
  );
};

export default ColumnMappingWizard;
