import React, { FC, useEffect } from "react";
import { DatabaseConfigType } from "./DatabaseConfig";
import { ColumnDetail, GenericMapping } from "./types";
import ReactJson from "react-json-view";
import axios from "axios";
import config from "./config"; // Make sure to point to the correct path of your config file

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

  const handleReview = async () => {
    const reviewData = {
      mappings,
      sourceConfig,
      destinationConfig,
    };

    try {
      // Making a post request here, and then passing the response to the prop callback
      const response = await axios.post(
        config.reviewColumnMappingApiUrl,
        reviewData
      ); // Ensure apiUrl in config points to the correct endpoint
      console.log("Data posted successfully", response.data);
      onQueriesGenerated(response.data); // passing response to the prop callback
    } catch (error) {
      console.error("There was an error posting the data", error);
    }
  };

  return (
    <div>
      <h2>Review the JSON</h2>
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
      <button onClick={handleReview}>Send for Review</button>
    </div>
  );
};

export default JSONBuilder;
