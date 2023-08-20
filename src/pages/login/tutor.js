import { useState, useEffect } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { Form, Button } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function admin() {
  const [tutorDB, setTutorDB] = useState([]);
  const [currentTutorID, setCurrentTutorID] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedinTutor, setIsLoggedinTutor] = useState("");

  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${API_URL}/tutors`)
      .then((response) => {
        setTutorDB(response.data);
        console.log(tutorDB);
        // alert("Successfully fetched tutors data");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tutor = tutorDB.find((a) => a.tutorId === username);
    if (tutor && password === tutor.tutorName) {
      setIsLoggedinTutor(true);
      setCurrentTutorID(username);
      router.push({
        pathname: "/tutor",
        query: { tutorId: username },
      });
    } else {
      setIsLoggedinTutor(false);
      alert("Incorrect username or password");
      alert({ tutorDB });
      console.table(tutorDB);
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
    marginBottom: "1rem",
  };

  return (
    <>
      <div style={cardStyle}>
        <Container style={cardText}>Tutor Login</Container>
        <br />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Tutor ID</Form.Label>
            <Form.Control
              type="text"
              value={username}
              placeholder="t01"
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
