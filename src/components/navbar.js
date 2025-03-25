import React, {useState} from 'react';
import STLogo from './../logo.png'
import { useAuth } from '../Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGears } from '@fortawesome/free-solid-svg-icons';
import DropDown from './dropDown';


const Navbar = () => {
  const {logout} = useAuth();
  const [selectedLLM, setSelectedLLM] = useState(0);
  const llmList = ['OpenAI', 'Anthropic', 'Cohere']

  // button for user menu
  const UserButton = ({onClick})=>{
    return (
      <button 
        onClick={onClick} 
        className="bg-white text-gray-500 border-none px-4 py-2 h-full cursor-pointer text-base flex items-center"
      >
        <FontAwesomeIcon icon={faUser} className="h-6"/>
        <p className='ml-4'>User</p>
      </button>
    )
    
  }
  // list of options for user menu
  const UserMenu = ()=>{
    return (
      <ul className="list-none w-16 p-0 m-0 text-gray-600 text-sm font-sans font-semibold">
        <li><a href="/">Home</a></li>
        <li onClick={()=>logout()}><a href="/login">Log Out</a></li>
      </ul>
    )
  }

  // button for user menu
  const LLMButton = ({onClick})=>{
    return (
      <button  
        onClick={onClick}
        className="bg-white text-gray-500 px-4 h-full border-none cursor-pointer text-base flex items-center"
      >
        
        <FontAwesomeIcon icon={faGears} className="h-6"/>
        <p className='ml-4'>LLM</p>
        
      </button>
    )
    
  }

  // list of options for user menu
  const LLMMenu = ()=>{
    return (
      <ul className="list-none w-16 p-0 m-0 text-gray-600 text-sm cursor-pointer font-sans font-semibold">
        {llmList.map((llm, index)=>{
          const className = `${index===selectedLLM?'bg-slate-400 text-white':''} w-full`
          return(
            <li 
              key={index}
              onClick={()=>setSelectedLLM(index)}
              className={className}
            >
              {llm}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <nav className="flex justify-between items-center h-[10%] bg-white">
      <div className='flex h-full'>
        <div className='flex h-full align-middle'>
          {/* <img src={STLogo} alt='steng-logo' className='w-36 ml-16 mt-1'/> */}
          <p className='my-5 ml-36 mr-10 h-full font-sans font-bold text-20 text-gray-700'>GAR ChatBot</p>
          <DropDown Trigger={LLMButton} Display={LLMMenu} bottom/>
        </div>
      </div>
      
      
      <DropDown Trigger={UserButton} Display={UserMenu} bottom/>
      
    </nav>
  );
};

export default Navbar;