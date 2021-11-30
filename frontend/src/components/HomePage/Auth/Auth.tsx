import * as React from 'react'
import queryString from 'query-string';
import axios from 'axios'
import { useLocation } from 'react-router';

function Auth(){
    console.log(queryString.parse(useLocation().search));
    const data = {
        code: queryString.parse(useLocation().search).code,
    }
    axios.get('http://localhost:667/app/token/?code=' + data.code)
    .then(response => console.log(response));
    return(<div/>)
//     componentDidMount() {
//     const data = {
//         code: values.code,
//     }
//     axios.get('http://localhost:667/app/token/?code=' + data.code)
//     .then(response => console.log(response));
//     //Use the values to whatever you want.
//   }

}
export default Auth
