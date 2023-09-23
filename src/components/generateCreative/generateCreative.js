import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './generateCreative.css'
import Header from '../header/header'
import { FaArrowRight, FaHourglassStart } from 'react-icons/fa'

import openai from '../common/openai'
import prompts from '../common/prompt'
const promptCreative = prompts[0]

function Main() {
  const [keyWordInput, setKeyWordInput] = useState(['', '', '', '', '', '', '', '', ''])
  const [creative, setCreative] = useState('')

  return (
    <div>
      <Header screen={1} />

      <div className="bodyCreative backgroundColor1">
        <div className="creativeBox">
          <div>
            <KeyWord
              numInput={1}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Qual o nome do seu produto?'}
            />
            <KeyWord
              numInput={2}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Qual o seu nicho/público-alvo?'}
            />
            <KeyWord
              numInput={3}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Quais as dores do seu público?'}
            />
            <KeyWord
              numInput={4}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Quais as necessidades/desejos do seu público?'}
            />
            <KeyWord
              numInput={5}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Como o seu produto atua na resolução dessas dores?'}
            />
            <KeyWord
              numInput={6}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Qual o formato do seu produto?'}
            />
            <KeyWord
              numInput={7}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Qual o diferencial do seu produto?'}
            />
            <KeyWord
              numInput={8}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Quais os objetivos do anúncio?'}
            />
            <KeyWord
              numInput={9}
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              placeholderInput={'Informe aqui'}
              description={'Qual o preço da oferta do seu produto?'}
            />
            <GenerateButton
              input={keyWordInput}
              setKeyWord={setKeyWordInput}
              setCreative={setCreative}
              text={'Gerar criativo'}
            />
          </div>
        </div>
        <div  className="icon fontColor2">
          <FaArrowRight />
        </div>
        <div className="creativeBox obc1" id="outputBoxCreative">
          <div id="obc22">
            <ShowCreative text={creative} />

            <div id="text1">
              <FaHourglassStart />
              Preencha as informações, clique em gerar criativo e aguarde.
            </div>
          </div>
          <div id="obc21">
            <ScriptPageButton creative={creative} text={'Próxima etapa'} />
          </div>
        </div>
      </div>
      <div className="footer fontColor4">
        Copyright © 2023 | Todos os direitos reservados
      </div>
    </div>
  )
}
export default Main

function KeyWord(props) {
  return (
    <keyword className="inputBox">
      <num>{props.description}</num>
      <input
        type="text"
        name="inputKeyword"
        id="inputKeyword"
        className="input"
        placeholder={props.placeholderInput}
        value={props.input[props.numInput - 1]}
        onChange={e =>
          props.setKeyWord(
            props.input.map((inputKeyWord, index) => {
              if (index === props.numInput - 1) {
                return e.target.value
              }
              return inputKeyWord
            })
          )
        }
      />
    </keyword>
  )
}

function GenerateButton(props) {
  let updatedCreative = ''
  async function generateCreativeClick() {
    if (props.input.includes('')) {
      alert('Todos os campos precisam ser preenchidos')
    } else {
      let box = document.getElementById('outputBoxCreative')
      box.classList.remove('obc1')
      box.classList.add('obc2')
      document.getElementById('text1').style = 'display: none'
      document.getElementById('obc21').classList.add('obc2-1')
      document.getElementById('obc22').classList.add('obc2-2')

      try {
        let prompt = promptCreative;
        prompt = prompt + "- Nome do produto: " + props.input[0] + "\n";
        prompt = prompt + "- Nicho e Público-Alvo: " + props.input[1] + "\n";
        prompt = prompt + "- Que Dor o publico tem: " + props.input[2] + "\n";
        prompt = prompt + "- Necessidade/Desejos do publico: " + props.input[3] + "\n";
        prompt = prompt + "- Como o produto resolve a dor: " + props.input[4] + "\n";
        prompt = prompt + "- Formato do produto: " + props.input[5] + "\n";
        prompt = prompt + "- Diferencial: " + props.input[6] + "\n";
        prompt = prompt + "- Objetivos do anuncio: " + props.input[7] + "\n";
        prompt = prompt + "- Preço da oferta: " + props.input[8] + "\n";

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {"role": "user", "content": prompt}
          ],
          stream: true,
        });
      
        for await (const chunk of completion) {
          if (chunk.choices[0].delta.content) {
            updatedCreative = updatedCreative + chunk.choices[0].delta.content
            const formattedCreative = updatedCreative.replace(/\n/g, '<br />')
            props.setCreative(formattedCreative)
          }
        }
      
      } catch (err) {
        console.error(err)
        alert(err)
      }
    }
  }

  return (
    <generate>
      <button className="creaButton" onClick={generateCreativeClick}>
        {props.text}
      </button>
      <div>{props.creative}</div>
    </generate>
  )
}

/*function ShowCreative(props) {
  const creative = props.text

  return (
    <creative>
      <p
        className="showCreative"
        dangerouslySetInnerHTML={{ __html: creative }}
      ></p>
    </creative>
  )
}*/

function ShowCreative(props) {
  const creative = props.text
  const creativeParts = creative.split('<br /><br />')
  const paragraphs = []

  if (creativeParts.length > 1) {
    creativeParts.forEach(element => {
      const [key, value] = element.split(': ')

      if (key.localeCompare('Criativo 1') === 0) {
        paragraphs.push(
          <div id="identifierCreative">
            <p className="titulo">{key}</p>
            <hr />
          </div>
        )
      } else {
        paragraphs.push(
          <div className="responseItem">
            <label className="titulo">{key}:</label>
            <p className="valor input">{value}</p>
          </div>
        )
      }
    })
  }

  return (
    <creative>
      <div className="showCreative">{paragraphs}</div>
    </creative>
  )
}

function ScriptPageButton(props) {
  const navigate = useNavigate();
  const infos = [props.creative]

  const handleScriptPage = () => {
    navigate('/script', { state: { infos } });
  };

  const scriptClick = async () => {
    if (props.creative === '') {
      alert('É necessário gerar um criativo antes de avançar')
    }
  }

  return (
    <next>
      {props.creative === '' ? (
        <button onClick={scriptClick}>{props.text}</button>
      ) : (
        <button className="buttonNext" onClick={handleScriptPage}>{props.text}</button>
      )}
    </next>
  )
}
