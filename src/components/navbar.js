import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Films from '../pages/films';
import Customer from '../pages/customer';
import Home from '../pages/home';

function NavBar() {
  return(
    <Router>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">CS 490 Project by Dylan Knight</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/films">Films</Nav.Link>
            <Nav.Link as={Link} to="/customer">Customer</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/films' element={<Films/>}/>
          <Route path='/customer' element={<Customer/>}/>
      </Routes>
    </Router>
  );
}

export default NavBar;