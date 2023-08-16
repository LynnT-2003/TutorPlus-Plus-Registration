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

export default function admin() {
  const [adminDb, setAdminDb] = useState([]);
  const [currentAdminID, setCurrentAdminID] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState("");

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
    marginBottom: "1rem",
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

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/tutorPlus/admins")
      .then((response) => {
        setAdminDb(response.data);
        console.log(adminDb);
        // alert("Successfully fetched Admin data");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the admin is valid
    const admin = adminDb.find((a) => a.adminId === username);
    if (admin && password === admin.adminName) {
      setIsLoggedInAdmin(true);
      setCurrentAdminID(username);

      // Push the adminID to the admin page as a query parameter
      router.push({
        pathname: "/admin",
        query: { adminId: username },
      });
    } else {
      setIsLoggedInAdmin(false);
      alert("Incorrect username or password");
    }
  };

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand onClick={goHome}>TutorPlus</Navbar.Brand>
          {/* <Nav className="me-auto">
            <Nav.Link onClick={goAdmin}>Admin</Nav.Link>
            <Nav.Link onClick={goTutor}>Tutor</Nav.Link>
            <Nav.Link onClick={goStudent}>Student</Nav.Link>
          </Nav> */}
        </Container>
      </Navbar>

      <div style={cardStyle}>
        <Container style={cardText}>Admin Login</Container>
        <br />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Admin ID</Form.Label>
            <Form.Control
              type="text"
              value={username}
              placeholder="a01"
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
