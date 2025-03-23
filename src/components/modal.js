import React, { useState, useEffect, useRef } from 'react';

const Modal = ({ Trigger, modalText, inputPlaceholder, onSubmit, submitText, clickAway }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const overlayRef = useRef(null); // Create a ref for the overlay

    const toggleOverlay = () => {
        setIsOpen(prev => !prev);
    };

    // Close the modal when clicking outside
    const handleClickOutside = (event) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen && clickAway) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, clickAway]);

    const displayClassName = `flex flex-col max-h-48 overflow-y-auto bg-white bg-opacity-90 p-4 rounded-lg shadow-lg ${isOpen ? '' : 'hidden'}`;

    return (
        <div>
            <Trigger onClick={toggleOverlay} />
            <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
                <div className={displayClassName} ref={overlayRef}>
                    <span className="ml-2">{modalText}</span>
                    {/* render input box if input placeholder is passed */}
                    {inputPlaceholder?
                    (
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={inputPlaceholder}
                        />
                    ):
                    (<></>)

                    }

                    <div className='flex mt-2'>
                        {onSubmit && (
                            <button 
                                className="bg-gray-400 text-white mr-2 px-2 rounded hover:bg-gray-500"
                                onClick={() => {
                                    if (input){
                                        onSubmit(input);
                                        setInput("");
                                        toggleOverlay();
                                    }
                                    else{
                                        onSubmit();
                                        toggleOverlay();
                                    }
                                    
                                }}
                            >
                                {submitText}
                            </button>
                        )}
                        <button 
                            className="bg-gray-400 text-white px-2 rounded hover:bg-gray-500"
                            onClick={toggleOverlay}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;