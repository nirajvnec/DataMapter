import React, { FC } from "react";

interface Props {
  mappings: { [key: string]: string };
  sourceTechnology: string;
  destinationTechnology: string;
}

const QueryBuilder: FC<Props> = ({
  mappings,
  sourceTechnology,
  destinationTechnology,
}) => {
  const sourceColumns = Object.keys(mappings).join(", ");
  const destinationColumns = Object.values(mappings).join(", ");

  const sourceSelectQuery = `SELECT ${sourceColumns} FROM [SourceTable];`; // Update with actual table name
  let destinationInsertQuery = "";

  if (destinationTechnology === "ORACLE") {
    destinationInsertQuery = `
            INSERT INTO DestinationTable (${destinationColumns})
            VALUES (:${Object.keys(mappings).join(", :")});
        `; // Update with actual table name and adjust placeholders accordingly
  }

  return (
    <div className="query-builder">
      {sourceTechnology === "MSSQL SERVER" && (
        <div>
          <h3>Source Select Query (MS SQL Server)</h3>
          <pre>{sourceSelectQuery}</pre>
        </div>
      )}

      {destinationTechnology === "ORACLE" && (
        <div>
          <h3>Destination Insert Query (Oracle)</h3>
          <pre>{destinationInsertQuery}</pre>
        </div>
      )}
    </div>
  );
};

export default QueryBuilder;
