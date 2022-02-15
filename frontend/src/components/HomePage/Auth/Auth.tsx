import * as React from 'react'
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
export default class Auth extends React.Component<{token: any, connect : any, location: string}, {}>{  
	componentDidMount() {
    const data = {
      token: queryString.parse(this.props.location).token,
      login: queryString.parse(this.props.location).name,
    }

    if (data === null)
      this.props.connect(false);
    else
    {
      this.props.token(data.token);
      this.props.connect(true);
    }
	}

	render(){
    return <Redirect to={'/'} />
	}
}
