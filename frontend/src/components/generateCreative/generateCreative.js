import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './generateCreative.css';

function Main() {
    const [keyWordInput, setKeyWordInput] = useState(["", "", "", "", "", "", "", "", ""]);
    const [creative, setCreative] = useState("")

    return (
        <main className='flex flex-line items-center justify-center space-x-40 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <KeyWord numInput={1} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Nome Produto"} />
                <KeyWord numInput={2} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Publico Alvo"} />
                <KeyWord numInput={3} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Dores"} />
                <KeyWord numInput={4} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Necessidades"} />
                <KeyWord numInput={5} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Solucao"} />
                <KeyWord numInput={6} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Formato Produto"} />
                <KeyWord numInput={7} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Diferencial Produto"} />
                <KeyWord numInput={8} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Objetivos Produto"} />
                <KeyWord numInput={9} input={keyWordInput} setKeyWord={setKeyWordInput} placeholderInput={"Preco Porduto"} />
                <GenerateButton input={keyWordInput} setKeyWord={setKeyWordInput} setCreative={setCreative} text={"GERAR CRIATIVO"}/>
            </div>
            <div className='flex flex-col items-center content-center'>
                <ShowCreative text={creative === "" ? "O criativo será mostrado aqui" : creative}/>
                <ScriptPageButton creative={creative} text={"PRÓXIMO"}/>
            </div>
        </main>
    );
}
export default Main;

function KeyWord(props) {
    return (
        <keyword className='flex flex-line pb-3 justify-end items-center'>
            <num className='pr-3 text-2xl'>{props.numInput}.</num>
            <input type="text" name="inputKeyword" id="inputKeyword"
                className="block rounded-md py-2 pr-20 sm:text-sm inputLabel"
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
    const generateCreativeClick = async () => {
        if (props.input.includes("")) {
            alert("Todos as palavras chaves precisam ser definidas");
        }
        else {
            try{
                const res = await axios.post("http://localhost:5000/creative", {
                    "product_name": props.input[0],
                    "public_target": props.input[1],
                    "pains": props.input[2],
                    "needs": props.input[3],
                    "solution": props.input[4],
                    "product_format": props.input[5],
                    "diferential": props.input[6],
                    "product_objectives": props.input[7],
                    "price": props.input[8]
                }/*, {
                    responseType: 'stream',
                }*/);

                /*let aux = "";
                for await (const chunk of res) {
                    aux += chunk.data.creative
                    props.setCreative(aux)
                }*/

                if (res.status === 200) {
                    let creative = JSON.stringify(res.data.creative)

                    creative = creative.substring(1, creative.length - 1);

                    props.setCreative(creative)
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
    }

    return (
        <generate>
            <button className='button-home' onClick={generateCreativeClick}>{props.text}</button>
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
                <button className='button-home' onClick={scriptClick}>{props.text}</button>
            ) : (
                <Link to={`/script`}>
                    <button className='button-home'>{props.text}</button>
                </Link>
            )}
        </next>
    );
}