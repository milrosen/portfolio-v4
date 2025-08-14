---
draft: "true"
pubDate: Jul 06 2025
description: ""
title: Johnson Formulas
---
So, the goal here is to write down the inference rules for his proofs, put down some examples of solving formulas, and maybe some stuff on what resolution proofs are used for. I wonder what a tautology/unsat formula would look like in Johnson's notation, and if the inverse problem helps out with anything. What does resolution look like structurally in these graphs?

Questions about if $F \rightarrow C$ is there a johnson proof that has $C$ as a vertical slice. 
Why are they the same inference rule

Resolution

Peirce and Venn

## Background
Johnson was a logician from the 1880s-1910s, he wrote about the topics that were common at the time, making contributions to the development of first order logic, probability theory, and propositional logic. He is most noteworthy for developing a 2D notational system for propositional formulas that was capable of solving Jevon's inverse problem: given a series of conclusions (a formula in DNF), create a series of "rules" (statements of equivalence or implication) that are equivalent to those conclusions. For Jevon's, this problem had immediate implications for probability theory, though I do not understand how to engage with debates in probability theory that are so far before the Kolmogorov axioms, they don't make much sense to me.

Johnson's system is interesting even outside of his two dimensional notational system. He had strong beliefs that all meaningful facts were positive only, which implied that they could only be conjunctions of variables. Further, meaningful logical statements were either affirmations or denials of some facts. Since negation and conjunction form a complete set, Johnson stops here, and switches to show that every other classical connective can be defined with this complete set. He also has an interesting argument about disjunction, namely, that the somewhat odd behavior wrt natural language (would you like coffee or tea) is more naturally expressed as the equivalent in his and/not system ($\neg(\neg A \wedge \neg B) = A \vee B$), which might be rendered as "it is not the case that both of these are false" or, "at least one of these facts *must* be true." This is a pretty big aside, but I remember some students being surprised that $\exists$ is related to $\vee$, but I feel like the Johnson system makes this pretty clear.

# 1D Notation

The first notational system he uses is the simplest, and expresses his conjunction/negation only version of logic. Five rules from part one:

$$
\begin{array}{rlrcl}
I.&\text{Commutative:}&xy&=&yx\\
II.&\text{Associative:}&xy.z&=&x.yz\\
III.&\text{Tautology:}&xx&=&x\\
IV.&\text{Reciprocity:}&\bar{\bar{x}}&=&x\\
V.&\text{Dichotomy:}&\bar{x}&=&\overline{xy}\ \overline{x\smash{\bar{y}}\vphantom{s}}
\end{array}
$$
These rules, combined with a rule for contradiction form a propositionally complete proof system (according to him)

In the next paper, he introduces quantification and adds disjunction as a primitive.

$$
\begin{array}{lccl}
\text{Conjunction}&a \mathrel. b \\
\text{Disjunction}& a \dot{\phantom{x}\ } b\\
\text{Partial Equivalence}& a = \dots b\\
&                           a =\stackrel{\dots}{\phantom{x}} b
\end{array}
$$
Partial equivalence is a little weird, it is used to mean that you are missing some of the elements of a disjunction or conjunction. Partial equivalence with conjunction essentially means that $a \rightarrow b$, since whenever $a$ is true, the entire conjunction on the right must also be true, including $b$. For the same reason, disjunction means $a \leftarrow b$. 

For quantification, his notation is an alternative for writing out variables explicitly. Which variables are applied to which predicates is not left explicit, but it shows an interesting connection to conjunction and disjunction. 

$$
\begin{array}{lrcl}
1)&\exists m. p(m) &=& \dot{m}p\\
2)&\forall m. p(m) &=& \underset{\Large{^\boldsymbol\cdot}}{m}p\\
3)&\forall m. p(m)\mathrel.q(m) &=& \underset{\Large{^\boldsymbol\cdot}}{m}(p \mathrel. q)_m
\end{array}
$$


