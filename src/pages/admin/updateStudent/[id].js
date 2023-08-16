import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function updateStudentById(_id, studentData) {
  try {
    await axios.put(`${API_URL}/students/${_id}`, studentData);
    console.log(`Student with _id ${_id} updated successfully.`);
  } catch (error) {
    console.error("Error updating student:", error.message);
  }
}

export default function UpdateStudent() {
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function fetchStudent() {
      if (!id) return;
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error.message);
      }
    }

    fetchStudent();
  }, [id]);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (student) {
      setValue("studentId", student.studentId);
      setValue("studentName", student.studentName);
    }
  }, [student]);

  const onSubmit = async (data) => {
    await updateStudentById(id, data);
    router.back();
  };

  if (!student) {
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
        <Container style={cardText}>Update Student</Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="studentId">
            <Form.Label>Student ID</Form.Label>
            <Form.Control type="text" {...register("studentId")} readOnly />
          </Form.Group>
          <br />
          <Form.Group controlId="studentName">
            <Form.Label>Student Name</Form.Label>
            <Form.Control type="text" {...register("studentName")} />
          </Form.Group>
          <br />
          <Button
            style={{ marginTop: "2rem", width: "15vw" }}
            variant="outline-primary"
            type="submit"
          >
            Update Student
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
