import React, { useState } from "react";
import "./App.css";
import DatabaseConfig, { DatabaseConfigType } from "./DatabaseConfig";
import SourceTableSchemaLoader from "./SourceTableSchemaLoader";
import ColumnMappingWizard from "./ColumnMappingWizard";
import JSONBuilder from "./JSONBuilder";
import { ColumnDetail, GenericMapping, Mapping } from "./types";
import QueryBuilder from "./QueryBuilder";
import ExcelToJsonConverter from "./ExcelToJsonConverter";
import JoinComponent from "./JoinComponent";

function App() {
  const [step, setStep] = useState(1);
  const [joinClauseDetails, setJoinClauseDetails] = useState<{
    [tableName: string]: string;
  }>({});
  const [sourceSchema, setSourceSchema] = useState<ColumnDetail[]>([]);
  const [destinationSchema, setDestinationSchema] = useState<ColumnDetail[]>(
    []
  );

  const [mappings, setMappings] = useState<GenericMapping<ColumnDetail>[]>([]);

  const [sourceConfig, setSourceConfig] = useState<DatabaseConfigType>({
    type: "",
    host: "",
    port: 0,
    user_name: "",
    password: "",
    dbname: "",
    connectionString: "",
  });

  const [destinationConfig, setDestinationConfig] =
    useState<DatabaseConfigType>({
      type: "",
      host: "",
      port: 0,
      user_name: "",
      password: "",
      dbname: "",
      connectionString: "",
    });

  const [queries, setQueries] = useState<any[]>([]);

  const handleConfigsSubmit = (
    sourceConfig: DatabaseConfigType,
    destinationConfig: DatabaseConfigType
  ) => {
    setSourceConfig(sourceConfig);
    setDestinationConfig(destinationConfig);
    setStep(2);
  };

  const [generatedQuery, setGeneratedQuery] = useState<string>(""); // New state for holding the generated query

  // ... (rest of your existing code)

  const handleQuerySubmit = (query: string) => {
    console.log("Generated Query:", query);
    setGeneratedQuery(query); // Save the generated query to the state
    setStep(5); // Proceed to the next step (if needed)
  };

  return (
    <div className="App">
      {step === 1 && (
        <>
          <h2>Step 1: Database Configuration</h2>
          <DatabaseConfig onConfigSubmit={handleConfigsSubmit} />
        </>
      )}
      {step === 2 && (
        <div className="container">
          <h2>Step 2: Load Table Schemas</h2>
          <div className="row mb-3">
            <div className="col">
              <SourceTableSchemaLoader
                onSchemaLoad={setSourceSchema}
                isSource={true}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <SourceTableSchemaLoader
                onSchemaLoad={setDestinationSchema}
                isSource={false}
              />
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <>
          <h2>Step 3: Column Mapping</h2>
          <ColumnMappingWizard
            sourceSchema={sourceSchema}
            destinationSchema={destinationSchema}
            onMappingComplete={(mappings: Mapping[]) =>
              setMappings(
                mappings.map((mapping) => ({
                  source: [mapping.source],
                  destination: [mapping.destination],
                }))
              )
            }
          />
          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={() => setStep(4)}>Next</button>
        </>
      )}

      {step === 4 && (
        <>
          <h2>Step 4: Review JSON Document</h2>
          <JSONBuilder
            mappings={mappings}
            sourceConfig={sourceConfig}
            destinationConfig={destinationConfig}
            onQueriesGenerated={setQueries}
          />
          <button onClick={() => setStep(3)}>Back</button>
          <button onClick={() => setStep(5)}>Next</button>
        </>
      )}
      {step === 5 && (
        <>
          <h2>Step 5: Create Query</h2>
          <QueryBuilder onSubmit={handleQuerySubmit} />
          <button onClick={() => setStep(4)}>Back</button>
          <button onClick={() => setStep(6)}>Next</button>{" "}
          {/* Updated this line */}
        </>
      )}

      {step === 6 && (
        <>
          <h2>Step 6: Convert Excel to JSON</h2>
          <ExcelToJsonConverter />
          <button onClick={() => setStep(5)}>Back</button>
          <button onClick={() => setStep(7)}>Next</button>{" "}
        </>
      )}

      {step === 7 && (
        <>
          <h2>Step 7: Join Tables</h2> // Changed step title to make it unique
          <JoinComponent
            sourceSchema={sourceSchema} // Passed actual sourceSchema state
            destinationSchema={destinationSchema} // Passed actual destinationSchema state
            onJoinComplete={(joins: { [tableName: string]: string }) => {
              console.log(joins); // Just logging the joins for now
            }}
          />
          <button onClick={() => setStep(6)}>Back</button> // Changed to go back
          to step 6
        </>
      )}
    </div>
  );
}

export default App;
