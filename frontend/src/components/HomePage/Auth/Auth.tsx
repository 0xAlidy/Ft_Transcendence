import * as React from 'react'
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
export default class Auth extends React.Component<{name:any, token: any, connect : any, location: string}, {}>{
    constructor(props :any) {
		super(props);
	  }
  
	componentDidMount() {
    const data = {
      token: queryString.parse(this.props.location).token,
      name: queryString.parse(this.props.location).name,
    }
    if (data === null)
    {

        this.props.connect(false);
    }
    else
    {
        this.props.token(data.token);
        this.props.name(data.name);
        this.props.connect(true);
    }
	}
	render(){
        return <Redirect to={'/'} />
	}
}
