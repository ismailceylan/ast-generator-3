import { tokenize } from "../../tokenizer/index";
import { Component, FAILED, TokenStream } from ".";

/**
 * Represents a parser and parses given strings based on components.
 */
export default class Parser
{
	/**
	 * The components to be used for parsing.
	 * 
	 * @type {Component[]}
	 */
	components = [];

	/**
	 * The tokenization options.
	 * 
	 * @type {TokenizationOptions}
	 */
	tokenization = {};

	/**
	 * Constructs a new instance of the Parser class.
	 *
	 * @param {object} options - The options for the parser.
	 * @param {Component[]} options.components - The components to use for parsing.
	 * @param {TokenizationOptions} options.tokenization - The tokenization options.
	 */
	constructor({ components, tokenization })
	{
		this.components = components;
		this.tokenization = tokenization;
	}

	parse( raw )
	{
		const tokens = tokenize( raw, this.tokenization.rules, this.tokenization.merge );
		const stream = new TokenStream( tokens );
		const ast = [];

		do
		{
			for( const component of this.components )
			{
				const result = component.run({ stream });

				if( result !== FAILED )
				{
					ast.push( result );
					break;
				}
			}

			ast.push( stream.current );
			stream.moveNext();
		}
		while( stream.current !== undefined );

		return ast;
	}
}

/**
 * @typedef {{rules:[string,string,{merge?:boolean}?][],merge:boolean}} TokenizationOptions
 */
