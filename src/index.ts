import { Grammars, Parser, IToken } from "ebnf";

function printAST(token: IToken, level = 0) {
  console.log(
    "         " +
      "  ".repeat(level) +
      `|-${token.type}${token.children.length == 0 ? "=" + token.text : ""}`
  );
  token.children &&
    token.children.forEach((c) => {
      printAST(c, level + 1);
    });
}

export function describeTree(token: IToken) {
  printAST(token);
}

// https://github.com/lys-lang/node-ebnf#readme
// https://github.com/lys-lang/node-ebnf/tree/master/test

// We try to keep this tool as much unopinionated and free of conventions as possible. However, we have some conventions:
// All UPPER_AND_SNAKE_CASE rules are not emmited on the AST. This option can be deactivated setting the flag keepUpperRules: true.

// ./node_modules/.bin/tsc && node ./dist/index.js

let grammar = `
<Equation>         ::= <BinaryOperation> | <Term>
<Term>             ::= "(" <RULE_WHITESPACE> <Equation> <RULE_WHITESPACE> ")" | "(" <RULE_WHITESPACE> <Number> <RULE_WHITESPACE> ")" | <RULE_WHITESPACE> <Number> <RULE_WHITESPACE>
<BinaryOperation>  ::= <Term> <RULE_WHITESPACE> <Operator> <RULE_WHITESPACE> <Term>

<Number>           ::= <RULE_NEGATIVE> <RULE_NON_ZERO> <RULE_NUMBER_LIST> | <RULE_NON_ZERO> <RULE_NUMBER_LIST> | <RULE_DIGIT>
<Operator>         ::= "+" | "-" | "*" | "/" | "^"

<RULE_NUMBER_LIST> ::= <RULE_DIGIT> <RULE_NUMBER_LIST> | <RULE_DIGIT>
<RULE_NEGATIVE>    ::= "-"
<RULE_NON_ZERO>    ::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<RULE_DIGIT>       ::= "0" | <RULE_NON_ZERO>
<RULE_WHITESPACE>  ::= <RULE_WS> | ""
<RULE_WS>          ::= " " <RULE_WHITESPACE> | <EOL> <RULE_WHITESPACE> | " " | <EOL>
`;

let grammar2 = `
<STATEMENT> ::= <IF_STATEMENT> <SEMICOLON>

<IF_STATEMENT> ::= <IF> <OPENING_BRACKET> <CONDITION> <CLOSING_BRACKET> <BLOCK> 

<CONDITION> ::= <TRUE> | <FALSE>
<BLOCK> ::= <OPENING_SQUIGGLY_BRACKET> <SEMICOLON> <CLOSING_SQUIGGLY_BRACKET>

<TRUE> ::= "true"
<FALSE> ::= "false"
<IF> ::= "if"
<ELSE> ::= "else"
<SEMICOLON> ::= ";"
<OPENING_BRACKET> ::= "("
<CLOSING_BRACKET>  ::= ")"
<OPENING_SQUIGGLY_BRACKET> ::= "{"
<CLOSING_SQUIGGLY_BRACKET> ::= "}"
`;

// equation - returns a number
// predicate - returns true or false

let grammar3 = `
<compilation_unit> ::= <statements> | <blocks>

<blocks> ::= <WS> <block> <WS> <blocks> | <WS> <block> <WS>

<block> ::= <OPENING_SQUIGGLY_BRACKET> <WS> <statements> <WS> <CLOSING_SQUIGGLY_BRACKET> | <statement>

<statements> ::= <WS> <statement> <WS> <statements> | <WS> <statement> <WS> 

<statement> ::= <WS> <if_statement> <WS> | <WS> <var_decl> <WS> <SEMICOLON> | <WS> <var_assignment> <WS> <SEMICOLON> | <SEMICOLON> 

<if_statement> ::= <if_statement_condition_part> <WS> <block> <WS> <ELSE> <WS> <block> | <if_statement_condition_part> <WS> <block>
<if_statement_condition_part> ::= <IF> <WS> <OPENING_BRACKET> <WS> <condition> <WS> <CLOSING_BRACKET> 
<var_decl> ::= <WS> <simple_type> <WS> <Identifier> <WS> <EQUALS_SIGN> <WS> <Predicate>
<var_assignment> ::= <WS> <Identifier> <WS> <EQUALS_SIGN> <WS> <Predicate>

<simple_type> ::= "int"

<condition> ::= <WS> <Predicate> <WS> 

<Predicate> ::= <PredicateOperation>
<PredicateOperation> ::= <PredicateTerm> <WS> <PredicateOperator> <WS> <PredicateTerm> | "(" <Predicate> ")" <WS> <PredicateOperator> <WS> <PredicateTerm> | <PredicateTerm> <WS> <PredicateOperator> <WS> "(" <Predicate> ")" | "(" <Predicate> ")" <WS> <PredicateOperator> <WS> "(" <Predicate> ")" | <PredicateTerm>
<PredicateTerm> ::= <WS> <TRUE> <WS> | <WS> <FALSE> <WS> | <WS> <Equation> <WS>
<PredicateOperator> ::= ">" | ">=" | "<=" | "<=" | "=="

<Equation> ::= <BinaryOperation> | <Term>
<Term> ::= "(" <WS> <Equation> <WS> ")" | "(" <WS> <number> <WS> ")" | <WS> <number> <WS> | "(" <WS> <Identifier> <WS> ")" | <WS> <Identifier> <WS>
<BinaryOperation> ::= <Term> <WS> <Operator> <WS> <Term>
<Operator> ::= "+" | "-" | "*" | "/" | "^"

<CLOSING_BRACKET>  ::= ")"
<CLOSING_SQUIGGLY_BRACKET> ::= "}"

<ELSE> ::= "else"
<EQUALS_SIGN> ::= "="

<IF> ::= "if"

<OPENING_BRACKET> ::= "("
<OPENING_SQUIGGLY_BRACKET> ::= "{"

<SEMICOLON> ::= ";"

<TRUE> ::= "true"
<FALSE> ::= "false"

<Identifier> ::= <RULE_UNQUOTED_STRING>
<RULE_UNQUOTED_STRING> ::= <RULE_LETTER> <RULE_UNQUOTED_STRING> | <RULE_LETTER>
<RULE_LETTER>    ::= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"

<number> ::= <RULE_INTEGER>
<RULE_INTEGER> ::= <RULE_DIGIT> <RULE_INTEGER> | <RULE_DIGIT>
<RULE_DIGIT> ::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0"

<WS> ::= <RULE_WS> | ""
<RULE_WS> ::= " " <WS> | <EOL> <WS> | " " | <EOL>
`;

