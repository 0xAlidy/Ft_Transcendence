// import axios from "axios";
import React from "react";
import Webcam from "react-webcam";
import '../../../../styles/MainPage/midPanel/Profile/camera.css'

const videoConstraints = {
  width: 150,
  facingMode: "environment"
};

export default class Camera extends React.Component<{name:any},{url:string | null}>{
    webcam:Webcam | null;
    constructor(props :any){
        super(props)
        this.state= {url: null};
        this.webcam = null;
    }

    setRef = (webcam: Webcam) => {
        this.webcam = webcam;
      };
    capturePhoto = () => {
      var imgSrc: any;
      if(this.webcam){
        imgSrc = this.webcam.getScreenshot();}
        this.setState({url:imgSrc});
    };
//   validate(){
//       console.log(this.state.url);
//   }
render(){
    const validate = async () => {
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*"
        }
        console.log(this.state.url);
        // axios.post('HTTP://localhost:667/user/upload', {url:this.state.url, name:this.props.name},{headers:headers})
        fetch('HTTP://localhost:667/user/upload', {
            method: "post",
            headers: headers,
            body: JSON.stringify({url:this.state.url, name:this.props.name}),
          })
    }
  return (
    <div className="cameraWidget">
        {this.state.url === null ?<Webcam ref={this.setRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} />:<img src={this.state.url} alt="Screenshot" />}
        {this.state.url === null ?<button onClick={this.capturePhoto}>Capture</button>:
                        <>
                            <button onClick={() => this.setState({url:null})}>Retry</button>
                            <button onClick={validate}>validate</button>
                        </>}
      {/* {url && (
        <div>
          <img src={url} alt="Screenshot" />
        </div>
      )} */}
    </div>
  );
}
};