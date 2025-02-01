import React, { useState} from 'react';
import axios from 'axios';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export default function FileUpload({setFileList}) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // auth header to authenticate user backend requests
    const authHeader = useAuthHeader();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pdf', file);
        
        try {
            const response = await axios.post('http://localhost:3001/upload/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': authHeader
                },
            });
            setFileList(files => [...files, response.data.filename])
            console.log(response.data)
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button type="submit">Upload PDF</button>
        </form>
    );
};
