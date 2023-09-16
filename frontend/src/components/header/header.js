import {useState} from 'react';
import "./header.css";

function Header({screen}){

        let b1='',b2='',b3='',b4='';
        switch (screen) {
                case 1: b1='selectBorder';break;
                case 2: b2='selectBorder';break;
                case 3: b3='selectBorder';break;
                case 4: b4='selectBorder';break;
        
                default: break;
        }

    return(
        <header id="header">
  
                  <div className="logoBox headerBoxLogo bord">
                      <h1 className="fontColor2 fontSize1">
                          script
                      </h1>
                      <h1 className="fontColor3 fontSize1">
                          ite
                      </h1>  
                  </div>
  
                  <div className={'headerBoxPage ' + b1}>
                    <div>
                            Etapa 1
                    </div>
                    <div>
                            Geração de criativos
                    </div>
  
                  </div>
                  <div className={'headerBoxPage ' + b2}>
                  <div>
                            Etapa 2
                    </div>
                    <div>
                           Geração de roteiro
                    </div>
                      
                  </div>
                  <div className={'headerBoxPage ' + b3}>

                  <div>
                            Etapa 3
                    </div>
                    <div>
                            Geração de storyboard
                    </div>
                      
                  </div>
                  <div className={'headerBoxPage ' + b4}>

                  <div>
                            Etapa 4
                    </div>
                    
                    <div>
                            Visualização final
                    </div>
                      
                  </div>
  
        </header>
    );

  } export default Header;
