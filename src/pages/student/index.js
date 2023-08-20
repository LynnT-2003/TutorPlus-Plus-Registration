import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/legacy/image";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Student() {
  const [sessions, setSessions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);

  const [student, setStudent] = useState(null);

  const router = useRouter();
  const { studentId } = router.query; // Get the studentId from router.query

  useEffect(() => {
    async function fetchData() {
      const sessionResponse = await fetch(`${API_URL}/sessions`);
      const sessionData = await sessionResponse.json();
      setSessions(sessionData);

      const tutorResponse = await fetch(`${API_URL}/tutors`);
      const tutorData = await tutorResponse.json();
      setTutors(tutorData);

      if (studentId) {
        console.log("Fetching Student details...");
        fetchStudentDetails(studentId);
      } else {
        console.log("Student ID is missing");
      }
    }
    fetchData();
  }, [studentId]);

  useEffect(() => {
    if (student) {
      console.log("Student details fetched");
      console.log("student", student);

      async function fetchRegisteredCourses() {
        const registeredCoursesResponse = await fetch(
          `${API_URL}/studentsessions`
        );
        const registeredCoursesData = await registeredCoursesResponse.json();
        const filteredCourses = registeredCoursesData.filter(
          (course) => course.studentId === student.studentId
        );
        setRegisteredCourses(filteredCourses);
        console.log("Registered sessions", { registeredCourses });
      }
      fetchRegisteredCourses();
    }
  }, [student, sessions]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const sessionResponse = await fetch(
  //       "${API_URL}/sessions"
  //     );
  //     const sessionData = await sessionResponse.json();
  //     setSessions(sessionData);

  //     const tutorResponse = await fetch(
  //       "${API_URL}/tutors"
  //     );
  //     const tutorData = await tutorResponse.json();
  //     setTutors(tutorData);

  //     const registeredCoursesResponse = await fetch(
  //       `${API_URL}/studentsessions`
  //     );
  //     const registeredCoursesData = await registeredCoursesResponse.json();
  //     const filteredCourses = registeredCoursesData.filter(
  //       (course) => course.studentId === student.studentId
  //     );
  //     setRegisteredCourses(filteredCourses);
  //     console.log("Student ID", { studentId });
  //     console.log("Filtered Courses ", { filteredCourses });
  //     console.log("Registered sessions", { registeredCourses });
  //   }
  //   console.log("Fetching Student details...");
  //   fetchStudentDetails(studentId);
  //   console.log("Student details fetched");
  //   console.log("student", student);
  //   fetchData();
  // }, []);
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

  // useEffect(() => {
  //   if (studentId) {
  //     // Only fetch student details when studentId is available
  //     console.log("Student: " + studentId);
  //     console.log("Fetching Student details...");
  //     fetchStudentDetails(studentId);
  //     console.log("Student details fetched");
  //     console.log("student", student);
  //   }
  // }, [studentId]);

  const fetchStudentDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/students/${id}`);
      console.log("response", response.data);
      setStudent(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!student) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <img src="/loading.gif" alt="Loading..." />
      </div>
    );
  }

  const cardStyle = {
    width: "60vw",
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

  const handleRegister = async (sessionId) => {
    console.log("Registering student...");
    console.log("studentId", student.studentId);
    console.log("sessionId", sessionId);
    try {
      console.log("Sending POST request to API endpoint");
      const response = await axios.post(`${API_URL}/studentsessions`, {
        studentId: student.studentId,
        sessionId,
      });
      console.log("Successfully registered:", response.data);
      alert("Successfully Enrolled");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  // function handleUnregister(sessionId, studentId) {
  //   // First, make a GET request to the API to retrieve the _id of the document to be deleted
  //   axios
  //     .get("${API_URL}/studentsessions", {
  //       params: {
  //         sessionId: sessionId,
  //         studentId: studentId,
  //       },
  //     })
  //     .then((response) => {
  //       const documents = response.data;
  //       // Assume that there is only one document matching the sessionId and studentId
  //       const documentId = documents[0]._id;

  //       // Then, make a DELETE request to the API using the _id of the document to be deleted
  //       axios
  //         .delete(
  //           `${API_URL}/studentsessions/${documentId}`
  //         )
  //         .then((response) => {
  //           console.log(
  //             `Successfully unregistered student ${studentId} from session ${sessionId}.`
  //           );
  //           // Here you can update your component's state or do other necessary actions
  //         })
  //         .catch((error) => {
  //           console.error(
  //             `Failed to unregister student ${studentId} from session ${sessionId}. Error:`,
  //             error
  //           );
  //         });
  //     })
  //     .catch((error) => {
  //       console.error(
  //         `Failed to retrieve document to delete for session ${sessionId} and student ${studentId}. Error:`,
  //         error
  //       );
  //     });
  // }

  function handleUnregister(sessionId, studentId) {
    // Make a DELETE request to the API to delete the document where sessionId and studentId match
    axios
      .delete(`${API_URL}/studentsessions`, {
        params: {
          sessionId: sessionId,
          studentId: studentId,
        },
      })
      .then((response) => {
        console.log(
          `Successfully unregistered student ${studentId} from session ${sessionId}.`
        );
        // Here you can update your component's state or do other necessary actions
      })
      .catch((error) => {
        console.error(
          `Failed to unregister student ${studentId} from session ${sessionId}. Error:`,
          error
        );
      });
  }

  return (
    <>
      <div style={cardStyle}>
        <Container style={cardText}>Welcome {student.studentName}</Container>

        <div>
          <h6>Offered Sessions</h6>
          <Table style={{ marginTop: "4em", marginBottom: "6em" }}>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Session Time</th>
                <th>Tutor ID</th>
                <th>Tutor Name</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const tutor = tutors.find((t) => t.tutorId === session.tutorId);
                const tutorName = tutor ? tutor.tutorName : "Unknown Tutor";
                return (
                  <tr key={session._id}>
                    <td>{session.sessionId}</td>
                    <td>{new Date(session.sessionTime).toLocaleString()}</td>
                    <td>{session.tutorId}</td>
                    <td>{tutorName}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleRegister(session.sessionId)}
                      >
                        Register +
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="registered-sessions">
          <h6>Registered Courses</h6>
          <Table style={{ marginTop: "4em", marginBottom: "6em" }}>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Session Time</th>
                <th>Tutor ID</th>
                <th>Tutor Name</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {sessions
                .filter((session) =>
                  registeredCourses.some(
                    (c) => c.sessionId === session.sessionId
                  )
                )
                .map((session) => {
                  const tutor = tutors.find(
                    (t) => t.tutorId === session.tutorId
                  );
                  const tutorName = tutor ? tutor.tutorName : "Unknown Tutor";
                  return (
                    <tr key={session._id}>
                      <td>{session.sessionId}</td>
                      <td>{new Date(session.sessionTime).toLocaleString()}</td>
                      <td>{session.tutorId}</td>
                      <td>{tutorName}</td>
                      <td>
                        <Button variant="outline-secondary" disabled={true}>
                          Registered
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          style={{ marginLeft: "0px" }}
                          onClick={() =>
                            handleUnregister(
                              session.sessionId,
                              student.studentId
                            )
                          }
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