//let parser = new Grammars.BNF.Parser(grammar);
//let ast = parser.getAST("-122 + 2");

//let parser = new Grammars.BNF.Parser(grammar2);
//let ast = parser.getAST("if (true) { ; };");
//let ast = parser.getAST("true");

let parser = new Grammars.BNF.Parser(grammar3);

let testCode6 = "int a = 3 + 1; if (a > 2) { ; } else { ; }";
console.log(testCode6);
let ast6 = parser.getAST(testCode6);
describeTree(ast6);
console.log("");

testCode6 = "int a = 1;";
console.log(testCode6);
ast6 = parser.getAST(testCode6);
describeTree(ast6);
console.log("");

testCode6 = "int a = 1+2;";
console.log(testCode6);
ast6 = parser.getAST(testCode6);
describeTree(ast6);
console.log("");

testCode6 = "int a = 1; int b = a + 21;";
console.log(testCode6);
ast6 = parser.getAST(testCode6);
describeTree(ast6);
console.log("");

testCode6 = "int a = 17; a = 19;";
console.log(testCode6);
ast6 = parser.getAST(testCode6);
describeTree(ast6);
console.log("");

testCode6 = "int a = 1; if (a > 0) { int b = 1; } else { int c = 2; }";
console.log(testCode6);
ast6 = parser.getAST(testCode6);
describeTree(ast6);
console.log("");

// let testCode1 = "if(false){;};";
// console.log(testCode1);
// let ast1 = parser.getAST(testCode1);
// describeTree(ast1);
// console.log("");

// testCode1 = "if(false){;}";
// console.log(testCode1);
// ast1 = parser.getAST(testCode1);
// describeTree(ast1);
// console.log("");

// testCode1 = "if(true){ ; };";
// console.log(testCode1);
// ast1 = parser.getAST(testCode1);
// describeTree(ast1);
// console.log("");

// testCode1 = "if (true) { ; };";
// console.log(testCode1);
// ast1 = parser.getAST(testCode1);
// describeTree(ast1);
// console.log("");

// let ast2 = parser.getAST("if (false) {;} else {;}");
// describeTree(ast2);
// ast2 = parser.getAST("if (false) int a = 1;");
// describeTree(ast2);
// ast2 = parser.getAST(
//   "if (false) { int a = 1; } else { int b = 2; int c = 3; }"
// );
// describeTree(ast2);

// let ast3 = parser.getAST("if (false) { ; }");
// describeTree(ast3);
// ast3 = parser.getAST("if (true) { ; }");
// describeTree(ast3);
// ast3 = parser.getAST("if (1) { ; }");
// describeTree(ast3);
// ast3 = parser.getAST("if (1+1) { ; }");
// describeTree(ast3);
// ast3 = parser.getAST("if (testvariable+1) { ; }");
// describeTree(ast3);

// let ast4 = parser.getAST("if (a > a) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (a > 1) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (1 > 1) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (1 > a) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (1 > (a)) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if ((a) > 1) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if ((a) > (a)) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (a > (b+1)) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (a == 1) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (true) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (true == true) { ; }");
// describeTree(ast4);
// ast4 = parser.getAST("if (2 == 3) { ; }");
// describeTree(ast4);

// let testCode = "if (1 == (2 == 3)) { ; }";
// console.log(testCode);
// let ast5 = parser.getAST(testCode);
// describeTree(ast5);
// console.log("");

// testCode = "if ((2 == 3) == 1) { ; }";
// console.log(testCode);
// ast5 = parser.getAST(testCode);
// describeTree(ast5);
// console.log("");

// testCode = "if ((2 == 3) == (2 == 3)) { ; }";
// console.log(testCode);
// ast5 = parser.getAST(testCode);
// describeTree(ast5);
// console.log("");

// testCode = "if (1>1) { ; }";
// console.log(testCode);
// ast5 = parser.getAST(testCode);
// describeTree(ast5);
// console.log("");

// testCode = "int if = 1234;";
// console.log(testCode);
// ast5 = parser.getAST(testCode);
// describeTree(ast5);
// console.log("");

// testCode = "{;}";
// console.log(testCode);
// ast5 = parser.getAST(testCode);
// describeTree(ast5);
// console.log("");

//console.log(ast);
