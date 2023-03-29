import React, { useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./entryform.css"

const SignOut = (props) => {

    let navigate = useNavigate()

    useEffect(() => {
        props.callback("");
        navigate('/signin')
    }, [])
}

export default SignOut;