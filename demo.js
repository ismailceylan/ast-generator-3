import { Parser, match, not, until } from "./lib";
import { component } from "./lib/helpers";

const ASTERIX = Symbol( "asterix" );
const NEWLINE = Symbol( "newline" );
const BACKTICK = Symbol( "backtick" );
const COLON = Symbol( "colon" );
const NUMS = Symbol( "nums" );

const MarkdownParser = new Parser(
{
	tokenization:
	{
		merge: false,
		rules:
		[
			[ ASTERIX, "*" ],
			[ NEWLINE, "\n", { merge: true }],
			[ BACKTICK, "`" ],
			[ COLON, ":" ],
			[ NUMS, [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ], { merge: true }],
		]
	},

	components:
	[
		component( "bold", [
			match( ASTERIX ).moveCursor(),
			not( ASTERIX ),
			until([ ASTERIX, NEWLINE ])
			 	.as( "content" ),
			// 	.failWhenMatch( NEWLINE, "Bold components should be closed before a new line!" )
			match( ASTERIX ).moveCursor(),
			not( ASTERIX )
		]),

		component( "italic", [
			match([ ASTERIX, ASTERIX ]).moveCursor(),
			not( ASTERIX ),
			until([ ASTERIX, NEWLINE ])
			 	.as( "content" ),
			// 	.failWhenMatch( NEWLINE, "Italic components should be closed before a new line!" ),
			match([ ASTERIX, ASTERIX ]).moveCursor(),
			not( ASTERIX )
		]),

		component( "inline-code", [
			match( BACKTICK ).moveCursor(),
			not( BACKTICK ),
			until( BACKTICK ).as( "content" ),
			match( BACKTICK ).moveCursor(),
			not( BACKTICK )
		]),

		component( "code", [
			match([ BACKTICK, BACKTICK, BACKTICK ]).moveCursor(),
			not( BACKTICK ),
			until( NEWLINE ).as( "meta" ),
			match( NEWLINE ).moveCursor(),
			until( BACKTICK ).as( "inner" ),
			match([ BACKTICK, BACKTICK, BACKTICK ]).moveCursor(),
		]),

	]
});
console.time( "render" );
const ast = MarkdownParser.parse(
`Hello **wo*rld!
\`kod\`
\`\`\`js:33
naber
\`\`\`
`
);

console.timeEnd( "render" );

console.log(ast);
