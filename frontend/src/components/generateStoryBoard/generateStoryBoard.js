import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './generateStoryBoard.css';
import Header from '../header/header.js';

const socket = io('http://localhost:5001');

function Main() {
    const [script, setScript] = useState("");
    const [urlImages, setUrlImages] = useState(["", "", "", ""]);
    const [scenesPrompt, setScenesPrompt] = useState([]);
    const [concatenatedImages, setConcatenatedImages] = useState("");

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('hbp1').classList.remove('selectBorder');
        document.getElementById('hbp2').classList.add('selectBorder');
        document.getElementById('hbp3').classList.remove('selectBorder');
        document.getElementById('hbp4').classList.remove('selectBorder');  
      });

    return (
        <main className>

            <Header screen={3}/>

            <div className='flex flex-col items-center content-center'>
                <ShowScript script={script} setScript={setScript}/>
                <GenerateButton input={script} urlImages={urlImages} setImagesUnit={setUrlImages} setImages={setConcatenatedImages} scenes={scenesPrompt} setScenes={setScenesPrompt} text={"GERAR STORY BOARD"}/>
            </div>
            <div className='flex flex-col items-center content-center'>
                <ShowStoryBoard text={concatenatedImages}/>
                <ResultsPageButton storyBoard={concatenatedImages} text={"PRÓXIMO"}/>
            </div>
        </main>
    );
}
export default Main;

function GenerateButton(props) {
    const [storyBoardPrompt, setStoryBoardPrompt] = useState('');
    const [streamingComplete, setStreamingComplete] = useState(false);

    useEffect(() => {
        // Quando streamingComplete for true, faça a requisição POST
        if (streamingComplete) {
            setStreamingComplete(false);

            let dallePrompts = storyBoardPrompt.split(/PROMPT SCENE /);

            let prompt = "";
            for (let index = 1; index < dallePrompts.length; index++) {
                // CRIA AS IMAGENS A PARTIR DOS PROMPTS
                prompt = dallePrompts[index];
                const callDalle = async () => {
                    try {
                        const res = await axios.post("http://localhost:5001/story-board", {
                            "scene": prompt
                        });

                        if (res.status === 200) {
                            let scene = JSON.stringify(res.data.scene);
                            let idx = scene.substring(2, 3);
                            idx = parseInt(idx)-1;
                            scene = scene.substring(6, scene.length - 2);

                            let updatedUrl = props.urlImages
                            updatedUrl[idx] = scene;
                            props.setImagesUnit(updatedUrl); //NÃO ESTÁ GUARDANDO AS URLS, APENAS 1
                            props.setImages(updatedUrl.join('<br><br>'));
                        }
                    } catch (err) {
                        console.error(err);
                        alert(err);
                    }
                };

                callDalle();
            }
        }
    }, [streamingComplete, storyBoardPrompt, props]);

    const generateStoryBoardClick = () => {
        let updatedStoryBoard = ""
        try {
            // GERA OS PROMPTS PARA SEREM PASSADOS PRO DALLE
            socket.emit('story_board', {
                script: props.input,
            });

            socket.on('story_board_chunk', (chunk) => {
                updatedStoryBoard = updatedStoryBoard + chunk.story_board
                setStoryBoardPrompt(updatedStoryBoard);
            });

            socket.on('story_board_streaming_complete', () => {
                setStreamingComplete(true);
            });

        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    return (
        <generate>
            <button className='button-home' onClick={generateStoryBoardClick}>{props.text}</button>
            <div>{props.script}</div>
        </generate>
    );
}

function ShowScript(props) {
    const location = useLocation()
    const script = location.state?.script
    props.setScript(script)

    return (
        <p className='showScript' dangerouslySetInnerHTML={{ __html: script }}></p>
    );
}

function ShowStoryBoard(props) {
    const script = props.text;
    
    return (
        <p className='showScript' dangerouslySetInnerHTML={{ __html: script }}></p>
    );
}

function ResultsPageButton(props) {
    const navigate = useNavigate();
    const storyBoard = props.storyBoard

    const handleResultsPage = () => {
      navigate('/result', { state: { storyBoard } });
    };

    return (
        <next>
            <button className='button-home' onClick={handleResultsPage}>{props.text}</button>
        </next>
    );
}