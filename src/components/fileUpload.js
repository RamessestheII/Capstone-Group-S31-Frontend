import React, { useState} from 'react';
import axios from 'axios';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {LineWave} from 'react-loader-spinner'

export default function FileUpload({setFileList}) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // auth header to authenticate user backend requests
    const authHeader = useAuthHeader();
    
    const backend = process.env.REACT_APP_BACKEND_URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pdf', file);
        
        try {
            setLoading(true)
            const response = await axios.post(`${backend}/upload/scan`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': authHeader
                },
            });
            setLoading(false)
            setFileList(files => [...files, response.data.filename])
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            {loading?
                <LineWave
                    visible={true}
                    height="100"
                    width="100"
                    color="#4fa94d"
                    ariaLabel="line-wave-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    firstLineColor=""
                    middleLineColor=""
                    lastLineColor=""
                />
            :
            <button type="submit">Upload PDF</button>
            }
            
        </form>
    );
};
