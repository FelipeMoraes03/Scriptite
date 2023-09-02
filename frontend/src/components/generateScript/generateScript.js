import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './generateScript.css';

function Main() {
    const [keyWordInput, setKeyWordInput] = useState(["", "", "", "", "", "", "", "", ""]);
    const [script, setScript] = useState("O scrpit será mostrado aqui!!!")
    const creative = "O criativo será mostrado aqui"

    return (
        <main className='flex flex-line items-center justify-center space-x-20 mt-20'>
            <div className='flex flex-col items-center content-center'>
                <ShowScript text={creative}/>
                <GenerateButton input={keyWordInput} setKeyWord={setKeyWordInput} setScript={setScript} text={"GERAR SCRIPT"}/>
            </div>
            <div className='flex flex-col items-center content-center'>
                <ShowScript text={script}/>
                <StoryBoardPageButton text={"PRÓXIMO"}/>
            </div>
        </main>
    );
}
export default Main;

function GenerateButton(props) {  
    const generateScriptClick = async () => {
        try{
            const res = await axios.post("http://localhost:5000/generate-script", {
                "creative": props.input[0]
            });

            if (res.status === 200) {
                let script = JSON.stringify(res.data.script)

                script = script.substring(1, script.length - 1);

                props.setScript(script)
                //props.setKeyWord(["", "", "", "", "", "", "", "", ""]);
            }
            else {
                alert("ERROR: " + res.status);
            }
        }
        catch (err) {
            console.error(err);
            alert(err);
        }
    }

    return (
        <generate>
            <button className='button-home' onClick={generateScriptClick}>{props.text}</button>
            <div>{props.script}</div>
        </generate>
    );
}

function NavigateStoryBoard(props) {

}

function ShowScript(props) {
    const textWithLineBreaks = props.text;
    
    return (

        <p className='showScript' dangerouslySetInnerHTML={{ __html: textWithLineBreaks }}></p>

    );
}

function StoryBoardPageButton(props) {
    return (
        <next> 
            <Link to={`/story-board`}>
                <button className='button-home'>{props.text}</button>  
            </Link>
        </next>
    );
}