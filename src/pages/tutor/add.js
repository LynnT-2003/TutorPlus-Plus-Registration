import { useRouter } from "next/router";
import Image from "next/legacy/image";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AddSessionForm() {
  const router = useRouter();
  const { tutorId } = router.query;

  const [sessionId, setSessionId] = useState("");
  const [sessionTime, setSessionTime] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Make an API request to add the new session
    try {
      const response = await axios.post(`${API_URL}/sessions`, {
        sessionId,
        sessionTime,
        tutorId,
      });
      console.log(response.data);
      alert("Successfully added a new session");
      router.push(`/tutor?tutorId=${tutorId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to add a new session");
    }
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

  const cardStyle = {
    width: "30vw",
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
    marginBottom: "2rem",
  };

  return (
    <>
      <div className="BGandDiv">
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
      </div>

      <div style={cardStyle}>
        <Container style={cardText}>Add a New Session</Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="sessionId">
            <Form.Label>Session ID:</Form.Label>
            <Form.Control
              type="text"
              value={sessionId}
              onChange={(event) => setSessionId(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="sessionTime">
            <Form.Label>Session Time:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={sessionTime}
              onChange={(event) => setSessionTime(event.target.value)}
            />
          </Form.Group>
          <Button
            variant="outline-primary"
            style={{ marginBottom: "1em", marginTop: "2em" }}
            type="submit"
          >
            Add Session
          </Button>
        </Form>
      </div>
    </>
  );
}
