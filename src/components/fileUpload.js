import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import SearchBox from './searchBox';

export default function FileUpload({fileShown}) {
    const [files, setFiles] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [filteredFileList, setFilteredFileList] = useState([])
    const [next, setNext] = useState(false)
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

    // useEffect to filter displayed file list when sector is selected/unselected
    useEffect(()=>{
        if (next){
            setFilteredFileList(fileList.filter((file) => file.sector === selectedSector))
        }
        else{
            setFilteredFileList(fileList)
        }
    }, [fileList, selectedSector, next])

    

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

    const onNext = () =>{
        if (selectedSector === ''){
            window.alert('Enter or choose a sector.')
            return
        }
        // check if sector is new or existing
        if (!sectors.includes(selectedSector)) {
            // user confirmation to create new kb when file/s are added
            if (window.confirm(`Create new knowledge base ${selectedSector} ?`)){
                setSectors([...sectors, selectedSector]);
                console.log(selectedSector)
                // display add files form, hide search box
                setNext(true)
            }
        }
        else{
            // display add files form, hide search box
            setNext(true)
        }
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // check if files have been selected, else return
        if (files.length===0){return;}

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
        <div className={`flex flex-col h-full justify-between ${fileShown? '':'hidden'}`}>
            {!next? (
                <SearchBox 
                items={sectors} 
                searchTerm={selectedSector} 
                setSearchTerm={setSelectedSector}
                onNext={onNext}
            />
            ) : (
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
                        <div className=' flex my-2 ml-4'>
                            <Oval
                                visible={true}
                                height="30"
                                width="30"
                                color="#4fa94d"
                                ariaLabel="line-wave-loading"
                            />
                            <p className='pl-3 pt-1 text-sm'>Adding files...</p>
                        </div>
                    ) : (
                        <div className='flex'>
                            <button type="button" onClick={()=>setNext(false)} className="ml-2 bg-gray-400 hover:bg-gray-500 text-sm text-white rounded px-4 py-2">Back</button>
                            <button type="submit" className="ml-2 bg-gray-400 hover:bg-gray-500 text-sm text-white rounded px-4 py-2">Upload PDFs</button>
                        </div>
                        
                    )}
                </form>
            )

            }
            
            <div className = "flex flex-col h-5/6 pr-1 bg-white shadow-md rounded-lg divide-y divide-gray-200 overflow-hidden hover:overflow-y-auto">
            {filteredFileList.map((file, index) => (
                <div className='group flex w-full justify-between content-center  hover:bg-gray-100 transition' key={index}>
                    <div  
                        className="p-4 max-w-[260px]" 
                        onContextMenu={(e) => handleContextMenuFile(e, file)}
                    >
                        <p className="overflow-hidden overflow-ellipsis">
                            {file.file}
                        </p>
                    </div>
                    <button className='my-3 mx-2 h-7 w-7 p-1' onClick={(e)=>handleContextMenuFile(e, file)}>
                        <FontAwesomeIcon icon={faTrashCan} className='h-full w-full'/>
                    </button>
                </div>
            ))}
            </div>
        </div>
        
        
    );
}