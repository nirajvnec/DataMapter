import React, { useState } from "react";
import "./App.css";
import DatabaseTechnologySelector from "./DatabaseTechnologySelector";
import SourceTableSchemaLoader from "./SourceTableSchemaLoader";
import ColumnMappingWizard from "./ColumnMappingWizard";
import QueryBuilder from "./QueryBuilder"; // Ensure you've created this component

function App() {
  const [step, setStep] = useState(1);
  const [sourceTechnology, setSourceTechnology] = useState<string>("");
  const [destinationTechnology, setDestinationTechnology] =
    useState<string>("");
  const [sourceSchema, setSourceSchema] = useState<any[]>([]);
  const [destinationSchema, setDestinationSchema] = useState<any[]>([]);
  const [mappings, setMappings] = useState<{ [key: string]: string }>({});

  const handleSourceTechnologySelect = (technology: string) => {
    setSourceTechnology(technology);
  };

  const handleDestinationTechnologySelect = (technology: string) => {
    setDestinationTechnology(technology);
  };

  const handleSourceSchemaLoad = (schema: any[]) => {
    setSourceSchema(schema);
  };

  const handleDestinationSchemaLoad = (schema: any[]) => {
    setDestinationSchema(schema);
  };

  const handleMappingComplete = (mappings: { [key: string]: string }) => {
    setMappings(mappings);
    setStep(4); // move to the next step to show the queries
  };

  return (
    <div className="App">
      {step === 1 && (
        <>
          <h2>Step 1: Select Database Technologies</h2>
          <DatabaseTechnologySelector
            label="Select Source Database Technology"
            onTechnologySelect={handleSourceTechnologySelect}
          />
          <DatabaseTechnologySelector
            label="Select Destination Database Technology"
            onTechnologySelect={handleDestinationTechnologySelect}
          />
          <button
            onClick={() => setStep(2)}
            disabled={!sourceTechnology || !destinationTechnology}
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Step 2: Load Table Schemas</h2>
          <h3>Source Table Schema</h3>
          <SourceTableSchemaLoader onSchemaLoad={handleSourceSchemaLoad} />
          <h3>Destination Table Schema</h3>
          <SourceTableSchemaLoader
            onSchemaLoad={handleDestinationSchemaLoad}
          />{" "}
          {/* Note: Ideally, this should be a separate component named DestinationTableSchemaLoader or similar */}
          <button
            onClick={() => setStep(3)}
            disabled={
              sourceSchema.length === 0 || destinationSchema.length === 0
            }
          >
            Next
          </button>
        </>
      )}

      {step === 3 &&
        sourceSchema.length > 0 &&
        destinationSchema.length > 0 && (
          <>
            <h2>Step 3: Column Mapping</h2>
            <ColumnMappingWizard
              sourceSchema={sourceSchema}
              destinationSchema={destinationSchema}
              onMappingComplete={handleMappingComplete}
            />
          </>
        )}

      {step === 4 && Object.keys(mappings).length > 0 && (
        <>
          <h2>Step 4: Review Generated Queries</h2>
          <QueryBuilder
            mappings={mappings}
            sourceTechnology={sourceTechnology}
            destinationTechnology={destinationTechnology}
          />
        </>
      )}
    </div>
  );
}

export default App;
