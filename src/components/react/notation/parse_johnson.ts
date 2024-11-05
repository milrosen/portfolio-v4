// @ts-nocheck

import type { Expression } from "./expression";
// idea: write the expression literaly in ascii art
// so, for the first test we could just have Aa = A /\ -A
// but then equally validly it could be
//  C | B
//    | a
//  -----
//  Ab| c

// parsing is then just trying to find a continuous horizontal line of -s or a vertica line of |s
// when we don't have any more, we just have a many, atomic, or binary expresson leftover
export function parse_johnson(formula: string[]): Expression {
    
    const horizontal_split = find_horizontal_split(formula)

    if (horizontal_split != -1) {
        return (
            {
                operator: 'or',
                left: parse_johnson(formula.slice(0, horizontal_split)),
                right: parse_johnson(formula.slice(horizontal_split + 1))
            }
        )
    }

    const vertical_split = find_vertical_split(formula) 
    if (vertical_split != -1) {
        let [left, right] = split_vertical(formula, vertical_split)
        return (
            {
                operator: 'and',
                left: parse_johnson(left),
                right: parse_johnson(right)
            }
        )
    }

    // now we know the formula is something like ["  ", " A", " B"] or ["ABC", "   "]
    // all of the letters are in the same direction, we want to return an atomic expression
    // if there is a single letter, and a many or or and expression if there are multiple
    formula = formula.map(line => line.trim()).filter(line => line.length > 0)
    if (formula.length == 1) {
        if (formula[0].length == 1) {
            return parse_literal(formula[0])
        } else {
            return { operator: 'and', operands: formula[0].split('')
                .map(char => { return parse_literal(char) }) }
        }
    }
    return {operator: 'or', operands: formula.map(line => { return parse_literal(line) })}
}

function parse_literal(line: string) {
    return { literal: line, positive: line.toUpperCase() == line }
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
        possible_cols = possible_cols.filter((x) => line[x] == '|')
    }

    if (possible_cols.length == 1) { 
        return possible_cols[0]
    }

    return -1
}

export function find_horizontal_split(formula: string[]) {
    return formula.findIndex(line => line.match(/^-+$/) != null)
}