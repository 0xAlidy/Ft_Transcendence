import Logo from '../HomePage/Logo'
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import '../../styles/ErrorPage/ErrorPage.css'

function ErrorPage(props:any){
    const [bool, setBool] = useState(false);
    const error = queryString.parse(props.location).id;
    const message = (id:any) => {
        if (id === "1")
            return <h1 className='errorMessage'>You are already connected</h1>;
        return;
    }

    useEffect(() => {
        setTimeout(() => setBool(true), 5000);
    }, []);

    return (
        <div id="ErrorPage">
            <Logo />
            {message(error)}
            {bool && <Redirect to={'/'} />}
        </div>
    )
};

export default ErrorPage;
