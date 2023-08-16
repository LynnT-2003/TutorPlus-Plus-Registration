import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/legacy/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function updateSessionTimeById(_id, newSessionTime) {
  try {
    const response = await axios.get(API_URL);
    const sessions = response.data;

    const session = sessions.find((s) => s._id === _id);

    if (!session) {
      console.log(`Session with _id ${_id} not found.`);
      return;
    }

    const updatedSession = { ...session, sessionTime: newSessionTime };

    await axios.put(`${API_URL}/sessions/${_id}`, updatedSession);
    console.log(`Session with _id ${_id} updated successfully.`);
  } catch (error) {
    console.error("Error updating session:", error.message);
  }
}

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

export default function UpdateSession() {
  const router = useRouter();
  const { id } = router.query;
  const { register, handleSubmit } = useForm();

  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      if (!id) return;
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setSession(response.data);
      } catch (error) {
        console.error("Error fetching session:", error.message);
      }
    }

    fetchSession();
  }, [id]);

  const onSubmit = async (data) => {
    await updateSessionTimeById(id, data.newSessionTime);
    router.back();
  };

  if (!session) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div className="loading"></div>
      </div>
    );
  }

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

  const sessionTime = new Date(session.sessionTime);
  sessionTime.toLocaleString("en-US", { timeZone: "Asia/Bangkok" });

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

      <Container style={cardStyle}>
        <Container style={cardText}>Update Session Time</Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="sessionId">
            <Form.Label>Session ID</Form.Label>
            <Form.Control type="text" value={session.sessionId} readOnly />
          </Form.Group>
          <br />
          <Form.Group controlId="newSessionTime">
            <Form.Label>New Session Time</Form.Label>
            <Form.Control
              type="datetime-local"
              {...register("newSessionTime", { required: true })}
              defaultValue={sessionTime.toLocaleString("en-US", {
                timeZone: "Asia/Bangkok",
              })}
            />
          </Form.Group>
          <br />
          <Button
            variant="outline-primary"
            type="submit"
            style={{ width: "10vw", marginTop: "2em" }}
          >
            Update Time
          </Button>
        </Form>
        <br />
        <Button
          variant="outline-secondary"
          style={{ width: "10vw" }}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Container>
    </>
  );
}
