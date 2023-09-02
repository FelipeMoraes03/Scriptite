import React from "react";
import { Link } from 'react-router-dom';

function Home() {
    return (
        <home className='flex flex-line items-center justify-center space-x-40 mt-20'>
            <ChangePage />
        </home>
    )
}
export default Home;

function ChangePage() {  
    return(
        <next> 
            <Link to={`/creative`}>
                <button className='button-home'>INICIAR GERAÇÃO</button>  
            </Link>
        </next>
    );
}