import React from "react";
import { useForm } from "react-hook-form";
import "../../styles/FileUploaded.css";

function FileUploaded() {
  const { handleSubmit } = useForm({
    mode: "onChange"
  });
  const onSubmit = (data:any) => {
    console.log(data);
  };


    return (
        <div>
            <form  onSubmit={handleSubmit(onSubmit)}>
              <button className="label-file"><label for="file" >import</label></button>
              <input id="file" type="file" className='file-uploaded' name="test" accept='image/png' />
          </form>
        </div>
      );
}

export default FileUploaded;