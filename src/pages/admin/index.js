import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/legacy/image";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React from "react";

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
      .get("https://tutor-plus.vercel.app/api/tutorPlus/admins")
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
      .get("https://tutor-plus.vercel.app/api/tutorPlus/tutors")
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
      const responseAllSessions = await axios.get(
        "https://tutor-plus.vercel.app/api/tutorPlus/sessions"
      );
      const allSessions = responseAllSessions.data;

      // Filter sessions that have the same tutorId
      const sessions = allSessions.filter(
        (session) => session.tutorId === tutor.tutorId
      );
      console.table(sessions);

      // Fetch all student sessions
      const responseAllStudentSessions = await axios.get(
        "https://tutor-plus.vercel.app/api/tutorPlus/studentsessions"
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
        await axios.delete(
          `https://tutor-plus.vercel.app/api/tutorPlus/studentsessions/${studentSession._id}`
        );
      }

      // Delete the sessions
      for (const session of sessions) {
        await axios.delete(
          `https://tutor-plus.vercel.app/api/tutorPlus/sessions/${session._id}`
        );
      }

      // Delete the tutor
      await axios.delete(
        `https://tutor-plus.vercel.app/api/tutorPlus/tutors/${id}`
      );
      alert("Tutor deleted successfully");
      setTutors(tutors.filter((tutor) => tutor._id !== id));
    } catch (error) {
      console.log(error);
      alert("Error deleting tutor");
    }
  };

  useEffect(() => {
    axios
      .get("https://tutor-plus.vercel.app/api/tutorPlus/students")
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
      await axios.delete(
        `https://tutor-plus.vercel.app/api/tutorPlus/students/${id}`
      );
      setStudents(students.filter((student) => student._id !== id));

      const studentSessions = await axios.get(
        "https://tutor-plus.vercel.app/api/tutorPlus/studentsessions"
      );

      const studentSessionsToDelete = studentSessions.data.filter(
        (ss) => ss.studentId === studentId
      );
      for (const ss of studentSessionsToDelete) {
        await axios.delete(
          `https://tutor-plus.vercel.app/api/tutorPlus/studentsessions/${ss._id}`
        );
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
      .get("https://tutor-plus.vercel.app/api/tutorPlus/sessions")
      .then((response) => {
        setSessions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://tutor-plus.vercel.app/api/tutorPlus/studentsessions")
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

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#home">TutorPlus</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/login/admin">Admin</Nav.Link>
            <Nav.Link href="/login/tutor">Tutor</Nav.Link>
            <Nav.Link href="/login/student">Student</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div
        style={{
          zIndex: -1,
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Image
          src="/images/background.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div>
        <h1>Welcome Admin {adminId}</h1>
        {adminName && <p>Admin Name: {adminName}</p>}
        <h1>Tutors</h1>
        <table>
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
                  <Button onClick={() => handleDelete(tutor._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link href="/admin/add">
          <Button>Add New Tutor</Button>
        </Link>{" "}
        <h1>Students</h1>
        <table>
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
                  <Button onClick={() => handleDeleteStudent(student._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link href="/admin/addStudent">
          <Button>Add New Student</Button>
        </Link>{" "}
      </div>
      <div>
        <h1>Sessions by Tutors</h1>
        <table>
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
                        {new Date(session.sessionTime).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(session.sessionTime).toLocaleTimeString()}
                      </td>
                      <td>{getNumOfStudents(session.sessionId)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
