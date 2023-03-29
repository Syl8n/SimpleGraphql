import './App.css';
//
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Routes
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import './App.css';

import StudentList from './components/StudentList';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
//import CourseList from './components/CourseList';

import Home from './components/Home';


function App() {

  const [token, setToken] = useState("");

  return (
    <Router>
      
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="home">Henry Suh COMP308 Sec401</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/home" >Home</Nav.Link>

              {token ? null : <Nav.Link as={Link} to="/signup">Add Student</Nav.Link>}
              {token ? null : <Nav.Link as={Link} to="/studentlist">Student List</Nav.Link>}
              {token ? null : <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>}

              {/* {token ? <Nav.Link as={Link} to="/courselist">Course List</Nav.Link> : null} */}
              {token ? <Nav.Link as={Link} to="/signout">Sign Out</Nav.Link> : null}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path = "home" element={<Home />} /> 
          <Route path = "studentlist" element={<StudentList />} />
          <Route path = "signup" element={<SignUp />} />
          <Route path = "signin" element={<SignIn callback={setToken}/>} />
          {/* <Route path = "courselist" element={<CourseList token={token}/>} /> */}
          <Route path = "signout" element={<SignOut callback={setToken}/>} />

        </Routes>
    </div>
      
      

    </Router>


  );
}
//<Route render ={()=> < App />} path="/" />
export default App;
