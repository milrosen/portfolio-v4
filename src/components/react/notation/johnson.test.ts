import { expect, test } from 'vitest';
import { parse_johnson, find_vertical_split, find_horizontal_split } from './parse_johnson';
import { find_height, find_width } from './expression';

test('johnson', () => {
    expect(parse_johnson(['A','-', 'a'])).toEqual({ operator: 'or', 
        left: { literal: 'A', positive: true }, 
        right: { literal: 'a', positive: false } });
})

test('johnson2', () => {
//  C | B
//    | a
//  --|--
//  Ab| c

    const formula = ["C | B", "  | a", "--|--", "Ab| c"]
    expect(parse_johnson(formula)).toEqual({ 
    operator: 'and', 
        left: { operator: 'or', 
            left: { literal: 'C', positive: true }, 
            right: { 
                operator: 'and',
                operands: [{ literal: 'A', positive: true }, { literal: 'b', positive: false }]
             } }, 
        right: { operator: 'or', 
            left: { 
                operator: 'or',
                operands: [{ literal: 'B', positive: true }, { literal: 'a', positive: false }]
             }, 
            right: { literal: 'c', positive: false } } });
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