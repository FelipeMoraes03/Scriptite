import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './generateScript.css';
import Header from '../header/header';
import { FaArrowRight, FaHourglassStart } from 'react-icons/fa';

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
    const [rotulo, conteudo] = parte.split(': ');
    if (rotulo === "Criativo 1") {
      return(
        <>
        <span className=" Sans'] text-[#5d5a88] font-['DM text-3xl font-bold leading">{rotulo}</span>
        </>
      );
    }
    return (
      <div key={index}>
        {rotulo && <p><strong className="inputBox">{rotulo}:</strong></p>}
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
        <div className="creativeBox obc11">
          <div>
            {camposDeTexto}
            <ShowCreative creative={creative} setCreative={setCreative} hidden={true} />
            <GenerateButton input={creative} setKeyWord={setCreative} setScript={setScript} text={"GERAR SCRIPT"} />
          </div>
          
        </div>
        <div id="icon" className="fontColor2">
            <FaArrowRight />
        </div>
        <div className="creativeBox obc11" id="outputBoxCreative">
            <ShowScript text={script} />
            
            <StoryBoardPageButton creative={creative} script={script} text={"PRÓXIMO"}/>
        </div>
      </div>
      <div className=" footer fontColor4">
        Copyright © 2023 | Todos os direitos reservados
      </div>
    </div>
  );
}

function InputField({ label, value, setValue }) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="inputBox">
      <num>{label}</num>
      {value === "Criativo 1" ? (
        <span className="inputBox">{value}</span>
      ) : (
        <input className="input" value={value} onChange={handleChange} />
      )}
    </div>
  );
}

function GenerateButton({ input, setScript, text }) {  
  let updatedScript = ""
  
  async function generateScriptClick() {
    try {
      let prompt = promptScript;
      prompt = prompt + input;

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
              setScript(formattedScript)
          }
          }

    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  return (
    <generate>
      <button className='creaButton' onClick={generateScriptClick}>{text}</button>

    </generate>
  );
}

function ShowCreative({ creative, setCreative, hidden }) {
  const location = useLocation();
  const infos = location.state?.infos;
  
  React.useEffect(() => {
    setCreative(infos[0]);
  }, [infos]);

  return (
    <p className='showCreative' style={{ display: hidden ? 'none' : 'block' }} dangerouslySetInnerHTML={{ __html: creative }}></p>
  );
}

function ShowScript({ text }) {
  const scriptLines = text.split('<br />');
  
  return (
    <div className="showCreative">
      {scriptLines.map((line, index) => {
        const colonIndex = line.indexOf(':');
        
        if (colonIndex !== -1) {
          const key = line.slice(0, colonIndex);
          const value = line.slice(colonIndex + 1).trim();
          
          if (key.localeCompare('Roteiro do criativo') === 0) {
            return (
              <div id="identifierCreative" className="'Sans'] text-[#5d5a88] font-['DM text-3xl font-bold leading'" key={index}>
                <p className="title">{key}</p>
              </div>
            );
          } else {
            return (
              <div className="inputBox" key={index}>
                <label className="title">{key}:</label>
                {value && <p className="value input">{value}</p>}
              </div>
            );
          }
        }
        
        return null;
      })}
    </div>
  );
}

function StoryBoardPageButton({ creative, script, text }) {
  const navigate = useNavigate();
  const infos = [creative, script]

  const handleStoryBoardPage = () => {
    navigate('/story-board', { state: { infos } });
  };
  if (script === "") {
    return (
      <div id="text1" className='tex'>
        <FaHourglassStart />
        Edite o Criativo se necessario, clique em gerar script e aguarde.
      </div>
    );
  }
  if (script !== "") {
    return (
      <next>
        <button className='creaButton' onClick={handleStoryBoardPage}>{text}</button>
      </next>
    );
  }
}




export default Main;
