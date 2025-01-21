# AST Generator
This JavaScript library creates abstracted node trees by performing logical and sequential reading operations on strings.

It provides a set of methods to remodel the complex structures step by step. It's pretty similar to the regular expression mechanism, but with this library, plenty of possibilities are unlocked.

# Installation
```bash
npm install @iceylan/ast-gen
```

# Usage
```javascript
import { Parser, component, match, not, until } from "@iceylan/ast-gen";

const ASTERIX = Symbol( "asterix" );

const MarkdownParser = new Parser({
	tokenization:
	{
		rules:
		[
			[ ASTERIX, "*" ],
		]
	},
	components:
	[
		component( "italic",
		[
			match( ASTERIX ).eat(),
			not( ASTERIX ),
			until( ASTERIX ).as( "content" ),
			match( ASTERIX ).eat(),
			not( ASTERIX )
		])
	]
});

const ast = MarkdownParser.parse( "This is **italic** text!" );
```

The `ast` variable holds the following node tree:

```js
[
	Token { "name": Symbol(blank), "value": "This is ", "line": 1, "start": 1, "end": 4 },
	ASTNode {
		"name": "italic",
		"start": 9,
		"startLine": 1,
		"end": 18,
		"endLine": 1,
		"content": ASTNode {
			"name": "content",
			"tokens":
			[
				Token { "name": Symbol(blank), "value": "italic", "line": 1, "start": 11, "end": 16 }
			],
			"start": 11,
			"end": 16,
			"startLine": 1,
			"endLine": 1
		}
	},
	Token { "name": Symbol(blank), "value": " text!", "line": 1, "start": 19, "end": 19 }
]
```

## Tokenization
This library uses [tokenizer](https://github.com/ismailceylan/tokenizer) library to tokenize the given string. The tokenizer uses a set of rules to tokenize the string. With the help of these tokens, we can interact with the exact patterns as javascript symbols and we can easily reference them. 

## Components
This library prefers to use "component" word to capsulate the complex logical structures. Components are a set of sequences that are used to generate the abstracted node tree.

```js
const bold = component( "bold",
[
	// ...sequences	
])
```

## Sequences
ASTGenerator uses sequence term for logical conditions.

Let's think about the decimal numbers. As a human, when can easily see that the decimal numbers are a combination of integers and dots. First, we see the integer part, then the dot, and finally the decimal part. We call every step of these three steps as sequence and ASTGenerator provides special sequence helper methods to match with required logics.

Let's continue with the decimal numbers example.

```js
const str = "Here is a decimal number: 3.1415, the pi number.";
```

First, we have to properly tokenize the whole string to easily handle the numbers and dots.

```js
const rules =
[
	[ "dot", "." ],
	[ "numbers", [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" ], { merge: true }],
]
```

With the help of these token configuration, tokenizer will tokenize all the consecutive numbers into single token and all the dots into private tokens.

```js
[
	Token { "name": Symbol(blank), "value": "Here is a decimal number: ", "line": 1, "start": 1, "end": 26 },
	Token { "name": "numbers", "value": "3", "line": 1, "start": 27, "end": 27 },
	Token { "name": "dot", "value": ".", "line": 1, "start": 28, "end": 28 },
	Token { "name": "numbers", "value": "1415", "line": 1, "start": 29, "end": 32 },
	Token { "name": Symbol(blank), "value": ", the pi number", "line": 1, "start": 32, "end": 46 },
	Token { "name": "dot", "value": ".", "line": 1, "start": 47, "end": 47 }
]
```

Since we have tokens, we can remodel the decimal number's logic with the help of sequence helpers as a component.

```js
const decimalNumbers = component( "decimal-number",
[
	match( "numbers" ).eat().as( "integerPart" ),
	match( "dot" ).eat(),
	match( "numbers" ).eat().as( "decimalPart" )
]);
```

And finally, we can put together the ingredients to generate the abstracted node tree.

```js
const MathParser = new Parser(
{
	tokenization: { rules },
	components: [ decimalNumbers ]
});

const ast = MathParser.parse( str );
```

The `ast` variable holds the following node tree (line information will be removed to avoid dirty images):

```js
[
	Token { "name": Symbol(blank), "value": "Here is a decimal number: " },
	ASTNode {
		"name": "decimal-number",
		"integerPart": ASTNode {
			"name": "integerPart",
			"tokens": [
				Token { "name": "numbers", "value": "3" }
			]
		},
		"decimalPart": ASTNode {
			"name": "decimalPart",
			"tokens": [
				Token { "name": "numbers", "value": "1415" }
			]
		}
	},
	Token { "name": Symbol(blank), "value": ", the pi number." }
	Token { "name": "dot", "value": "." }
]
```

### Sequence Helpers
The `ASTGenerator` provides a set of sequence helpers to match the required logic.

#### match
The `match` sequence helper checks if the current token matches the provided name but doesn't move the cursor by default. You can use the `eat` method to move the cursor.

You can pass a symbol or a string to match the current token.

```js
match( "asterix" ).eat();
```

This sequence will succeed if the current token is "asterix" and will move the cursor.

Sometimes, you may need to match consecutive tokens. In such cases, you can pass an array of names or symbols.

```js
match([ "space", "asterix" ]);
```

This sequence will succeed if the current token is "space" and the next token is "asterix," but it won't move the cursor. This means the next sequence will operate on the "space" token. This behavior is similar to lookahead functionality.

#### not
The `not` sequence helper checks if the current token does not match the provided name and, by default, does not move the cursor.

```js
not( "asterix" );
```

This sequence will succeed if the current token is not "asterix" and will not move the cursor.

Similar to the `match` method, you can pass an array of names or symbols to define a "not-matching" logic for consecutive tokens.

```js
not([ "space", "asterix" ]).eat();
```

This sequence will succeed if the current token is not "space" or if the next token is not "asterix." The provided array will be treated as an exact pattern, and the cursor will move accordingly.

#### until