export interface ColumnDetail {
  TableName: string;
  ColumnName: string;
  DataType: string;
  Length: string;
  IsKey: string;
  KeyType: string;
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
