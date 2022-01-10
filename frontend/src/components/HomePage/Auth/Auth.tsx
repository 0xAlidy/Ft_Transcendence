import * as React from 'react'
import queryString from 'query-string';
import axios from 'axios'
import { Redirect } from 'react-router-dom';
// import { useLocation } from 'react-router';

function request(code:any){
    return axios.get('http://localhost:667/app/token/?code=' + code)
}
export default class Auth extends React.Component<{token: any, connect : any, location: string}, {}>{
    constructor(props :any) {
		super(props);
	  }
	render(){
            const data = {
            code: queryString.parse(this.props.location).code,
            }
        var ret = request(data.code);
        if (ret === null)
            this.props.connect(false);
        else
        {
            this.props.token(ret);
            this.props.connect(true);
        }
        return <Redirect to={'/'} />
	}
}
