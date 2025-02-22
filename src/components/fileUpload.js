import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { LineWave } from 'react-loader-spinner';

export default function FileUpload() {
    const [files, setFiles] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const [isInputMode, setIsInputMode] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedSector, setSelectedSector] = useState('');

    const handleFileChange = (e) => {
        setFiles([...e.target.files]); // Collect all selected files
    };

    const authHeader = useAuthHeader();
    const headers = {
        Authorization: authHeader,
    };
    const backend = process.env.REACT_APP_BACKEND_URL;

    // get file list on startup
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fileList = await axios.get(
                    `${backend}/upload/`,
                    {headers}
                );
                if (fileList && fileList.data) {
                    setFileList(fileList.data)
                } else {
                    console.error("No data received");
                }

                const sectorList = await axios.get(
                    `${backend}/upload/sectors`,
                    {headers}
                );
                if (sectorList && sectorList.data) {
                    setSectors(sectorList.data)
                } else {
                    console.error("No data received");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleToggle = () => {
        setIsInputMode(!isInputMode);
        if (isInputMode) {
            setInputValue(''); // Clear input when switching to dropdown
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSelectChange = (e) => {
        setSelectedSector(e.target.value);
    };

    const handleAddOption = () => {
        if (inputValue && !sectors.includes(inputValue)) {
            setSectors([...sectors, inputValue]);
            setSelectedSector(inputValue); // Set the new option as selected
            setInputValue(''); // Clear input after adding
        }
    };

    const handleContextMenuFile = async(e, selectedFile) => {
        e.preventDefault(); // Prevent the default context menu from appearing
        if (window.confirm('Do you want to delete this file?')) {
            
            await axios.delete(
                `${backend}/upload/${selectedFile.sector}/${selectedFile.file}`,
                {headers}
            )
            // update useState file list
            setFileList(fileList.filter((file) => file.file !== selectedFile.file));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Append each selected file to formData
        Array.from(files).forEach(file => {
            formData.append('pdf', file);
        });

        // Append sector attribute of chosen files
        formData.append('sector', selectedSector);

        try {
            setLoading(true);
            const response = await axios.post(`${backend}/upload/scan`, formData, {headers});
            setLoading(false);
            // Assuming the response contains an array of filenames
            setFileList(prevFiles => [...prevFiles, ...response.data.filenames]);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex ml-5 border border-gray-300 rounded-full overflow-hidden h-10 w-60">
                <div 
                    className={`flex-1 text-center py-2 cursor-pointer ${!isInputMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} 
                    onClick={handleToggle}
                >
                    Select Sector
                </div>
                <div 
                    className={`flex-1 text-center py-2 cursor-pointer ${isInputMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} 
                    onClick={handleToggle}
                >
                    New Sector
                </div>
            </div>

            {isInputMode ? (
                <div className="mt-4">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={handleInputChange} 
                        placeholder="Enter new option" 
                        className="border border-gray-300 rounded p-2"
                    />
                    <button 
                        onClick={handleAddOption} 
                        className="ml-2 bg-blue-500 text-white rounded px-4 py-2"
                    >
                        Add Option
                    </button>
                </div>
            ) : (
                <select 
                    value={selectedSector} 
                    onChange={handleSelectChange} 
                    className="mt-4 border border-gray-300 rounded p-2"
                >
                    <option value="">Select a sector</option>
                    {sectors.map((sector, index) => (
                        <option key={index} value={sector}>
                            {sector}
                        </option>
                    ))}
                </select>
            )}

            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    className="block w-full text-sm text-gray-500 
                                file:mr-4 file:py-2 file:px-4 
                                file:rounded file:border file:border-gray-300 
                                file:text-sm file:font-semibold 
                                file:bg-blue-100 file:text-black 
                                hover:file:bg-blue-100 transition duration-200 
                                focus:outline-none focus:ring-2 focus:border-transparent"
                    accept="application/pdf" 
                    onChange={handleFileChange} 
                    multiple // Allow multiple files
                />
                {loading ? (
                    <LineWave
                        visible={true}
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="line-wave-loading"
                    />
                ) : (
                    <button type="submit">Upload PDFs</button>
                )}
            </form>
            <div className = "flex flex-col h-80 bg-white shadow-md rounded-lg divide-y divide-gray-200 overflow-hidden hover:overflow-y-auto">
                {fileList.map((file, index) => (
                        <div key={index} className="p-4 hover:bg-gray-100 transition" onContextMenu={(e)=>handleContextMenuFile(e, file)}>{file.file}</div>
                    ))}
            </div>
        </div>
        
        
    );
}