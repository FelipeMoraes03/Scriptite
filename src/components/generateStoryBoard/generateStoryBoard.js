import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './generateStoryBoard.css';
import Header from '../header/header';

import openai from '../common/openai'
import prompts from '../common/prompt'
const promptStoryBoard = prompts[2]

function Main() {
    const [creative, setCreative] = useState("")
    const [script, setScript] = useState("");
    const [urlImages, setUrlImages] = useState([]);
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
                <ShowScript setCreative={setCreative} script={script} setScript={setScript}/>
                <GenerateButton input={script} urlImages={urlImages} setImagesUnit={setUrlImages} setImages={setConcatenatedImages} scenes={scenesPrompt} setScenes={setScenesPrompt} text={"GERAR STORY BOARD"}/>
            </div>
            <div className='flex flex-col items-center content-center'>
                <ShowStoryBoard text={concatenatedImages}/>
                <ResultsPageButton creative={creative} script={script} storyBoard={concatenatedImages} text={"PRÓXIMO"}/>
            </div>
        </main>
    );
}
export default Main;

function GenerateButton(props) {
    async function generateStoryBoardClick() {
        let updatedStoryBoard = ""
        try {
                // GERA OS PROMPTS PARA SEREM PASSADOS PRO DALLE
                let prompt = promptStoryBoard;
                prompt = prompt + props.input;

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                    {"role": "user", "content": prompt}
                    ],
                    stream: true,
                });
                
                for await (const chunk of completion) {
                    if (chunk.choices[0].delta.content) {
                        updatedStoryBoard = updatedStoryBoard + chunk.choices[0].delta.content
                        props.setImages(updatedStoryBoard.split(/PROMPT SCENE /).filter(item => item.trim() !== "").join('<br><br>'))
                    }
                }

                let dallePrompts = updatedStoryBoard.split(/PROMPT SCENE /).filter(item => item.trim() !== "");
                let updatedUrl = dallePrompts
                props.setImages(updatedUrl.join('<br><br>'))
                for (let index = 0; index < dallePrompts.length; index++) {
                    // CRIA AS IMAGENS A PARTIR DOS PROMPTS
                    const image = await openai.images.generate({
                        prompt: dallePrompts[index]
                    });
                    updatedUrl[index] = image.data[0].url
                    props.setImagesUnit(updatedUrl);
                    props.setImages(updatedUrl.join('<br><br>'));
                }
              
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
    const infos = location.state?.infos
    const script = infos[1]
    const creative = infos[0]
    props.setScript(script)
    props.setCreative(creative)

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
    const infos = [props.creative, props.script, props.storyBoard]

    const handleResultsPage = () => {
      navigate('/result', { state: { infos } });
    };

    return (
        <next>
            <button className='button-home' onClick={handleResultsPage}>{props.text}</button>
        </next>
    );
}