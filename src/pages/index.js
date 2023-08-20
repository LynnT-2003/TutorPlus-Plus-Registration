import { useRouter } from "next/router";
import Image from "next/legacy/image";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function Login() {
  const router = useRouter();

  const adminLogin = () => {
    router.push("/login/admin");
  };

  const tutorLogin = () => {
    router.push("/login/tutor");
  };

  const studentLogin = () => {
    router.push("/login/student");
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

  const landingText = {
    fontSize: "5rem",
    fontWeight: "bold",
    lineHeight: "1.2",
    color: "#3D9FBA",
    marginTop: "10rem",
    marginBottom: "5rem",
  };

  const homeText = {
    fontSize: "1.5rem",
    lineHeight: "1.2",
    color: "#333",
    marginTop: "5",
    marginBottom: "5rem",
  };

  return (
    <>
      <div className="BGandDiv">
        <Navbar bg="light" variant="light">
          <Container>
            <Nav.Link
              onClick={goHome}
              style={{ fontSize: "20px", paddingRight: "20px" }}
            >
              TutorPlus
            </Nav.Link>
            {/* <Navbar.Brand onClick={goHome}>TutorPlus</Navbar.Brand> */}
            <Nav className="me-auto">
              {/* <Nav.Link onClick={goAdmin}>Admin</Nav.Link>
              <Nav.Link onClick={goTutor}>Tutor</Nav.Link>
              <Nav.Link onClick={goStudent}>Student</Nav.Link> */}
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
          {/* <Image
            src="/images/background.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
        
          /> */}
        </div>
      </div>

      <Container style={landingText}>Welcome to TutorPlus</Container>

      <Container style={homeText}>
        "Streamline your studying experience TutorPlus."
      </Container>

      <Container style={{ marginTop: "10rem" }}>
        <Button
          variant="outline-secondary"
          size="lg"
          style={{ marginRight: "20px" }}
          onClick={adminLogin}
        >
          Login as Admin
        </Button>
        <Button
          variant="outline-secondary"
          size="lg"
          style={{ margin: "20px" }}
          onClick={tutorLogin}
        >
          Login as Tutor
        </Button>
        <Button
          variant="outline-secondary"
          size="lg"
          style={{ margin: "20px" }}
          onClick={studentLogin}
        >
          Login as Student
        </Button>
      </Container>
    </>
  );
}
