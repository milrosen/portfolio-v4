import React, { useEffect, useRef, useState, type TextareaHTMLAttributes } from 'react'
import { parse_johnson, JohnsonParseError } from './parse_johnson'
import { find_height, find_width, print_expression, type Expression, type Atom, type QExpr, type NExpr, type BExpr, is_cnf, is_dnf, perform_johnson_simplification_step, is_clause, is_conjunction_clause } from './expression'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'


export default function johnson(props: { text: string }) {
    const [text, setText] = useState(props.text)
    const [viewFormula, setViewFormula] = useState(true)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [direction, setDirection] = useState('vertical')
    const [formula, setFormula] = useState(parse_johnson(props.text.split("\n")))

    useEffect(() => {
        try {
            const f = parse_johnson(text.split('\n'))
            setFormula(f)
            // console.log(perform_johnson_simplification_step(f))
            setError(false)
        } catch (_e) {
            const e = _e as JohnsonParseError
            setError(true)
            setErrorMessage(e.message)
        }
    }, [text])

  return (
    <>{viewFormula ? 
    <div onClick={() => {
        setViewFormula(false)
        }}>
        <DisplayJohnson formula={formula}/>
    </div>
    
    : <textarea 
        id='formula_input_id'
        ref={textAreaRef}
        style={{
            ...style_textarea,
            ...error ? error_style : {}
        }}
        onChange={(e) =>  {
            setText(e.target.value)
        }}
        onKeyDown={(e) => {
            if (e.key == 'Enter') {
                e.preventDefault()
                const pos = textAreaRef.current?.selectionStart
                if (pos == undefined) return
                let newText = text.slice(0, pos) + "\n" + text.slice(pos)
                if (newText == undefined) newText = text + "\n"

                setText(newText)
            }
            
        }}
        onBlur={() => {
            if (error) {
                textAreaRef.current?.focus()
            } else {
                setViewFormula(true)
            }
        }}
        autoFocus
        value={text}>
    </textarea>}
    {error ? 
        <Tooltip anchorSelect='#formula_input_id'>{errorMessage}</Tooltip> 
    : <button onClick={() => setFormula(perform_johnson_simplification_step(formula))}>Perform Simplification Step</button>}
    
    <div>{print_expression(direction, formula)}</div>
    </>
  )
}

const error_style = {
    borderRadius: "3px",
    boxShadow: '0px 0px 0px 3px red, 0px 0px 0px 1px white',
    outline: 'none',
    border: '2px solid white',
}

const style_textarea = {
    width: '100%',
    height: '300px'
}

function DisplayJohnson({formula}: {formula: Expression}) {
    if (formula.kind === 'atom') {
        const atom = formula as Atom 
        return (
            <div>{atom.literal}</div>
        )
    }

    if (formula.kind === 'qexpr') {
        const qexpr = formula as QExpr
        const [ru, ul, ld, rd] = qexpr.operands
        return (
            <div style={style_quad}>
                <div style={grid_item}>
                    <div style={{padding: grid_variables.GAP}}>
                        {DisplayJohnson({formula: ru})}
                    </div>
                </div>
                <div style={grid_item}>
                    <div style={{padding: grid_variables.GAP}}>                        
                        {DisplayJohnson({formula: ul})}
                    </div>
                </div>
                <div style={grid_item}>
                    <div style={{padding: grid_variables.GAP}}>                        
                        {DisplayJohnson({formula: ld})}
                    </div>
                </div>
                <div style={grid_item}>
                    <div style={{padding: grid_variables.GAP}}>                        
                        {DisplayJohnson({formula: rd})}
                    </div>
                </div>
            </div>
        )
    }

    if (formula.kind === 'bexpr') {
        const bexpr = formula as BExpr
        const vertical = bexpr.operator == 'or'
        const line_style = vertical ? horizontal_line : vertical_line 
        const direction_style = vertical ? style_johnson_vertical : style_johnson_horizontal
        return (
            <div style={direction_style}>
                {DisplayJohnson({formula: bexpr.right})}
                <div style={line_style}/>
                {DisplayJohnson({formula: bexpr.left})}
            </div>
        )
    }

    if (formula.kind === 'nexpr') {
        const nexpr = formula as NExpr
        const vertical = nexpr.operator == 'or'
        let line_style = vertical ? horizontal_line : vertical_line 
        if (is_clause(formula) || is_conjunction_clause(formula)) line_style = invisible
        const direction_style = vertical ? style_johnson_vertical : style_johnson_horizontal
        return (
            <div style={direction_style}>
                {nexpr.operands.map((op, i) => 
                   (<>
                    {i === 0 ? <></> : <div style={line_style}></div>}
                    {DisplayJohnson({formula: op})}
                    </>))}
            </div>
        )
    }
        
}

const grid_variables = {
    GAP: '10px',
    LINE_OFFSET: '1em',
    LINE_THICKNESS: '1px',
    LINE_COLOR: 'black',
}

const vertical_line = {
    display: 'block',
    width: grid_variables.LINE_THICKNESS,
    backgroundColor: grid_variables.LINE_COLOR,
}

const invisible = {
    display: 'none',
    width: '0px',
    backgroundColor: 'white'
}

const horizontal_line = {
    display: 'block',
    height: grid_variables.LINE_THICKNESS,
    backgroundColor: grid_variables.LINE_COLOR, 
    width: '100%'
}

type flexDirection = 'row' | 'column'

const style_johnson_vertical = {
    display: 'flex',
    flexDirection: 'column' as flexDirection,
    gap: grid_variables.GAP,
}

const style_quad = {
    display: 'grid',
    gridTemplateColumns: "1fr 1fr",
    backgroundColor: grid_variables.LINE_COLOR,
    gap: grid_variables.LINE_THICKNESS,
    overflow: 'hidden',
}

const grid_item = {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
}
const style_johnson_horizontal = {
    display: 'flex',
    flexDirection: 'row' as flexDirection,
    gap: grid_variables.GAP
}
