import { useState, useEffect } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Form, Button } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function admin() {
  const [studentDB, setStudentDB] = useState([]);
  const [currentStudentID, setCurrentStudentID] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedInStudent, setIsLoggedInStudent] = useState("");
  const router = useRouter();
  const cardStyle = {
    width: "20vw",
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

  useEffect(() => {
    axios
      .get(`${API_URL}/students`)
      .then((response) => {
        setStudentDB(response.data);
        console.log(studentDB);
        // alert("Successfully fetched students data");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    const student = studentDB.find((a) => a.studentId === username);
    if (student && password === student.studentName) {
      setIsLoggedInStudent(true);
      setCurrentStudentID(username);
      router.push({
        pathname: "/student",
        query: { studentId: student._id },
      });
    } else {
      setIsLoggedInStudent(false);
      alert("Incorrect username or password");
      alert({ studentDB });
      console.table(studentDB);
    }
  };
  return (
    <>
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
        <Container style={cardText}>Student Login</Container>
        <br />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="text"
              value={username}
              placeholder="s01"
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <br />
          <br />
          <Button
            variant="outline-primary"
            type="submit"
            style={{ marginBottom: "1em", width: "13vw" }}
          >
            Login
          </Button>
          <Button
            variant="outline-secondary"
            onClick={goHome}
            style={{ marginBottom: "2em", width: "13vw" }}
          >
            Back
          </Button>
        </Form>
      </div>
    </>
  );
}
