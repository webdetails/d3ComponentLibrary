Had to do some changes in d3.js file. CDE's minifier struggles with expressions
like + +a, so on these cases I had to put some parenthesis.

Also - the minifier apparently strips out the tabs, so the d3.tsv function is
screwed up

Beware of that if needed to upgrade d3


-pedro
