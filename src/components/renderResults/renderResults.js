import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './renderResults.css'
import Header from '../header/header';


function RenderResult() {

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('hbp1').classList.remove('selectBorder');
        document.getElementById('hbp2').classList.remove('selectBorder');
        document.getElementById('hbp3').classList.remove('selectBorder');
        document.getElementById('hbp4').classList.add('selectBorder');  
    });

    return (
        <div>
            <Header screen={4}/>

            <div className='bodyCreative backgroundColor1 renderBody'>
                <div className='renderBox'>

                </div>
            </div>
            <div className=" footer fontColor4">
                Copyright © 2023 | Todos os direitos reservados
            </div>
        </div>
    );
}
export default RenderResult;