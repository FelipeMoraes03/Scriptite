import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './generateScript.css';
import Header from '../header/header';
import { FaArrowRight } from 'react-icons/fa';

import openai from '../common/openai'
import prompts from '../common/prompt'
const promptScript = prompts[1]

function Main() {
const [creative, setCreative] = useState("");
const [script, setScript] = useState("");

function atualizarParte(novaParte, index) {
const novasPartes = [...creative.split('<br /><br />')];
novasPartes[index] = novaParte;
setCreative(novasPartes.join('<br /><br />'));
}

const camposDeTexto = creative.split('<br /><br />').map((parte, index) => {
// Se a parte incluir um ": ", consideramos que é um rótulo e separamos em rótulo e conteúdo
const [rotulo, conteudo] = parte.split(': ');
return (
    <div key={index}>
    {rotulo && <p><strong>{rotulo}:</strong></p>}
    <InputField
        label={rotulo ? "" : `Criativo selecionado:`}
        value={conteudo || parte}
        setValue={novaParte => atualizarParte(novaParte, index)}
    />
    </div>
);
});


return (
<div>
    <Header screen={2} />

    <div className="bodyCreative backgroundColor1">
    <div className="creativeBox">
        {camposDeTexto}
        <ShowCreative creative={creative} setCreative={setCreative} />
        <GenerateButton input={creative} setKeyWord={setCreative} setScript={setScript} text={"GERAR SCRIPT"} />
    </div>
    <div id="icon" className="fontColor2">
        <FaArrowRight />
    </div>
    <div className="creativeBox obc1" id="outputBoxCreative">
        <ShowScript text={script} />
        <StoryBoardPageButton creative={creative} script={script} text={"PRÓXIMO"} />
    </div>
    </div>
    <div className=" footer fontColor4">
    Copyright © 2023 | Todos os direitos reservados
    </div>
</div>
);
}

function InputField(props) {
return (
<div className="inputBox">
    <label>{props.label}</label>
    <input type="text" value={props.value} onChange={e => props.setValue(e.target.value)} />
</div>
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
    <button className='creaButton' onClick={generateScriptClick}>{props.text}</button>
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
<p className='showCreative' dangerouslySetInnerHTML={{ __html: creative }}></p>
);
}

function ShowScript(props) {
const script = props.text;

return (
<p className='showCreative' dangerouslySetInnerHTML={{ __html: script }}></p>
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
        <button className='creaButton' onClick={storyBoardClick}>{props.text}</button>
    ) : (
        <button className='creaButton' onClick={handleStoryBoardPage}>{props.text}</button>
    )}
</next>
);
}
