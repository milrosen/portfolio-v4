---
title: 'Notes on Discursive Distance'
description: "How complex is it to reason with a notational system"
pubDate: 'Nov 2 2024'
---
# The problem statement: Discursive Dependency Distance

I have settled on a specific way of comparing the degree a notational system is useful as a tool for reasoning. There are hundreds of ways to do this, each of them purports to be the most rational, universal or objective. My goal is not to create another universal, but to try to express a single way that a notational system can aid with reasoning. 

Discursive dependency distance is a generalization of dependency distance from linguistics. Dependency distance is the linear distance of two words in a dependency grammar parse tree. Dependency grammar is a way of understanding the structure of a sentence, described in terms of how different words are dependent on each other. An example could be the sentence "I prefer the morning flight through Denver" 
$$
\begin{align*}

I\;prefer\;the\;morning\;flight\;through\;Denver
\end{align*}
$$
becomes:
<script type="text/tikz">
 \begin{tikzcd}
    A \arrow[r, "\phi"] \arrow[d, red]
      & B \arrow[d, "\psi" red] \\
    C \arrow[r, red, "\eta" blue]
      & |[blue, rotate=-15]| D
  \end{tikzcd}
</script>