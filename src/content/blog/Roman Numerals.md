---
title: 'Roman Numeral Division'
description: "A How-to Guide"
pubDate: 'Nov 11 2024'
---
A description of the work I've done on Roman Numeral arithmetic over the past few months.

I have a quantitative model that can explain some of the different ways that Roman Numerals can be used to perform division of numbers between 100 and 4000. Though these models *are* interesting, the most important takeaways I think are qualitative.

Firstly, there are many ways that numerical systems can be evaluated. In a surprising number of these, Roman Numerals outperform their Arabic counterparts. Understanding when and why can lead to a much richer appreciation for the strengths and weaknesses of our current numerals.

The first big strength that roman numerals have is their sheer simplicity. There are only six symbols, during addition they only have six total combination rules, and during multiplication only 36. This is in contrast with Arabic Numerals, with ten non-literal symbols that combine in entirely non-obvious ways. In addition, any two numerals combine to create one or two other numerals. Though finger counting can assist memory, after a certain point, the rules simply have to be memorized. Likewise, for multiplication, there are algorithms that can be performed, but the rules of the symbol combinations still need to be memorized. Actually trying repeated addition is infeasible for even very low pairs of values.

The heart of Roman Numerals is their grouping, these six translation rules are entirely enough to define the system, in the worst case, every single number could be converted into unary and the value determined by counting. This is unlike a positional system where the connection to numerosity must be learned.
## Grouping

$$
\begin{align*}
IIIII \longleftrightarrow &\ V \\
VV \longleftrightarrow &\ X \\
XXXXX \longleftrightarrow &\ L \\
LL \longleftrightarrow &\ C \\
CCCCC \longleftrightarrow &\ D \\
DD \longleftrightarrow &\ M \\
\end{align*}
$$

For addition, the rules are very simple. We simply need to shuffle the digits of any two numbers together, and then perform any simplifications.
## Simplifying

$$
\begin{array}{c}
MDCCLII\\
CCCIII \\
\end{array}
$$
$$
\begin{alignat}{2}
M&D&CC&L&&II&\\
&&CCC&&&III&\\ \hline
M&D& \sout{CCCCC}&L&&\sout{IIIII} \\ \hline
M&\sout{DD}&&L&V \\ \hline
MM&&&L&V
\end{alignat}
$$
Subtraction simply involves the opposite process, starting from the lowest values, cancel out any symbols that appear in both numbers, and break apart any symbols in the upper number until every symbol in the bottom number can be removed. As such, both addition and subtraction are entirely defined by the grouping rules, and variously by canceling the canceling or grouping operations. 

## Multiplying

For Multiplication, every single combination rule fits in a 6 $\times$ 6 table:

$$
\begin{array}{c|cc}
  & I & V   & X & L & C & D & M \\ \hline
I & I & V   & X & L & C & D & M \\
V & V & XXV & L & CCL & D & MMD & \overline{V} \\
X & X & L   & C & D & M & \overline{V} & \overline{X} \\
L & L & CCL & D & MMD & \overline{V} & \overline{X} & \overline{L} \\
C & C & D   & M & \overline{V} & \overline{X} & \overline{L} & \overline{C} \\
D & D & MMD & \overline{V} & \overline{X} & \overline{L} & \overline{C} & \overline{D} \\
M & M & \overline{V} & \overline{X} & \overline{L} & \overline{C} & \overline{D} & \overline{M} \\
\end{array}
$$

Note that the table has very obvious symmetry. Even if you didn't know any of the rules, any incorrect digit would stick out very clearly, allowing the full table to be easily inferred even if you only saw the first few rules.

Actually performing the operation is as simple as lining the two numbers up on either end of the table, and then shuffling the symbols together.

$$
\begin{array}{c|cc}
  &M&           D&CC&L&II \\ \hline
CCC &\overline{CCC}&\overline{LLL}&MMMMMM&DDD&CCCCCC \\
III &MMM&DDD&CCCCCC&LLL&IIIIII \\
\end{array}
$$
Then you can perform the simplifications in place in the table, before rewriting them in order and re-simplifying. I believe that the two rounds of simplifications are necessary to avoid the numbers getting too long.

# Division

After all of this, it might seem that Roman Numerals still have one glaring weakness: division. Asked to divide two Roman Numerals, most people will declare that it is simply impossible, or at least not possible to improve on random guess and checking combined with repeated subtracting. This claim is almost certainly false. I intend to prove it.

## The Algorithm

The basic version of the algorithm is conceptually very similar to standard Arabic numeral long division, though I don't expect that similarity to be obvious at first. Fundamentally, the algorithm is just repeated addition with a very simple scheme to make the guesses much more efficient. 

We will walk through the steps of the algorithm, briefly argue that it is correct, and then explain the quantitative results compared to other candidates. 

We're gonna divide $3322 = MMMCCCXXII$ by $57 = LVII$ 

First, we multiply the divisor by each of the primitive letters from the table. Since we only perform operations by single letters, we guarantee two things. 1) unlike the full table multiplication, we never need to re-order the results of the multiplication, since simply applying the single letter to each letter in the divisor in left to right order guarantees that two numbers are never generated out of order, and secondly, unlike other schemes we could've chosen (doubling is a common one), we never get a number that is more than 3x larger than the original, and which doesn't have too many distinct symbols.

$$
\begin{array}{c|r}
I & LVII \\ \hline
V & CCLXX\cancel{VV}V \\
  & CCLXXXV \\ \hline
X & DLXX \\ \hline
L & MMDCC\cancel{LL}L \\
  & MMDCCCL \\ \hline
C & MMMMM\dots
\end{array}
$$
Once we start multiplying by $C$, we can see that the result will be much larger than our divisor, so I haven't written out the final result. After working on our original table, we have a very efficient way to perform repeated additions. We know that the $L$ result is the closest we came without going over. Therefore, the first number we have to check is $LX$. If we discover that $LX$ is too large, we check $LV$, too small and we have to check $LXX$. After checking all the way up to $LXXXX$, we know that the next number has to be $LXXXXV$, since if it weren't, we would effectively be checking $C$ again. As such, this scheme only ever needs to multiply by single letters, which is very easy, and only ever needs to perform at most 11 additions after the fact. The red coloring represents an addition step that went over, and if a simplification step resulted in another roman numeral in improper form, the "chain" of simplifications has been represented as alternating slashes.

$$
\begin{array}{c|l}
L & MMDCCCL \\ \hline
\color{red}{LX} & MM\cancel{DD}CCC\cancel{LL}XX \\
   & \color{red}{MMMCCCCXX} \\ \hline
LV & MM\bcancel{D\cancel{CCCCC}}CXXXV \\
   & MMMCXXXV \\ \hline
LVI & MMMCLXXX\cancel{VV}II \\
    & MMMCLXXXXII \\ \hline
LVII & MMMC\cancel{LL}XXXXVIIII \\
 & MMMCCXXXXVIIII \\ \hline
LVIII & MMMCC\cancel{L\bcancel{XXXX\cancel{VV}}}\cancel{IIIII}I \\
      & MMMCCCVI \\ \hline
\color{red}{LVIIII} & MMMCCCL\cancel{VV}II \\
       & \color{red}{MMMCCCLXII}
\end{array}
$$

