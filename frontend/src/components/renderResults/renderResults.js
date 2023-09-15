import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './renderResults.css'
import Header from '../header/header.js';

function RenderResult() {
    return (
        <div>
            <Header/>
        </div>
    );
}
export default RenderResult;