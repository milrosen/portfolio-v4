export interface Expression {
    readonly kind: ExpressionKinds
    has_similar_operands: boolean
}

type ExpressionKinds = 'bexpr'|'atom'|'nexpr'|'qexpr'
type Operator = 'or'|'and'

export interface OExpr extends Expression {
    kind: 'bexpr'|'nexpr'|'qexpr'
    has_similar_operands: true
    operator: Operator
    operands: Expression[]
}

export interface NExpr extends OExpr {
    kind: 'nexpr'
}

export function make_nexpr(n: { operator: any; operands: any }): NExpr {
    return {
        kind: 'nexpr',
        operator: n.operator,
        operands: n.operands,
        has_similar_operands: true,
    }
} 

export interface BExpr extends OExpr {
    kind: 'bexpr'
    operands: [Expression, Expression]
    right: Expression
    left:  Expression
}

export function make_bexpr(o: { operator: Operator; operands: Expression[] }): BExpr {
    if (o.operands.length != 2) throw new Error(`cannot turn expresion with ${o.operands.length} operands into BExpr`) 
    return {
        kind: 'bexpr',
        operator: o.operator,
        right: o.operands[0],
        left: o.operands[1],
        operands: [o.operands[0], o.operands[1]],
        has_similar_operands: true
    }
}

export interface QExpr extends Expression {
    kind: 'qexpr'
    operands: [Expression, Expression, Expression, Expression]
    vertical_view(): BExpr
    horizontal_view(): BExpr
}

function is_quad_case(e1: Expression, e2: Expression): Boolean {
    if (e1.kind != 'atom' && e2.kind != 'atom') {
        return false
    } 

    const a1 = e1 as Atom
    const a2 = e2 as Atom

    return a1.positive != a2.positive && a1.literal.toLowerCase() === a2.literal.toLowerCase()
}

export function make_qexpr(q: { operands: Expression[] }): QExpr {
    const [lu, ru, ld, rd] = q.operands

    if (!is_quad_case(lu, rd) && !is_quad_case(ru, ld)) {
        throw new Error("variables not in quad case, use two BExprs instead!")
    }

    return {
        kind: 'qexpr',
        operands: [lu, ru, ld, rd],
        vertical_view: () => {
            return make_bexpr({
                operator: 'or',
                operands: [make_bexpr({
                    operator: 'and',
                    operands: [lu, ld]
                }), make_bexpr({
                    operator: 'and',
                    operands: [ru, rd]
                })]
            })
        },
        horizontal_view: () => {
            return make_bexpr({
                operator: 'and',
                operands: [make_bexpr({
                    operator: 'or',
                    operands: [lu, ru]
                }), make_bexpr({
                    operator: 'or',
                    operands: [ld, rd]
                })]
            })

        },
        has_similar_operands: false
    }
}

export interface Atom extends Expression {
    kind: 'atom'
    positive: Boolean
    literal: String
}

export function make_atom(a: string): Atom {
    return {
        kind: 'atom',
        positive: a === a.toUpperCase(),
        literal: a,
        has_similar_operands: false,
    }
}

function operator_height(o: Operator) {
    if (o == 'or')  {return (a:number, b:number) => a + b}
    return (a:number, b:number) => Math.max(a, b)
}


export function find_height(expression: Expression): number {
    if (expression.kind === 'atom') {
        return 1
    }

    if (expression.has_similar_operands) {
        const oexpr = expression as OExpr
        return oexpr.operands.map(find_height).reduce(operator_height(oexpr.operator))
    }

    if (expression.kind === 'qexpr') {
        const qexpr = expression as QExpr
        return Math.max(
            find_height(qexpr.operands[0]) + find_height(qexpr.operands[2]),
            find_height(qexpr.operands[1]) + find_height(qexpr.operands[3])
        )
    }
    return 1
}

function operator_width(o: Operator) {
    if (o == 'or') return (a:number, b:number) => Math.max(a, b)
    return (a:number, b:number) => a + b
}

export function find_width(expression: Expression): number {
    if (expression.kind === 'atom') {
        return 1
    }

    if (expression.has_similar_operands) {
        const oexpr = expression as OExpr
        return oexpr.operands.map(find_width).reduce(operator_width(oexpr.operator))
    }
    
    if (expression.kind === 'qexpr') {
        const qexpr = expression as QExpr
        return Math.max(
            find_height(qexpr.operands[0]) + find_height(qexpr.operands[1]),
            find_height(qexpr.operands[2]) + find_height(qexpr.operands[3])
        )
    }
    return 1
}

function allChildrenAreAtomic(nexpr: NExpr) {
    for(const child of nexpr.operands) {
        if (child.kind != 'atom') return false
    }
    return true
}

export function print_expression(direction="vertical", expression: Expression): string {
    if (expression.kind === 'atom') {
        const a = expression as Atom
        if (a.positive) {
            return a.literal.toUpperCase()
        } 
        return a.literal.toLowerCase()
    }

    if (expression.kind === 'nexpr') {
        const nexpr = expression as NExpr
        if (nexpr.operator === 'and' && allChildrenAreAtomic(nexpr)) {
            return nexpr.operands.map(r => {
                const a = r as Atom
                return a.literal
            }).join()
        }
    }

    if (expression.kind === 'qexpr') {
        const qexpr = expression as QExpr
        if (direction == 'vertical') {
            return print_expression(direction, qexpr.vertical_view())
        }
        return print_expression(direction, qexpr.horizontal_view())
    }

    if (expression.has_similar_operands) {
        const oexpr = expression as OExpr
        const op = oexpr.operator == 'and' ? '&' : '|'

        return "(" + oexpr.operands.map(print_expression.bind(null, direction)).join(` ${op} `) + ")"
    }

    return ''
}