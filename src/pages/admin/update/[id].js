import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function updateTutorById(_id, tutorData) {
  try {
    await axios.put(`${API_URL}/tutors/${_id}`, tutorData);
    console.log(`Tutor with _id ${_id} updated successfully.`);
  } catch (error) {
    console.error("Error updating tutor:", error.message);
  }
}

export default function UpdateTutor() {
  const router = useRouter();
  const { id } = router.query;
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    async function fetchTutor() {
      if (!id) return;
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setTutor(response.data);
      } catch (error) {
        console.error("Error fetching tutor:", error.message);
      }
    }

    fetchTutor();
  }, [id]);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (tutor) {
      setValue("tutorId", tutor.tutorId);
      setValue("tutorName", tutor.tutorName);
    }
  }, [tutor]);

  const onSubmit = async (data) => {
    await updateTutorById(id, data);
    router.back();
  };

  if (!tutor) {
    return <div>Loading...</div>;
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
    marginBottom: "3rem",
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

      <Container style={cardStyle}>
        <Container style={cardText}>Update Tutor</Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="tutorId">
            <Form.Label>Tutor ID</Form.Label>
            <Form.Control type="text" {...register("tutorId")} readOnly />
          </Form.Group>
          <br />
          <Form.Group controlId="tutorName">
            <Form.Label>Tutor Name</Form.Label>
            <Form.Control type="text" {...register("tutorName")} />
          </Form.Group>
          <br />
          <Button
            style={{ marginTop: "2rem", width: "15vw" }}
            variant="outline-primary"
            type="submit"
          >
            Update Tutor
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
      </Container>
    </div>
  );
}
