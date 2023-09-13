import React from "react";
import { Link } from 'react-router-dom';
import './home.css';

import img1 from './img1.png';

function Home() {
    return (
        <div>
            <header className="headerHome backgroundColor2">
                <div className="logoBox">
                    <h1 className="fontColor2 fontSize1">
                        script
                    </h1>
                    <h1 className="fontColor3 fontSize1">
                        ite
                    </h1>  
                </div>
                <div className="">
                    <Link to={`/creative`}>
                        <button className=''>Iniciar</button>  
                    </Link>
                </div>

            </header>

            <div className=" bodyHome backgroundColor1">

                <div className="centerBox boxHome backgroundColor2">
                    <div id="boxHome1">

                        <div>
                            <h1 className="fontSize1 fontColor2 fontWeigth1">Crie agora anúncios incríveis para sua empresa.</h1>
                        </div>
                        <div>
                            Com o Scriptite você cria, planeja e executa, pode contar conosco.
                        </div>
                        <div>
                            <Link to={`/creative`}>
                                <button className=''>Iniciar</button>  
                            </Link>
                        </div>

                    </div>
                    <div id="boxHome2">
                        <img src={img1}></img>
                    </div>

                </div>


                <footer className="fontColor4">
                    Copyright © 2023 | Todos os direitos reservados
                </footer>

            </div>



        </div>
    )
}
export default Home;