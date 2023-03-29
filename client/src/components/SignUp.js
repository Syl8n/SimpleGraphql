import React, { Component } from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./entryform.css"

const ADD_STUDENT = gql`
    mutation SignUp(
        $firstName: String!,
        $lastName: String!,
        $password: String!,
        $program: String!,
        ) {
        signUp(
            firstName: $firstName,
            lastName: $lastName,
            password: $password,
            program: $program,            
            ) {
            _id
        }
    }
`;
//function component to add a student
const SignUp = () => {
    //
    let navigate = useNavigate()
    //
    let firstName, lastName, password, program;
    const [addStudent, { data, loading, error }] = useMutation(ADD_STUDENT);

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    return (
        <div className = 'entryform'>
            <form
                onSubmit={ e => {    
                    e.preventDefault();
                    addStudent( { variables: { firstName: firstName.value, lastName: lastName.value, 
                    password: password.value, program: program.value} 
                    });
                    
                    firstName.value = '';
                    lastName.value='';
                    password.value='';
                    program.value='';
                    navigate('/studentlist')                    } 
                }
            >

                    <Form.Group>
                        <Form.Label> First Name:</Form.Label>
                        <Form.Control type="text"  name="firstName" ref={node => {firstName = node; }} 
                            placeholder="First Name:" />
                    </Form.Group>                   
                    

                    <Form.Group>
                        <Form.Label> Last Name:</Form.Label>
                        <Form.Control type="text" name="lastName" ref={node => {lastName = node; }} 
                            placeholder="Last Name:" />
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label> Password:</Form.Label>
                        <Form.Control type="text"  name="password" ref={node => {password = node; }} 
                            placeholder="Password:" />
                    </Form.Group>                     
                
                    <Form.Group>
                        <Form.Label> Program:</Form.Label>
                        <Form.Control type="text"  name="program" ref={node => {program = node; }} 
                            placeholder="Program:" />
                    </Form.Group>                                   

                    <Button variant="primary" type="submit"> Sign Up </Button>

            </form>
        </div>
    );
}

export default SignUp