In cases like the last one, we can differentiate between where the brackets are by writing: 
$$
\begin{array}{rcl}
4)&\exists m.p(m)\mathrel.q(m) &=& \dot{m}(p \mathrel. q)_m \\\\
5)&\exists m. p(m) \mathrel. \exists m .q(m) &=& \dot{m}p \mathrel . \dot{m}q
\end{array}
$$
And finally, if we need to distinguish between the order of variables applied to a predicate, we can add subscripts. So if $l$ is 'loves,' we would write $\exists m . \forall n. l(n, m)$ as $\dot{m}\underset{\Large{^\boldsymbol\cdot}}{n}l_{nm}$ and $\forall m. \exists n. l(m, n)$ as $\underset{\Large{^\boldsymbol\cdot}}{m}\dot{n}l_{mn}$ in the classic "someone is loved by everyone" vs "everyone is loved by someone" examples

The standard rules for inference seem to apply here, but there are no real examples of forall elimination, or any of the other "standard" fitch-style rules. I am not exactly sure how we would reason with these, since a system is not really suppled. It seems like he is mostly arguing for and against narrow ways that we should regard them.  A fun project might be to peace together what exactly his disagreement with Venn and Peirce are.

We have all of the standard associative and commutative laws, as well as the standard rules for switching the order of computation. It seems like the partial equivalence laws are where the elimination rules are present, like we can go from $\underset{\Large{^\boldsymbol\cdot}}{m}p = \dots m_np$, but it is unclear if we could ever have $\underset{\Large{^\boldsymbol\cdot}}{m}p$ as the result of an inference.

It's hard to tell if his system for quantifications is complete, I would need to sit down and work out some proofs, and I'm not sure if that is the direction that we are headed in. It seems more likely to me that it is than not, but difficult to tell since most axiomizations of fol are done with implication and negation, rather than conjunction and negation. If complete, though, it should not be too hard to show that I could derive the three hilbert axioms for universal quantification with his system.

# 2D Notation

I'm using some of my older notes from this section last time I wrote it up. The previous notes supplied by the other student were very complete, and I am not sure where we would want to take this project further. I have two ideas, though. First, when Jevons proposed the inverse problem, he did so as part of his research into probability. I don't know much about the debates on probability that were pre-Kolmogorov, but from the sections on probability I read, it seems interesting enough to get something out of expanding upon the relationship between the inverse problem an probability. Second, I think it could be interesting to compare Johnson's use of resolution (which is also the inference rule in the 1D systems) to more modern resolution. 

Modern day resolution isn't about solving the inverse problem, or even that common in philosophy of logic (as far as I know), it is used to show that a certain CNF formula is unsatisfiable (or, as a counter example, to find a formula that satisfies a particular CNF). I wonder if there is something more explicitly algorithmic inside of the Johnson formulas that could be used for this purpose (in a more abstract way, it is unlikely that this would be faster than even DPLL, but I would like to find out if there is a particular way that unsatisfiable formulas look when they have been Johnson-ified)

Some of the other questions in the paper that were unanswered: are Johnson representations always "minimal" in terms of number of implications, why or why not, and a more explicit axiomatization for resolution (either by showing its equivalence with a classical Hilbert system or some other means), would also be interesting directions to take the project.

## Johnson's System

In Johnsons system, formulas aren't confined to a single dimension, but instead are able to express their relations in 2D space. Two variables are placed on top of each other to represent $A+B$ and adjacent to each other to represent $AB$ (hence the boolean notation). So, for example, if we wanted to write the CNF formula from earlier, we could write it as: 

$$
\begin{array}{c}
BC \\ \hline
aC \\ \hline
Abc \\
\end{array}
$$

To see how to transform formulas, it's easier to start with simpler examples. For instance, going from $AB + AC$ to $A(B + C)$ is very straightforward in Johnson notation:
$$
\begin{array}{ccccc}
\begin{array}{cc}
AB \\ \hline
AC
\end{array} &
\rightarrow &
\begin{array}{c|c}
A & B \\ \hline
A & C
\end{array} & \rightarrow &
\begin{array}{c|c}
A & \begin{array}{c} B \\ C \end{array}
\end{array}
\end{array}
$$
And it's easy to see that going back is just as straightforward. The middle step can be eliminated, but I feel like including it makes the distribution more clear, as well as getting us to the most interesting part of Johnson formulas. 

