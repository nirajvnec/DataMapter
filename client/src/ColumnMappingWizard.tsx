import React, { FC, useState } from "react";

interface Props {
  sourceSchema: any[];
  destinationSchema: any[];
  onMappingComplete: (mappings: { [key: string]: string }) => void;
}

interface Mapping {
  source: string;
  destination: string;
}

const ColumnMappingWizard: FC<Props> = ({
  sourceSchema,
  destinationSchema,
  onMappingComplete,
}) => {
  const [sourceColumn, setSourceColumn] = useState<string>("");
  const [destinationColumn, setDestinationColumn] = useState<string>("");
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const addMapping = () => {
    if (sourceColumn && destinationColumn) {
      setMappings((prevMappings) => [
        ...prevMappings,
        { source: sourceColumn, destination: destinationColumn },
      ]);
      setSourceColumn("");
      setDestinationColumn("");
    }
  };

  return (
    <div className="mapping-wizard">
      <div className="source-columns">
        <h5>Source Columns</h5>
        <select
          value={sourceColumn}
          onChange={(e) => setSourceColumn(e.target.value)}
        >
          <option value="">Select Source Column</option>
          {sourceSchema.map((col, index) => (
            <option key={index} value={col["Column Name"]}>
              {col["Column Name"]}
            </option>
          ))}
        </select>
      </div>

      <div className="destination-columns">
        <h5>Destination Columns</h5>
        <select
          value={destinationColumn}
          onChange={(e) => setDestinationColumn(e.target.value)}
        >
          <option value="">Select Destination Column</option>
          {destinationSchema.map((col, index) => (
            <option key={index} value={col["Column Name"]}>
              {col["Column Name"]}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={addMapping}>
        Add Mapping
      </button>

      <div className="mappings">
        <h5>Mappings</h5>
        {mappings.map((mapping, index) => (
          <div key={index}>
            {mapping.source} {"->"} {mapping.destination}
          </div> // Updated this line
        ))}
      </div>

      {mappings.length > 0 && (
        <button
          className="btn btn-success mt-3"
          onClick={() =>
            onMappingComplete(
              Object.fromEntries(mappings.map((m) => [m.source, m.destination]))
            )
          }
        >
          Complete Mapping
        </button>
      )}
    </div>
  );
};

export default ColumnMappingWizard;
