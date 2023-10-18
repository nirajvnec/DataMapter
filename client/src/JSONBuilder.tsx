import React, { FC, useEffect } from "react";
import { DatabaseConfigType } from "./DatabaseConfig";
import { ColumnDetail, GenericMapping } from "./types";
import ReactJson from "react-json-view";

interface Props {
  mappings: GenericMapping<ColumnDetail>[];
  sourceConfig: DatabaseConfigType;
  destinationConfig: DatabaseConfigType;
  onQueriesGenerated: (queries: any) => void;
}

const JSONBuilder: FC<Props> = ({
  mappings,
  sourceConfig,
  destinationConfig,
  onQueriesGenerated,
}) => {
  useEffect(() => {
    console.log("Mappings in JSONBuilder: ", mappings);
  }, [mappings]);

  // Function to handle the review of the JSON document
  const handleReview = () => {
    // Combine the mappings, sourceConfig, and destinationConfig into a single object
    const reviewData = {
      mappings,
      sourceConfig,
      destinationConfig,
    };

    // Call the onQueriesGenerated prop with the reviewData object
    onQueriesGenerated(reviewData);
  };

  return (
    <div>
      <h2>Review the JSON</h2>

      {/* Use the ReactJson component to display the JSON data */}
      <ReactJson
        src={{
          mappings,
          sourceConfig,
          destinationConfig,
        }}
        theme="monokai"
        collapsed={false}
        collapseStringsAfterLength={15}
        displayDataTypes={false}
      />

      {/* Button to trigger the review of the JSON document */}
      <button onClick={handleReview}>Send for Review</button>
    </div>
  );
};

export default JSONBuilder;
