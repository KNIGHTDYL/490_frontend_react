import React, { useState } from 'react';
import axios from 'axios';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [profileData, setProfileData] = useState(null);

  function getData() {
    axios.get('/profile')
      .then((response) => {
        setProfileData(response.data); // Set profileData to the array of actors
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  return (
    <div className="App">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">CS 490 Individual Project</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <header className="App-header">
        <p>To see the table details:</p>
        <button onClick={getData}>Click me</button>
        {profileData && profileData.map((actor, index) => (
          <div key={index}>
            <p>Actor ID: {actor.actor_id}</p>
            <p>First Name: {actor.first_name}</p>
            <p>Last Name: {actor.last_name}</p>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
