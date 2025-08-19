import { expect, test } from 'vitest';
import { use } from 'chai';
import chaiExclude from 'chai-exclude'
use(chaiExclude)
import { parse_johnson, find_vertical_split, find_horizontal_split } from './parse_johnson';
import { find_height, find_width, make_atom, make_bexpr, make_nexpr, make_qexpr } from './expression';

test('johnson', () => {
    expect(parse_johnson(['A','-', 'a'])).toEqual(make_bexpr({ 
        operator: 'or', 
        operands: [make_atom("A"), make_atom('a')]
    }))
})

test('qexpr_parse', () => {
    const formula = ["a|b","-+-","c|d"]
    const hsplit = find_horizontal_split(formula)
    const vsplit = find_vertical_split(formula)
    
    expect(vsplit).toEqual(1)
    expect(hsplit).toEqual(1)
})

test('johnson2', () => {
//  C | B
//    | a
//  --|--
//  Ab| c

    const formula = ["C | B", "  | a", "--|--", "Ab| c"]
    expect(parse_johnson(formula)).toEqual(
        make_bexpr({
        operator: "and",
        operands: [
            make_bexpr({
                operator: "or",
                operands: [
                    make_atom("C"),
                    make_nexpr({
                        operator: "and",
                        operands: [
                            make_atom("A"),
                            make_atom("b")
                        ]
                    })
                ]
            }),
            make_bexpr({
                operator: "or",
                operands: [
                    make_nexpr({
                        operator: "or",
                        operands: [
                            make_atom("B"),
                            make_atom("a")
                        ]
                    }),
                    make_atom("c")
                ]
            })
        ]
    }))
})

test('qexpr', () => {
    const formula = ["C | B", "  | a", "--+--", "Ab| c"]

    const parsed = parse_johnson(formula)
    
    expect(parsed).excluding(["vertical_view", "horizontal_view"]).to.eql(make_qexpr({
        operands: [
            make_atom("C"),
            make_nexpr({
                operator: 'or',
                operands: [
                    make_atom("B"),
                    make_atom("a")
                ]
            }),
            make_nexpr({
                operator: 'and',
                operands: [
                    make_atom("A"),
                    make_atom("b")
                ]
            }),
            make_atom("c")
        ]
    }))
}) 

test('height', () => {
    
    const formula = ["C | B", "  | a", "--|--", "Ab| c"]
    const parsed = parse_johnson(formula)

    expect(find_height(parsed)).toEqual(3);
})

test('width', () => {
    const formula = ["C | B", "  | a", "--|--", "Ab| c"]
    const parsed = parse_johnson(formula)

    expect(find_width(parsed)).toEqual(3);
})

test('vertical', ()  => {
    expect(find_vertical_split(['C|B'])).toEqual(1); 
})

test('horizontal', () => {
    expect(find_horizontal_split(['a|b', '---', 'a|b'])).toEqual(1);
})