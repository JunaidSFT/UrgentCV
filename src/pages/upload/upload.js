import React from 'react';
import {Card, CardBody, CardHeader, CardText, Button} from 'reactstrap';
import Dropzone from "react-dropzone";
import axios from 'axios';
import ReactLoading from "react-loading";
// Importing toastify module
import { ToastContainer, toast } from 'react-toastify';
// import UploadService from "../services/upload-files.service";
import UploadService from "../../services/upload-service";
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
class Upload extends React.Component {
	constructor(props) {
		super(props);
        this.upload = this.upload.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.state = {
            Img_Data : null,
            selectedFile: null,
            dataURL : "",
            image : null,
            base64 : null,
            selectedFiles: undefined,
            currentFile: undefined,
            progress: 0,
            message: "",
            fileInfos: [],
	        loading : false

        };
		
    };
    componentDidMount() {
        // UploadService.getFiles().then((response) => {
        //   this.setState({
        //     fileInfos: response.data,
        //   });
        // });
      }
    upload() {
        let currentFile = this.state.selectedFiles[0];
    
        this.setState({
          progress: 0,
          currentFile: currentFile,
        });
        console.log(currentFile)
        this.setState({loading:true})
        var reader = new FileReader();
        reader.readAsDataURL(currentFile);
        reader.onload = () => {
            let a = reader.result.toString().split(',')
            console.log(a[1])
            this.setState({ base64 : a[1]})
            axios({
                method: "POST",
                url: `http://34.125.195.139:8090/api/post/cheque`,
                data: {
                    img_str: this.state.base64,
                    recieving_time: Date().toLocaleString(),
                    cheque_status: "processed"
                }
            }).then((res) =>{
                this.setState({loading : false})
                toast('File Uploaded')
                console.log(res)
                this.state.fileInfos.push(currentFile.name)
            })
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        console.log(this.state.base64)
        this.setState({
          selectedFiles: undefined,
        });
    }
    onDrop(files) {
        if (files.length > 0) {
            this.setState({ selectedFiles: files });
        }
    }
    render() {
        const { selectedFiles, currentFile, progress, message, fileInfos } = this.state;
        const {loading} = this.state;
		return (
            
			<div className = "row" style = {{margin: '300px 30px 30px 50px', justifyContent: 'center'}}>
                {loading ?
                <div style = {{ margin: '100px 20spx 30px 200px'}}>  
                <ReactLoading width={100} type={"spinningBubbles"} color="#000" />
                </div> :
                <div>
                    <ToastContainer position='top-center'/>
                    {currentFile && (
                    <div className="progress mb-3">
                        <div
                        className="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: progress + "%" }}
                        >
                        {progress}%
                        </div>
                    </div>
                    )}

                    <Dropzone onDrop={this.onDrop} multiple={false}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                        <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            {selectedFiles && selectedFiles[0].name ? (
                            <div className="selected-file">
                                {selectedFiles && selectedFiles[0].name}
                            </div>
                            ) : (
                                <span >
                                    <b>Drag and drop file here, or click to select file</b>
                                </span>
                            )}
                        </div>
                        <aside className="selected-file-wrapper">
                            <button
                            className="btn btn-success"
                            disabled={!selectedFiles}
                            onClick={this.upload}
                            >
                            Upload
                            </button>
                        </aside>
                        </section>
                    )}
                    </Dropzone>

                    <div className="alert alert-light" role="alert">
                    {message}
                    </div>
                </div>}
            </div>
            
        )
    }
}

export default Upload;