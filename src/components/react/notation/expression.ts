export type Expression = ManyExpr|BinaryExpr|AtomicExpr

type ManyExpr = {
    operator: 'or'|'and'
    operands: Expression[]
    literal?: never
    positive?: never
    left?: never
    right?: never
}

type BinaryExpr = {
    operator: 'or'|'and'
    left: Expression
    right: Expression
    literal?: never
    positive?: never
    operands?: never
}

type AtomicExpr = {
    literal: string
    positive: boolean
    operator?: never
    operands?: never
    left?: never
    right?: never
}

export function find_height(expression: Expression): number {
    if (expression.literal != null) {
        return 1
    }

    if (expression.operands != null) {
        if (expression.operator == 'or') {
            return expression.operands.map(find_height).reduce((a, b) => a + b)
        }

        if (expression.operator == 'and') {
            return expression.operands.map(find_height).reduce((a, b) => Math.max(a, b))
        }
    }

    if (expression.right != null && expression.left != null && expression.operator == 'or') {
        return find_height(expression.left) + find_height(expression.right)
    }
    if (expression.right != null && expression.left != null && expression.operator == 'and') {
        return Math.max(find_height(expression.left), find_height(expression.right))
    }

    return 1
}

export function find_width(expression: Expression): number {
    if (expression.literal != null) {
        return 1
    }

    if (expression.operands != null) {
        if (expression.operator == 'and') {
            return expression.operands.map(find_width).reduce((a, b) => a + b)
        }

        if (expression.operator == 'or') {
            return expression.operands.map(find_width).reduce((a, b) => Math.max(a, b))
        }
    }

    if (expression.right != null && expression.left != null && expression.operator == 'and') {
        return find_width(expression.left) + find_width(expression.right)
    }
    if (expression.right != null && expression.left != null && expression.operator == 'or') {
        return Math.max(find_width(expression.left), find_width(expression.right))
    }

    return 1
}

export function print_expression(expression: Expression): string {
    if (expression.literal != null) {
        return expression.literal
    }

    if (expression.operands != null) {
        if (expression.operator == 'or') {
            return `(${expression.operands.map(print_expression).join(' | ')})`
        }

        if (expression.operator == 'and') {
            return `(${expression.operands.map(print_expression).join(' & ')})`
        }
    }

    if (expression.right != null && expression.left != null && expression.operator == 'or') {
        return `(${print_expression(expression.left)} | ${print_expression(expression.right)})`
    }
    if (expression.right != null && expression.left != null && expression.operator == 'and') {
        return `(${print_expression(expression.left)} & ${print_expression(expression.right)})`
    }

    return ''
}