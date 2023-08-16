import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Form, Button } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AddTutor() {
  const router = useRouter();
  const [tutorId, setTutorId] = useState("");
  const [tutorName, setTutorName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_URL}/tutors`, {
        tutorId,
        tutorName,
      });
      alert("Tutor added successfully");
      router.back();
    } catch (error) {
      console.log(error);
      alert("Error adding tutor");
    }
  };

  const cardStyle = {
    width: "25vw",
    backgroundColor: "white",
    color: "black",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    margin: "5vw auto",
    textAlign: "center",
    padding: "3vw",
  };

  const cardText = {
    fontSize: "2.5rem",
    fontWeight: "300",
    lineHeight: "1.2",
    color: "#333",
    marginBottom: "1rem",
    textAlign: "center",
  };

  const goHome = () => {
    router.push("/");
  };

  const goAdmin = () => {
    router.push("/login/admin");
  };

  const goTutor = () => {
    router.push("/login/tutor");
  };

  const goStudent = () => {
    router.push("/login/student");
  };

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand onClick={goHome}>TutorPlus</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={goAdmin}>Admin</Nav.Link>
            <Nav.Link onClick={goTutor}>Tutor</Nav.Link>
            <Nav.Link onClick={goStudent}>Student</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div style={cardStyle}>
        <Container style={cardText}>Add New Tutor</Container>
        <br />

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="tutorId">
            <Form.Label>Tutor ID:</Form.Label>
            <Form.Control
              type="text"
              value={tutorId}
              onChange={(event) => setTutorId(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="tutorName">
            <Form.Label>Tutor Name:</Form.Label>
            <Form.Control
              type="text"
              value={tutorName}
              onChange={(event) => setTutorName(event.target.value)}
            />
          </Form.Group>
          <br />
          <Button
            style={{ width: "15vw" }}
            variant="outline-secondary"
            type="submit"
          >
            Add Tutor
          </Button>
        </Form>
        <br />
        <Button
          style={{ width: "15vw" }}
          variant="outline-secondary"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
