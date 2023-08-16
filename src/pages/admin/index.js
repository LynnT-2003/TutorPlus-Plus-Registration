import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import Table from "react-bootstrap/Table";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Admin() {
  const router = useRouter();
  const { adminId } = router.query;
  const [adminDb, setAdminDb] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [studentSessions, setStudentSessions] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/admins`)
      .then((response) => {
        setAdminDb(response.data);
        console.log(adminDb);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (adminDb.length > 0) {
      const admin = adminDb.find((admin) => admin.adminId === adminId);
      if (admin) {
        setAdminName(admin.adminName);
      }
    }
  }, [adminDb, adminId]);

  useEffect(() => {
    axios
      .get(`${API_URL}/tutors`)
      .then((response) => {
        setTutors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      // Get the tutor to be deleted
      const tutor = tutors.find((tutor) => tutor._id === id);
      console.table(tutor);

      // Get the sessions and student sessions for the tutor
      // Fetch all sessions
      const responseAllSessions = await axios.get(`${API_URL}/sessions`);
      const allSessions = responseAllSessions.data;

      // Filter sessions that have the same tutorId
      const sessions = allSessions.filter(
        (session) => session.tutorId === tutor.tutorId
      );
      console.table(sessions);

      // Fetch all student sessions
      const responseAllStudentSessions = await axios.get(
        `${API_URL}/studentsessions`
      );
      const allStudentSessions = responseAllStudentSessions.data;

      // Get the sessionIds of the filtered sessions
      const sessionIds = sessions.map((session) => session.sessionId);

      // Filter student sessions that have the same sessionId
      const studentSessions = allStudentSessions.filter((studentSession) =>
        sessionIds.includes(studentSession.sessionId)
      );
      console.table(studentSessions);

      // Delete the student sessions
      for (const studentSession of studentSessions) {
        await axios.delete(`${API_URL}/studentsessions/${studentSession._id}`);
      }

      // Delete the sessions
      for (const session of sessions) {
        await axios.delete(`${API_URL}/sessions/${session._id}`);
      }

      // Delete the tutor
      await axios.delete(`${API_URL}/tutors/${id}`);
      alert("Tutor deleted successfully");
      setTutors(tutors.filter((tutor) => tutor._id !== id));
    } catch (error) {
      console.log(error);
      alert("Error deleting tutor");
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/students`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDeleteStudent = async (id) => {
    try {
      const student = students.find((student) => student._id === id);
      const studentId = student.studentId;
      await axios.delete(`${API_URL}/students/${id}`);
      setStudents(students.filter((student) => student._id !== id));

      const studentSessions = await axios.get(`${API_URL}/studentsessions`);

      const studentSessionsToDelete = studentSessions.data.filter(
        (ss) => ss.studentId === studentId
      );
      for (const ss of studentSessionsToDelete) {
        await axios.delete(`${API_URL}/studentsessions/${ss._id}`);
      }
      alert("Session deleted successfully");
      window.location.reload(false);
    } catch (error) {
      console.log(error);
      alert("Error deleting student");
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/sessions`)
      .then((response) => {
        setSessions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/studentsessions`)
      .then((response) => {
        setStudentSessions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getNumOfStudents = (sessionId) => {
    const enrolledStudents = studentSessions.filter(
      (session) => session.sessionId === sessionId
    );
    return enrolledStudents.length;
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
    textAlign: "center",
    marginTop: "3rem",
  };

  const cardSmallText = {
    fontSize: "1.5rem",
    fontWeight: "300",
    lineHeight: "1.2",
    color: "#333",
    marginBottom: "2rem",
    textAlign: "center",
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

      <Container style={cardText}>Admin Dashboard</Container>
      <Container style={cardText}>Welcome {adminName}</Container>

      <div style={cardStyle}>
        <Container style={cardSmallText}>Tutors</Container>
        <Table>
          <thead>
            <tr>
              <th>Tutor ID</th>
              <th>Tutor Name</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor._id}>
                <td>{tutor.tutorId}</td>
                <td>{tutor.tutorName}</td>
                <td>
                  {" "}
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      router.push({
                        pathname: `/admin/update/${tutor._id}`,
                      })
                    }
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(tutor._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Link href="/admin/add">
          <Button style={{ margin: "2em" }} variant="outline-secondary">
            Add New Tutor
          </Button>
        </Link>{" "}
        <Container style={cardSmallText}>Students</Container>
        <Table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.studentName}</td>
                <td>
                  {" "}
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      router.push({
                        pathname: `/admin/updateStudent/${student._id}`,
                      })
                    }
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Link href="/admin/addStudent">
          <Button style={{ margin: "2em" }} variant="outline-secondary">
            Add New Student
          </Button>
        </Link>{" "}
        <Container style={cardSmallText}>Sessions by Tutors</Container>
        <Table>
          <thead>
            <tr>
              <th>Tutor ID</th>
              <th>Tutor Name</th>
              <th>Session ID</th>
              <th>Session Date</th>
              <th>Session Time</th>
              <th>Number of Students</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => {
              const tutorSessions = sessions.filter(
                (session) => session.tutorId === tutor.tutorId
              );
              return (
                <React.Fragment key={tutor._id}>
                  {tutorSessions.map((session) => (
                    <tr key={session._id}>
                      <td>{tutor.tutorId}</td>
                      <td>{tutor.tutorName}</td>
                      <td>{session.sessionId}</td>
                      <td>
                        {new Date(session.sessionTime).toLocaleDateString(
                          "en-US",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </td>
                      <td>
                        {new Date(session.sessionTime).toLocaleTimeString(
                          "en-US",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </td>
                      <td>{getNumOfStudents(session.sessionId)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}
