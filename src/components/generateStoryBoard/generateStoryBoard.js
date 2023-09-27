import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './generateStoryBoard.css';
import Header from '../header/header';
import {FaArrowRight, FaHourglassStart} from 'react-icons/fa'

import openai from '../common/openai'
import prompts from '../common/prompt'
const promptStoryBoard = prompts[2]

function Main() {
    const [creative, setCreative] = useState("")
    const [script, setScript] = useState("");
    const [urlImages, setUrlImages] = useState([]);
    const [scenesPrompt, setScenesPrompt] = useState([]);
    const [concatenatedImages, setConcatenatedImages] = useState("");
    const [buttonGenerate, setButtonGenerate] = useState("Gerar story board")
    const [generatedContent, setGeneratedContent] = useState(false)
    const [firstContent, setFirstContent] = useState(true)

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('hbp1').classList.remove('selectBorder');
        document.getElementById('hbp2').classList.add('selectBorder');
        document.getElementById('hbp3').classList.remove('selectBorder');
        document.getElementById('hbp4').classList.remove('selectBorder');  
    });

    return (
        <main className>

            <Header screen={3}/>

            <div className='bodyCreative'>
                <div className='creativeBox boxScript'>

                    <h1 className='titleRoteiro'>
                        Roteiro
                    </h1>

                    <ShowScript
                        setCreative={setCreative}
                        script={script}
                        setScript={setScript}/>

                    {firstContent && <GenerateButton
                        input={script}
                        urlImages={urlImages}
                        setImagesUnit={setUrlImages}
                        setImages={setConcatenatedImages}
                        scenes={scenesPrompt}
                        setScenes={setScenesPrompt}
                        setButton={setButtonGenerate}
                        content={generatedContent}
                        setContent={setGeneratedContent}
                        setFirstContent={setFirstContent}
                        text={buttonGenerate}/>}
                </div>
                <div className='icon'>
                   <FaArrowRight />
                </div>
                <div className='creativeBox boxScript'>
                    
                    <h1 className='titleRoteiro'>
                        Storyboard
                    </h1>

                    <ShowStoryBoard text={concatenatedImages}/>
                    <div id="obc21" style={{ marginTop: '30px' }}>
                        {generatedContent && <ResultsPageButton
                            creative={creative}
                            script={script}
                            storyBoard={concatenatedImages}
                            text={"Próxima etapa"}/>}
                    </div>

                    <div id="tempText" style={{ marginTop: '200px' }}>
                        <FaHourglassStart />
                        Clique em gerar e aguarde.
                    </div>
                    
                </div>
            </div>
            <div className=" footer fontColor4">
                Copyright © 2023 | Todos os direitos reservados
            </div>
        </main>
    );
}
export default Main;

function GenerateButton(props) {

    async function generateStoryBoardClick() {

        if (!props.content) {
            document.getElementById('tempText').remove();
        }

        let updatedStoryBoard = ""
        try {
            props.setFirstContent(false)
            props.setContent(false)
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
                    //props.setImages(updatedStoryBoard)
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
            
            props.setFirstContent(true)
            props.setContent(true)
            props.setButton("Gerar Novamente")

        } catch (err) {
            props.setFirstContent(true)
            console.error(err);
            alert(err);
        }
    }

    return (
        <generate>
            <button className='storyButton' onClick={generateStoryBoardClick}>{props.text}</button>
            <div>{props.script}</div>
        </generate>
    );
}

function ShowScript(props) {
    const location = useLocation();
    const infos = location.state?.infos;
    const script = infos[1];
    
    useEffect(() => {
        props.setCreative(infos[0])
        props.setScript(infos[1]);
    }, [props]);

    return (
        <div className="showScript1">
            {script.split('<br />').map((line, index) => {
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

function ShowStoryBoard(props) {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
    };

    const validUrls = props.text.split('<br><br>').filter(url => url.startsWith('http'));

    return (
        <div className= "inputBox" style={{ textAlign: 'center'}}>
            <Slider {...settings}>
                {validUrls.map((url, index) => (
                    <div key={index} onClick={() => (url)}>
                        <img src={url} alt={`Imagem ${index}`}  style={{ maxWidth: '90%', height: 'auto' }} />
                    </div>
                ))}
            </Slider>
        </div>
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
            <button className='storyButton' onClick={handleResultsPage}>{props.text}</button>
        </next>
    );
}