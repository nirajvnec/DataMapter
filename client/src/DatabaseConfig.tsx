import React, { FC, useState, ChangeEvent } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import config from "./config";

export interface DatabaseConfigType {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;
  connectionString: string; // Updated this line
}

interface DatabaseConfigProps {
  onConfigSubmit: (
    sourceConfig: DatabaseConfigType,
    destinationConfig: DatabaseConfigType
  ) => void;
}

const DatabaseConfigForm: FC<DatabaseConfigProps> = ({ onConfigSubmit }) => {
  const [sourceConfig, setSourceConfig] = useState<DatabaseConfigType>({
    type: "MSSQLSERVER",
    host: "GBM98124",
    port: 7000,
    username: "sa",
    password: "sa",
    databaseName: "CS",
    connectionString: "", // Updated this line
  });

  const [destinationConfig, setDestinationConfig] =
    useState<DatabaseConfigType>({
      type: "ORACLE",
      host: "GBM98125",
      port: 0,
      username: "8000",
      password: "sa",
      databaseName: "UBS",
      connectionString: "", // Updated this line
    });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isSource: boolean
  ) => {
    const { name, value } = e.target;
    const config = {
      ...(isSource ? sourceConfig : destinationConfig),
      [name]: name === "port" ? parseInt(value, 10) : value,
    };

    if (isSource) {
      setSourceConfig(config);
    } else {
      setDestinationConfig(config);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigSubmit(sourceConfig, destinationConfig);
  };
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleClose = () => setShowModal(false);

  const testConnection = async (
    databaseConfigType: DatabaseConfigType,
    type: string,
    url: string
  ) => {
    try {
      const response = await axios.post(url, databaseConfigType);
      if (response.data.success) {
        setModalMessage(`${type} DB Connection Successful!`);
      } else {
        setModalMessage(`Failed to connect to ${type} DB`);
      }
    } catch (error) {
      console.error(
        `There was an error testing the ${type} DB connection!`,
        error
      );
      setModalMessage(`Failed to connect to ${type} DB`);
    } finally {
      setShowModal(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row className="mb-3">
          <Col>
            <h3>Source Database Configuration</h3>
            {[
              "type",
              "host",
              "port",
              "username",
              "password",
              "databaseName",
              "connectionString", // Updated this line
            ].map((field, index) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                {field === "type" ? (
                  <Form.Select
                    name={field}
                    value={sourceConfig.type}
                    onChange={(e) => handleInputChange(e, true)}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="MSSQLSERVER">MSSQL SERVER</option>
                    <option value="ORACLE">ORACLE</option>
                    <option value="MYSQL">MYSQL</option>
                    <option value="POSTGRESQL">POSTGRESQL</option>
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field === "port" ? "number" : "text"}
                    name={field}
                    value={(sourceConfig as any)[field]}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        true
                      )
                    }
                    required
                  />
                )}
              </Form.Group>
            ))}
          </Col>
          <Col>
            <h3>Destination Database Configuration</h3>
            {[
              "type",
              "host",
              "port",
              "username",
              "password",
              "databaseName",
              "connectionString", // Updated this line
            ].map((field, index) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                {field === "type" ? (
                  <Form.Select
                    name={field}
                    value={destinationConfig.type}
                    onChange={(e) => handleInputChange(e, false)}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="MSSQLSERVER">MSSQL SERVER</option>
                    <option value="ORACLE">ORACLE</option>
                    <option value="MYSQL">MYSQL</option>
                    <option value="POSTGRESQL">POSTGRESQL</option>
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field === "port" ? "number" : "text"}
                    name={field}
                    value={(destinationConfig as any)[field]}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        false
                      )
                    }
                    required
                  />
                )}
              </Form.Group>
            ))}
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            testConnection(
              sourceConfig,
              "Source",
              config.sourceTestConnectionUrl
            )
          }
          style={{ marginLeft: "10px" }}
        >
          Test Source DB Connection
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            testConnection(
              destinationConfig,
              "Destination",
              config.sourceTestConnectionUrl
            )
          }
          style={{ marginLeft: "10px" }}
        >
          Test Destination DB Connection
        </Button>
      </Container>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connection Test Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
};

export default DatabaseConfigForm;