The cross in the center of the middle formula might've struck you as quite strange, since it's no longer obvious what order of operations we are representing. The formula could faithfully be rendered as $AB+AC$ or as $(A+A)(B+C)$. In this case, the two are exactly equivalent, but in general, $XY + ZW \not= (X+Z)(Y+W)$. The above special case, $X=Z$ isn't very interesting, but the equality *also* holds when $X=\neg W$, so $XY + Zx = (X+Z)(x+Y)$ $=$ $Xx + XY + Zx + ZY$ $=$ $XY + xZ + ZY$, and then we can note that $ZY \rightarrow XY + xZ$, so the $ZY$ term is redundant. This mini-proof means that this unique quad-formula really doesn't have to worry about parenthesis, unlocking a unique and powerful way to reduce formulas, expressible only in two dimensions.
$$
\begin{array}{c|c}
X & Y \\ \hline
Z & x
\end{array}
$$
We can now represent both equivalent formulas at the exact same time, freely switching between the two interpretations whenever. Additionally, it makes reading off the implications very easy and semantically meaningful, in this case, those would be $x \rightarrow Z$ and $y \rightarrow x$. 

The sheer convenience of Johnson notation might not be obvious yet, but we can try a longer example, and hopefully the ease of translating between one formula to the next becomes obvious. We will stick with the same general task, going from a DNF formula and trying to turn it into a set of implication relations.

$$
\begin{array}{ccc}
\begin{array}{c}
ABC \\ \hline
BCD \\ \hline
aBc \\ \hline
BcD \\ \hline
AbD \\ \hline
abCd
\end{array} & = &
\begin{array}{c}
BCA \\ \hline
BCD \\ \hline
Bac \\ \hline
BDc \\ \hline
ADb \\ \hline
Cdab
\end{array} & = &
\begin{array}{c|c}
B & \begin{array}{c}
CA \\ \hline
CD \\ \hline
ac \\ \hline
Dc \\ 
\end{array} \\ \hline
\begin{array}{c}
AD \\ \hline
Cad
\end{array} & b
\end{array}
\end{array}
$$
$$
= \begin{array}{c|c}
B & 
	\begin{array}{c|c} 
		C  & \begin{array}{c} A\\ D\end{array} \\ \hline
		\begin{array}{c} a \\ D \end{array}& c
	\end{array} \\ \hline
\begin{array}{c|c}
A & D \\ \hline
Cd & a
\end{array} & b
\end{array}
$$

In the first step, we went line-by-line, finding the most common variable, either positive or negative, in this case, $B$, which is present in every single clause in the formula. Next, we shifted it to the right if it was positive, and left if it was negative. Then, we performed the same operation the remaining clauses and variables in the rest of the formula, realizing that in the $B$ formulas, $C$ appeared either positively or negatively in each, and then shifted $C$ as far left as it could go before hitting $B$ and $c$ to the right. We did the exact same thing with $A$ in the bottom left subformula. 

After reordering the variables, all that's left is some very easy grouping. The final formula now acts as a very efficient representation of all the implication relations. Each vertical line is a valid clause, and using the same principle from earlier, we can turn the clauses into implication relations, following whatever ordering makes the most sense. For the vertical slice on the far left, we would get $B + A + Cd$, and we could turn that into an implication relation by negating the first few terms, $ba \rightarrow Cd$. 

As can be seen clearly, the relevant fact that enables the vertical/horizontal reading of formulas are cases where the parenthesis can be omitted along the crosses. This is happens when two variables in either a vertical or horizontal line are identical, since $A(B+C) = AB + AC$ and $A + BC = (A+B)(A+C)$, or when the diagonals are negations of each other (and in recursive Johnson form). We can also consider any single variable to be in Johnson's form, as well as any combination of two or three variables, since those could be doubled in some direction to be in the two previous forms. 

