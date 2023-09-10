import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './generateScript.css';

const socket = io('http://localhost:5001');

function Main() {
    const [creative, setCreative] = useState("");
    const [script, setScript] = useState("");

    return (
        <main className='flex flex-line items-center justify-center space-x-20 mt-20'>
            <div className='flex flex-col items-center content-center'>
                <ShowCreative creative={creative} setCreative={setCreative}/>
                <GenerateButton input={creative} setKeyWord={setCreative} setScript={setScript} text={"GERAR SCRIPT"}/>
            </div>
            <div className='flex flex-col items-center content-center'>
                <ShowScript text={script}/>
                <StoryBoardPageButton script={script} text={"PRÓXIMO"}/>
            </div>
        </main>
    );
}
export default Main;

function GenerateButton(props) {  
    let updatedScript = ""
    async function generateScriptClick() {
        try {
            socket.emit('generate_script', {
                creative: props.input,
            });

            socket.on('script_chunk', (chunk) => {
                updatedScript = updatedScript + chunk.script;
                const formattedScript = updatedScript.replace(/\n/g, "<br />");
                props.setScript(formattedScript);
            });

        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    return (
        <generate>
            <button className='button-home' onClick={generateScriptClick}>{props.text}</button>
            <div>{props.creative}</div>
        </generate>
    );
}

function ShowCreative(props) {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5001/creative");
                let creativeAux = JSON.stringify(res.data.creative)
                creativeAux = creativeAux.substring(1, creativeAux.length - 1);
                props.setCreative(creativeAux);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <p className='showScript' dangerouslySetInnerHTML={{ __html: props.creative }}></p>
    );
}

function ShowScript(props) {
    const script = props.text;
    
    return (
        <p className='showScript' dangerouslySetInnerHTML={{ __html: script }}></p>
    );
}

function StoryBoardPageButton(props) {
    const storyBoardClick = async () => {
        if (props.script === "") {
            alert("É necessário gerar um script antes de avançar");
        }
    }

    return (
        <next>
            {props.script === "" ? (
                <button className='button-home' onClick={storyBoardClick}>{props.text}</button>
            ) : (
                <Link to={`/story-board`}>
                    <button className='button-home'>{props.text}</button>
                </Link>
            )}
        </next>
    );
}