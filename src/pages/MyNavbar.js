import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";

import { useRouter } from "next/router";

const MyNavbar = () => {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  const goAboutUs = () => {
    router.push("/Aboutus");
  };

  return (
    <>
      <div className="BGandDiv">
        <Navbar bg="light" variant="light">
          <Container>
            <Nav.Link
              onClick={goHome}
              style={{ fontSize: "20px", padding: "10px 20px" }}
            >
              TutorPlus
            </Nav.Link>

            <Nav className="me-auto">
              <Nav.Link onClick={goAboutUs}>About Us</Nav.Link>
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
    </>
  );
};

export default MyNavbar;
