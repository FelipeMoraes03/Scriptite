import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './generateScript.css';
import Header from '../header/header';

import openai from '../common/openai'
import prompts from '../common/prompt'
const promptScript = prompts[1]

function Main() {
    const [creative, setCreative] = useState("");
    const [script, setScript] = useState("");

    return (
        
        <main>

            <Header screen={2}/>

            <div className='flex flex-col items-center content-center'>
                <ShowCreative creative={creative} setCreative={setCreative}/>
                <GenerateButton input={creative} setKeyWord={setCreative} setScript={setScript} text={"GERAR SCRIPT"}/>
            </div>
            <div className='flex flex-col items-center content-center'>
                <ShowScript text={script}/>
                <StoryBoardPageButton creative={creative} script={script} text={"PRÓXIMO"}/>
            </div>

        </main>
    );
}
export default Main;

function GenerateButton(props) {  
    let updatedScript = ""
    async function generateScriptClick() {
        try {
            let prompt = promptScript;
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
                  updatedScript = updatedScript + chunk.choices[0].delta.content
                  const formattedScript = updatedScript.replace(/\n/g, '<br />')
                  props.setScript(formattedScript)
                }
              }

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
    const location = useLocation()
    const infos = location.state?.infos
    const creative = infos[0]
    props.setCreative(creative)

    return (
        <p className='showScript' dangerouslySetInnerHTML={{ __html: creative }}></p>
    );
}

function ShowScript(props) {
    const script = props.text;
    
    return (
        <p className='showScript' dangerouslySetInnerHTML={{ __html: script }}></p>
    );
}

function StoryBoardPageButton(props) {
    const navigate = useNavigate();
    const infos = [props.creative, props.script]
  
    const handleStoryBoardPage = () => {
      navigate('/story-board', { state: { infos } });
    };

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
                <button className='button-home' onClick={handleStoryBoardPage}>{props.text}</button>
            )}
        </next>
    );
}