import { useState } from 'react'
import './header.css'
import { FaCheckCircle } from 'react-icons/fa'

function Header({ screen }) {
  let b1 = '',
    b2 = '',
    b3 = '',
    b4 = '',
    i1 = '',
    i2 = '',
    i3 = '',
    i4 = ''
  switch (screen) {
    case 1:
      b1 = 'selectBorder'
      break
    case 2:
      b2 = 'selectBorder'
      i1 = 'finished'
      break
    case 3:
      b3 = 'selectBorder'
      i1 = 'finished'
      i2 = 'finished'
      break
    case 4:
      b4 = 'selectBorder'
      i1 = 'finished'
      i2 = 'finished'
      i3 = 'finished'
      break

    default:
      break
  }

  return (
    <header id="header">
      <div className="logoBox headerBoxLogo bord">
        <h1 className="fontColor2 fontSize1">script</h1>
        <h1 className="fontColor3 fontSize1">ite</h1>
      </div>

      <div className={'headerBoxPage ' + b1 + '' + i1}>
        <div>
          Etapa 1 <FaCheckCircle />
        </div>
        <div>Geração de criativo</div>
      </div>
      <div className={'headerBoxPage ' + b2 + '' + i2}>
        <div>
          Etapa 2 <FaCheckCircle />
        </div>
        <div>Geração de roteiro</div>
      </div>
      <div className={'headerBoxPage ' + b3 + '' + i3}>
        <div>
          Etapa 3 <FaCheckCircle />
        </div>
        <div>Geração de storyboard</div>
      </div>
      <div className={'headerBoxPage ' + b4 + '' + i4}>
        <div>
          Etapa 4 <FaCheckCircle />
        </div>
        <div>Visualização final</div>
      </div>
    </header>
  )
}
export default Header
