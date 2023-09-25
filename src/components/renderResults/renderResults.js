import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import './renderResults.css'
import Header from '../header/header';


function Main() {
    const [creative, setCreative] = useState("")
    const [script, setScript] = useState("");
    const [storyBoard, setStoryBoard] = useState("");

    const location = useLocation();
    const infos = location.state?.infos;
    
    React.useEffect(() => {
      setCreative(infos[0]);
      setScript(infos[1]);
      setStoryBoard(infos[2]);
    }, [infos]);

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('hbp1').classList.remove('selectBorder');
        document.getElementById('hbp2').classList.remove('selectBorder');
        document.getElementById('hbp3').classList.remove('selectBorder');
        document.getElementById('hbp4').classList.add('selectBorder');  
    });

    return (
        <div className="">
            <Header screen={4}/>

            <div className='bodyCreative backgroundColor1 renderBody'>
                <div className="creativeBoxResult">
                    <h1 class="text-center text-xl">CRIATIVO</h1>
                    <div className='cb1' >
                        <ShowCreative creative={creative}/>
                    </div>
                </div>
            </div>
            <div className='bodyCreative backgroundColor1 renderBody'>
                <div className="creativeBoxResult">
                    <h1 class="text-center text-xl mb-5">SCRIPT</h1>
                    <div className='cb1' >
                        <ShowScript script={script}/>
                    </div>
                </div>
            </div>
            <div className='bodyCreative backgroundColor1 renderBody'>
                <div className="creativeBoxResult">
                    <h1 class="text-center text-xl mb-5">STORY BOARD</h1>
                    <div>
                        <ShowStoryBoard storyBoard={storyBoard}/>
                    </div>
                </div>
            </div>
            <div className="footer fontColor4">
                Copyright © 2023 | Todos os direitos reservados
            </div>
        </div>

    );
}
export default Main;

function ShowCreative(props) {
    const creative = props.creative
    const creativeParts = creative.split('<br /><br />')
    const paragraphs = []
  
    if (creativeParts.length > 1) {
      creativeParts.forEach(element => {
        const [key, value] = element.split(': ')
  
        if (key.localeCompare('Criativo 1') !== 0) {
          paragraphs.push(
            <div class="text-left">
              <label className="titulo">{key}:</label>
              <p className="valor input">{value}</p>
            </div>
          )
        }
      })
    }
  
    return (
      <creative>
        <div class="flex flex-col items-center">{paragraphs}</div>
      </creative>
    )
}

function ShowScript(props) {
    const scriptLines = props.script.split('<br />');
    
    return (
      <div>
        {/* falta descobrir como aumentar esse valor input */}
      {/* </div><div className="valor input"> */}
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

function ShowStoryBoard(props) {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
    };

    const validUrls = props.storyBoard.split('<br><br>').filter(url => url.startsWith('http'));

    return (
        <div className= "">
            <Slider {...settings}>
                {validUrls.map((url, index) => (
                    <div key={index} onClick={() => (url)}>
                        <img src={url} alt={`Imagem ${index}`}  style={{ maxWidth: '70%', height: 'auto' }} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}