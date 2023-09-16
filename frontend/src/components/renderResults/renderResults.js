import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './renderResults.css'
import Header from '../header/header.js';


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
        </div>
    );
}
export default RenderResult;