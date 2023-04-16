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
import Table from "react-bootstrap/Table";

export default function Tutor() {
  const router = useRouter();
  const { tutorId } = router.query;
  const [tutorDB, setTutorDB] = useState([]);
  const [tutorName, setTutorName] = useState("");
  const [sessions, setSessions] = useState([]);
  const [numStudentsEnrolled, setNumStudentsEnrolled] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/tutorPlus/tutors")
      .then((response) => {
        setTutorDB(response.data);
        console.log(tutorDB);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (tutorDB.length > 0) {
      const tutor = tutorDB.find((tutor) => tutor.tutorId === tutorId);
      if (tutor) {
        setTutorName(tutor.tutorName);
      }
    }
  }, [tutorDB, tutorId]);

  useEffect(() => {
    // Fetch sessions from the API
    axios
      .get("http://localhost:3000/api/tutorPlus/sessions")
      .then((response) => {
        setSessions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch student sessions from the API
    axios
      .get("http://localhost:3000/api/tutorPlus/studentsessions")
      .then((response) => {
        // Group student sessions by session ID
        const sessionsData = response.data.reduce((acc, curr) => {
          if (!acc[curr.sessionId]) {
            acc[curr.sessionId] = [];
          }
          acc[curr.sessionId].push(curr);
          return acc;
        }, {});

        // Create an object with all session IDs and a value of 0
        const sessionIds = sessions.map((session) => session.sessionId);
        const numStudents = Object.fromEntries(
          sessionIds.map((sessionId) => [sessionId, 0])
        );

        // Calculate the number of students enrolled in each session
        for (const [sessionId, studentSessions] of Object.entries(
          sessionsData
        )) {
          numStudents[sessionId] = studentSessions.length;
        }

        setNumStudentsEnrolled(numStudents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.table(numStudentsEnrolled);

  const filteredSessions = sessions.filter(
    (session) => session.tutorId === tutorId
  );

  console.table(filteredSessions);

  const cardStyle = {
    width: "50vw",
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
        <Container style={cardText}>Welcome {tutorName}</Container>

        <Table
          responsive
          style={{
            width: "100%",
            margin: "auto",
            marginBottom: "5em",
            marginTop: "3em",
          }}
        >
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Students Enrolled</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.sessionId}>
                <td>{session.sessionId}</td>
                {/* <td>{new Date(session.sessionTime).toLocaleDateString()}</td>
                <td>{new Date(session.sessionTime).toLocaleTimeString()}</td> */}
                <td>
                  {new Date(session.sessionTime).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}
                </td>
                <td>
                  {new Date(session.sessionTime).toLocaleTimeString("en-US", {
                    timeZone: "UTC",
                  })}
                </td>
                <td>{numStudentsEnrolled[session.sessionId] || 0}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    style={{ width: "5em" }}
                    onClick={() =>
                      router.push({
                        pathname: `/tutor/update/${session._id}`,
                      })
                    }
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    style={{ width: "5em" }}
                    onClick={async () => {
                      try {
                        // Delete the session
                        await axios.delete(
                          `http://localhost:3000/api/tutorPlus/sessions/${session._id}`
                        );
                        // Delete student sessions for this session
                        const studentSessions = await axios.get(
                          "http://localhost:3000/api/tutorPlus/studentsessions"
                        );
                        const studentSessionsToDelete =
                          studentSessions.data.filter(
                            (ss) => ss.sessionId === session.sessionId
                          );
                        for (const ss of studentSessionsToDelete) {
                          await axios.delete(
                            `http://localhost:3000/api/tutorPlus/studentsessions/${ss._id}`
                          );
                        }
                        alert("Session deleted successfully");
                        window.location.reload(false);
                      } catch (error) {
                        console.log(error);
                        alert("Error deleting session");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button
          style={{ width: "20em", height: "3em" }}
          onClick={() =>
            router.push({ pathname: "/tutor/add", query: { tutorId } })
          }
        >
          Add New Session
        </Button>
      </div>
    </div>
  );
}
