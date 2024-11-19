import { type Expression, type BExpr, make_bexpr, make_atom, make_nexpr, make_qexpr } from "./expression";
// idea: write the expression literaly in ascii art
// so, for the first test we could just have Aa = A /\ -A
// but then equally validly it could be
//  C | B
//    | a
//  -----
//  Ab| c

export class JohnsonParseError extends Error {
    constructor(message: string) {
        super(message)
    }
}

function inconsistent_length(formula: string[]) {
    const len = formula[0].length

    for (const line of formula) {
        if (line.length != len) return true
    }
    return false
}

// parsing is then just trying to find a continuous horizontal line of -s or a vertica line of |s
// when we don't have any more, we just have a many, atomic, or binary expresson leftover
export function parse_johnson(formula: string[]): Expression {
    if (inconsistent_length(formula)) throw new JohnsonParseError("inconsistent line length")
    
    const horizontal_split = find_horizontal_split(formula)
    const vertical_split = find_vertical_split(formula) 
    
    if (horizontal_split != -1 && vertical_split != -1) {
        let [left, right] = split_vertical(formula, vertical_split)
        let left_up = left.slice(0, horizontal_split)
        let left_down = left.slice(horizontal_split+1)
        let right_up = right.slice(0, horizontal_split)
        let right_down = right.slice(horizontal_split+1)

        const operands = [left_up, right_up, left_down, right_down].map(parse_johnson)
        
        return make_qexpr({
            operands: operands
        }) 
    }

    if (horizontal_split != -1) {
        return make_bexpr({
            operator: 'or',
            operands: [
                parse_johnson(formula.slice(0, horizontal_split)), 
                parse_johnson(formula.slice(horizontal_split + 1))
            ],
        })
    }

    if (vertical_split != -1) {
        let [left, right] = split_vertical(formula, vertical_split)
        return make_bexpr({
            operator: 'and',
            operands: [parse_johnson(left), parse_johnson(right)]
        })
    }

    // now we know the formula is something like ["  ", " A", " B"] or ["ABC", "   "]
    // all of the letters are in the same direction, we want to return an atomic expression
    // if there is a single letter, and a many or or and expression if there are multiple
    formula = formula.map(line => line.trim()).filter(line => line.length > 0)
    if (formula.length == 1) {
        if (formula[0].length == 1) {
            return parse_literal(formula[0])
        } else {
            return make_nexpr({ operator: 'and', operands: formula[0].split('')
                .map(char => { return parse_literal(char) }) })
        }
    }
    return make_nexpr({operator: 'or', operands: formula.map(line => { return parse_literal(line) })})
}

function parse_literal(line: string) {
    // ascii only, if not, probably has some spacing issues.
    // very difficult to determine which, but easy to just throw error
    if (line.includes('-') || line.includes('|')) throw new JohnsonParseError(`variable name: ${line} contains special layout characters. Perhaps your lines aren't aligned`)
    return make_atom(line)
}

function split_vertical(formula: string[], idx: number) {
    let left = []
    let right = []

    for (let i = 0; i < formula.length; i++) {
        left.push(formula[i].slice(0, idx))
        right.push(formula[i].slice(idx + 1))
    }

    return [left, right]
}

export function find_vertical_split(formula: string[]) {
    let possible_cols = [...Array(formula[0].length).keys()]

    for (let line of formula) {
        if (possible_cols.length == 0) {
            return -1
        }
        possible_cols = possible_cols.filter((x) => line[x] == '|' || line[x] == '+')
    }

    if (possible_cols.length == 1) { 
        return possible_cols[0]
    }

    return -1
}

export function find_horizontal_split(formula: string[]) {
    return formula.findIndex(line => line.match(/^-*\+?-*$/) != null)
}