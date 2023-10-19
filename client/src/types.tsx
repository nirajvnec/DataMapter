import { DatabaseConfigType } from "./DatabaseConfig";

export interface ColumnDetail {
  TableName: string;
  ColumnName: string;
  DataType: string;
  Length: string;
  IsKey: string;
  KeyType: string;
  IsNullAllowed: string;
}

export interface GenericMapping<T> {
  // Added generic type parameter T
  source: T[];
  destination: T[];
}

export interface Mapping {
  // Added generic type parameter T
  source: ColumnDetail;
  destination: ColumnDetail;
}

export interface TransformedConfig {
  connection_details: {
    source?: DatabaseConfigType;
    target?: DatabaseConfigType;
  };
}
