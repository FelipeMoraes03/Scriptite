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
  const [buttonGenerate, setButtonGenerate] = useState("Gerar script")
  const [generatedContent, setGeneratedContent] = useState(false)

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
        <span className=" Sans'] text-[#5d5a88] font-['DM text-3xl font-bold leading">Criativo</span>
        </>
      );
    }
    return (
      <div key={index}>

        <div className='inputBox3-1'>
          {rotulo && <p><strong >{rotulo}:</strong></p>}
        </div>
        
        <div className='inputBox3-2'>
          <InputField 
          label={rotulo ? "" : `Criativo selecionado:`}
          value={conteudo || parte}
          setValue={novaParte => atualizarParte(novaParte, index)}
          />
        </div>

      </div>
    );
  });

  return (
    <div>
      <Header screen={2} />
  
      <div className="bodyCreative backgroundColor1">
        <div className="creativeBox">
          <div className='cb1' >
            {camposDeTexto}
            <ShowCreative
              creative={creative}
              setCreative={setCreative}
              hidden={true} />
          </div>
          <div className='cb2'>
            <GenerateButton
              input={creative}
              setKeyWord={setCreative}
              setScript={setScript}
              setButton={setButtonGenerate}
              content={generatedContent}
              setContent={setGeneratedContent}
              text={buttonGenerate} />
          </div>
          
        </div>

        <div id="icon" className="fontColor2">
            <FaArrowRight />
        </div>

        <div className="creativeBox" id="outputBoxCreative">
          <div className='cb1 cb12'>
            <div>
              <ShowScript text={script} />
            </div>
            <div id="tempText" style={{ marginTop: '200px' }}>
                        <FaHourglassStart />
                        Clique em gerar e aguarde.
                    </div>
            <div>
            </div>
          </div>
          {generatedContent && <StoryBoardPageButton
            creative={creative}
            script={script}
            text={"Próxima etapa"}/>}
        </div>

      </div>

      <div className="footer fontColor4">
        Copyright © 2023 | Todos os direitos reservados
      </div>

    </div>
  );
}

function InputField(props) {
  const handleChange = (event) => {
    props.setValue(event.target.value);
  };

  return (
    <div className="inputBox">
      <num>{props.label}</num>
      {props.value === "Criativo 1" ? (
        <span className="inputBox">{props.value}</span>
      ) : (
        <input className="input3" value={props.value} onChange={handleChange} />
      )}
    </div>
  );
}

function GenerateButton(props) {  
  let updatedScript = ""
  
  
  async function generateScriptClick() {

    if (!props.content) {
      document.getElementById('tempText').remove();
  }
    try {
      props.setContent(false)
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
      props.setButton("Gerar Novamente")
      props.setContent(true)

    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  return (
    <generate>
      <button className='creaButton' onClick={generateScriptClick}>{props.text}</button>

    </generate>
  );
}

function ShowCreative(props) {
  const location = useLocation();
  const infos = location.state?.infos;
  
  React.useEffect(() => {
    props.setCreative(infos[0]);
  }, [infos]);

  return (
    <p className='' style={{ display: props.hidden ? 'none' : 'block' }}
      dangerouslySetInnerHTML={{ __html: props.creative }}></p>
  );
}

function ShowScript(props) {
  const scriptLines = props.text.split('<br />');
  
  return (
    <div className="showCreative">
      {scriptLines.map((line, index) => {
        const colonIndex = line.indexOf(':');
        
        if (colonIndex !== -1) {
          const key = line.slice(0, colonIndex);
          const value = line.slice(colonIndex + 1).trim();
          
          if (key.localeCompare('Roteiro do criativo') === 0) {
            return (
              <div id="identifierCreative" className="'Sans']
                text-[#5d5a88] font-['DM text-3xl font-bold leading'" key={index}>
                <p className="title">{key}</p>
              </div>
            );
          } else {
            return (
              <div className="inputBox2" key={index}>
                <label className="title">{key}:</label>
                {value && <p className="value input2">{value}</p>}
              </div>
            );
          }
        }
        
        return null;
      })}
    </div>
  );
}

function StoryBoardPageButton(props) {
  const navigate = useNavigate();
  const infos = [props.creative, props.script]

  const handleStoryBoardPage = () => {
    navigate('/story-board', { state: { infos } });
  };
  if (props.script === "") {
    return (
      <div id="text1" className='tex'>
        <FaHourglassStart />
        Edite o Criativo se necessario, clique em gerar script e aguarde.
      </div>
    );
  }
  if (props.script !== "") {
    return (
      <next>
        <button className='creaButton' onClick={handleStoryBoardPage}>{props.text}</button>
      </next>
    );
  }
}




export default Main;
