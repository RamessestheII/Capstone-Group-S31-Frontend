import React, {useState, useEffect, useRef} from 'react';


const DropDown = ({Trigger, Display, hover, top, bottom}) =>{

    // variable to determine if dropdown is open or closed
    const [isOpen, setIsOpen] = useState(false);
    const overlayRef = useRef(null); // Create a ref for the overlay

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    // handlMouseLeave and handleMouseEnter help to open overlay on hover,
    // if hover is set to true
    const handleMouseEnter = () => {
        if (hover){
            setIsOpen(true);
        }
    };
    
    const handleMouseLeave = () => {
        if (hover){
            setIsOpen(false);
        }
    };

    // function to close dropdown on clicking anywhere else on page
    const handleClickOutside = (event) => {
    // Check if the clicked element is outside the dropdown overlay
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const componentClassName = `flex h-full text-lg relative mr-10`
    console.log(componentClassName)
    // customisable css for Display
    const displayClassName = `absolute max-h-48 overflow-y-auto ${bottom?'top-full':''} ${top?'bottom-full':''} left-0 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-10`;

    useEffect(() => {
        if (isOpen && !hover) {
          // Listen for clicks if dropdown overlay is open
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          // Clean up the event listener when overlay is closed
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        // Cleanup on component unmount
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isOpen]);

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={componentClassName}>
            <Trigger  onClick={toggleOverlay}/>
            {isOpen && (
                <div className={displayClassName} ref={overlayRef}>
                    <Display/>
                </div>
            )}
        </div>
    )
}

export default DropDown;