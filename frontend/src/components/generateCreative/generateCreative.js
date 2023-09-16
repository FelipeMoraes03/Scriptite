import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './generateCreative.css';
import Header from '../header/header';

const socket = io('http://localhost:5001');

function Main() {
    const [keyWordInput, setKeyWordInput] = useState(["", "", "", "", "", "", "", "", ""]);
    const [creative, setCreative] = useState("")

    return (
        <div >
            
            <Header screen={1}/>

            <div className="bodyCreative backgroundColor1">

                <div className='creativeBox'>

                    <div> 
                        <KeyWord numInput={1} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Nome Produto"} description={"Qual o nome do seu produto?"} />
                        <KeyWord numInput={2} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Público alvo"} description={"Qual seu nicho/público-alvo?"} />
                        <KeyWord numInput={3} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Dores e problemáticas"} description={"Quais as dores do seu público?"} />
                        <KeyWord numInput={4} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Necessidades"} description={"Quais necessidades seu produto satisfaz?"} />
                        <KeyWord numInput={5} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Solução"} description={"Como seu produto atua na resolução do problema?"} />
                        <KeyWord numInput={6} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Formato (ex: aplicativo, lanchonete, vestimenta...)"} description={"Qual o formato do seu produto?"} />
                        <KeyWord numInput={7} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Diferencial"} description={"Qual diferencial seu protudo terá?"} />
                        <KeyWord numInput={8} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Objetivos (ex: anunciar novo sabor de picolé, divulgar inauguração...)"} description={"Objetivos do anúncio."} />
                        <KeyWord numInput={9} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Preço"} description={"Estipule um preço para seu produto."} />
                        <GenerateButton input={keyWordInput} setKeyWord={setKeyWordInput} setCreative={setCreative} text={"GERAR CRIATIVO"}/>
                    </div>

                </div>
                <div id='icon' className='fontColor2'>
                    -&gt;
                </div>
                <div className='creativeBox obc1' id='outputBoxCreative'>

                    <div id='obc21'>   
                         <div className='obc2-1'>Criativo</div>
                         <div><ScriptPageButton creative={creative} text={"PRÓXIMO"}/></div>
                    </div>
                    <div className='obc2-2'>
                        <ShowCreative text={creative}/>
                        <div id='text1'>
                            Preencha as informações, clique em gerar criativo e aguarde.
                        </div>
                    </div>

                </div>
                        
            </div>
            <div className=" footer fontColor4">
                    Copyright © 2023 | Todos os direitos reservados
            </div>

        </div>
    
    );

}
export default Main;


function KeyWord(props) {
    return (
        <keyword className='inputBox'>
            <num>{props.description}</num>
            <input type="text" name="inputKeyword" id="inputKeyword"
                className="input"
                placeholder={props.placeholderInput}
                value={props.input[props.numInput-1]}
                onChange={(e) => props.setKeyWord(
                    props.input.map((inputKeyWord, index) => {
                        if (index === props.numInput-1) {
                            return e.target.value;
                        }
                        return inputKeyWord;
                    })
                )}
            />
        </keyword>
    );
}

function GenerateButton(props) {


    let updatedCreative = ""

    async function generateCreativeClick() {
        if (props.input.includes("")) {
            alert("Todos as palavras chaves precisam ser definidas");
        } else {

            let box =  document.getElementById('outputBoxCreative');
            box.classList.remove('obc1');
            box.classList.add('obc2');
            document.getElementById('text1').innerHTML="";
            document.getElementById('obc21').classList.add('obc2-1');

            try {
                socket.emit('generate_creative', {
                    product_name: props.input[0],
                    public_target: props.input[1],
                    pains: props.input[2],
                    needs: props.input[3],
                    solution: props.input[4],
                    product_format: props.input[5],
                    diferential: props.input[6],
                    product_objectives: props.input[7],
                    price: props.input[8],
                });

                socket.on('creative_chunk', (chunk) => {
                    updatedCreative = updatedCreative + chunk.creative;
                    const formattedCreative = updatedCreative.replace(/\n/g, "<br />");
                    props.setCreative(formattedCreative);
                });

            } catch (err) {
                console.error(err);
                alert(err);
            }
        }
    }

    return (
        <generate>
            <button className='creaButton' onClick={generateCreativeClick}>{props.text}</button>
            <div>{props.creative}</div>
        </generate>
    );
}

function ShowCreative(props) {
    const creative = props.text;
    
    return (
        <creative>
          <p className='showCreative' dangerouslySetInnerHTML={{ __html: creative }}></p>
        </creative>
    );
}

function ScriptPageButton(props) {

    const scriptClick = async () => {
        if (props.creative === "") {
            alert("É necessário gerar um criativo antes de avançar");
        }
    }

    return (
        <next>
            {props.creative === "" ? (
                <button className='buttonNext' onClick={scriptClick}>{props.text}</button>
            ) : (
                <Link to={`/script`}>
                    <button className='buttonNext'>{props.text}</button>
                </Link>
            )}
        </next>
    );
}


