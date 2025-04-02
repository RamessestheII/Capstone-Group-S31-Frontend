import React from 'react';
import GARLogo from '../GAR_logo.png'
import { useAuth } from '../Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBrain, faRankingStar, faHexagonNodes } from '@fortawesome/free-solid-svg-icons';
import DropDown from './dropDown';


const Navbar = ({selectedLLM, setSelectedLLM, selectedReranker, setSelectedReranker, selectedGraph, setSelectedGraph}) => {
  const {logout} = useAuth();
  const llmList = ['OpenAI', 'Anthropic', 'Cohere']
  const rerankerList = ['Cohere', 'NoReranker']
  const graphList = ['Yes', 'No']

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

  // button for LLM menu
  const LLMButton = ({onClick})=>{
    return (
      <button  
        onClick={onClick}
        className="bg-white text-gray-500 border-[2px] border-gray-400 border-none px-4 h-full cursor-pointer text-base flex items-center"
      >
        
        <FontAwesomeIcon icon={faBrain} className="h-6"/>
        <p className='ml-4'>LLM</p>
        
      </button>
    )
    
  }

  // list of options for LLM
  const LLMMenu = ()=>{
    return (
      <ul className="list-none w-20 p-0 m-0 text-gray-600 text-sm cursor-pointer font-sans font-semibold">
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

// button for reranker menu
const RerankerButton = ({onClick})=>{
  return (
    <button  
      onClick={onClick}
      className="bg-white text-gray-500 px-4 h-full border-[2px] border-gray-400 border-none cursor-pointer text-base flex items-center"
    >
      
      <FontAwesomeIcon icon={faRankingStar} className="h-6"/>
      <p className='ml-4'>Reranker</p>
      
    </button>
  )
  
}

// list of options for reranker
const RerankerMenu = ()=>{
  return (
    <ul className="list-none w-28 p-0 m-0 text-gray-600 text-sm cursor-pointer font-sans font-semibold">
      {rerankerList.map((reranker, index)=>{
        const className = `${index===selectedReranker?'bg-slate-400 text-white':''} w-full`
        return(
          <li 
            key={index}
            onClick={()=>setSelectedReranker(index)}
            className={className}
          >
            {reranker}
          </li>
        )
      })}
    </ul>
  )
}

// button for reranker menu
const GraphButton = ({onClick})=>{
  return (
    <button  
      onClick={onClick}
      className="bg-white text-gray-500 px-4 h-full border-[2px] border-gray-400 border-none cursor-pointer text-base flex items-center"
    >
      
      <FontAwesomeIcon icon={faHexagonNodes} className="h-6"/>
      <p className='ml-4'>Graph</p>
      
    </button>
  )
  
}

// list of options for reranker
const GraphMenu = ()=>{
  return (
    <ul className="list-none w-20 p-0 m-0 text-gray-600 text-sm cursor-pointer font-sans font-semibold">
      {graphList.map((graph, index)=>{
        const className = `${index===selectedGraph?'bg-slate-400 text-white':''} w-full`
        return(
          <li 
            key={index}
            onClick={()=>setSelectedGraph(index)}
            className={className}
          >
            {graph}
          </li>
        )
      })}
    </ul>
  )
}

  return (
    <nav className="flex h-[10%] bg-white">
      <div className='flex self-start h-full'>
        <img src={GARLogo} alt='steng-logo' className='ml-28 mt-1 p-[5px]'/>
        {/* <p className='my-5 ml-44 mr-7 h-full font-sans font-bold text-20 text-gray-700'>GAR</p> */}
      </div>

      <div className='flex h-full ml-72 mr-7'>
        <DropDown Trigger={LLMButton} Display={LLMMenu} bottom mr={'mr-0'}/>
        <DropDown Trigger={RerankerButton} Display={RerankerMenu} bottom mr={'mr-0'}/>
        <DropDown Trigger={GraphButton} Display={GraphMenu} bottom mr={'mr-0'}/>
      </div>
      
      
      <DropDown Trigger={UserButton} Display={UserMenu} bottom/>
      
    </nav>
  );
};

export default Navbar;