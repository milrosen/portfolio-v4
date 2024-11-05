import React, { useRef, useState } from 'react'
import { parse_johnson } from './parse_johnson'
import { find_height, find_width, type Expression } from './expression'

export default function johnson() {
    const [text, setText] = useState(`C | B
  | a
-----
Ab| c`)
    const [viewFormula, setViewFormula] = useState(true)

    const formula = parse_johnson(text.split('\n'))

  return (
    <>{viewFormula ? 
    <div onClick={() => {
        setViewFormula(false)
        }}>
        <DisplayJohnson formula={formula}/>
    </div>
    
    : <textarea 
        style={style_textarea}
        onChange={(e) =>  setText(e.target.value)}
        onBlur={() => setViewFormula(true)}
        autoFocus
        value={text}>
    </textarea>}</>
  )
}

const style_textarea = {
    width: '100%',
    height: '300px'
}

function DisplayJohnson({formula}: {formula: Expression}) {
    const vertical = formula.operator == 'or'
    const direction_style = vertical ? style_johnson_vertical : style_johnson_horizontal
    const line_style = vertical ? horizontal_line : vertical_line

    return (
        <>
        {formula.literal != null && <div>{formula.literal}</div>}

        {formula.left != null && 
        <div style={direction_style} >
            <div style={{flex: 1}}>
                <DisplayJohnson formula={formula.left}/>
            </div>
            <div style={line_style}/>
            <div style={{flex: 1}}>                
                <DisplayJohnson formula={formula.right} />
            </div>
        </div>}
        
        {formula.operands != null &&
        <div style={direction_style}>
         {formula.operands.map((operand) => <DisplayJohnson formula={operand} />)}
        </div>
         }
        </>
    )
}

const vertical_line = {
    display: 'block',
    width: '1px',
    backgroundColor: 'black'
}

const horizontal_line = {
    display: 'block',
    height: '1px',
    backgroundColor: 'black'
}

const style_johnson_vertical = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'

}

const style_johnson_horizontal = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px'
}
