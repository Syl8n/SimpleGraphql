
import React, { Component } from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./entryform.css"

const SIGN_IN = gql`
    mutation SignIn(
        $id: String!,
        $password: String!,
        ) {
        signIn(
            id: $id,
            password: $password) {
            token
        }
    }`;

const SignIn = (props) => {

    let navigate = useNavigate()
    //
    let id, password;
    const [signIn, { data, loading, error }] = useMutation(SIGN_IN);

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    return (
        <div className = 'entryform'>
            <form
                onSubmit={ e => {    
                    e.preventDefault();
                    signIn( { variables: { id: id.value, password: password.value } })
                    .then((res) => {console.log(res.data); props.callback(res.data.signIn.token)})
                    .catch((err) => console.log("Sign in Error"));
                    
                    id.value = '';
                    password.value='';
                    navigate('/home')                    
                } }
            >

                    <Form.Group>
                        <Form.Label> Id:</Form.Label>
                        <Form.Control type="text"  name="id" ref={node => {id = node; }} 
                            placeholder="Id:" />
                    </Form.Group>                   

                    <Form.Group>
                        <Form.Label> Password:</Form.Label>
                        <Form.Control type="text"  name="password" ref={node => {password = node; }} 
                            placeholder="Password:" />
                    </Form.Group>                     
                
                    <Button variant="primary" type="submit"> Sign In </Button>

            </form>
        </div>
    );

}

export default SignIn;