import { tokenize } from "../../tokenizer/index";
import { Component, TokenStream } from ".";

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

		do
		{
			for( const component of this.components )
			{
				if( component.run({ stream }) === true )
				{
					console.log( "success: " + component.name );
				}
				else
				{
					console.log( "failed: " + component.name );
				}
			}

			stream.next;
		}
		while( stream.current !== undefined );
	}
}

/**
 * @typedef {{rules:[string,string,{merge?:boolean}?][],merge:boolean}} TokenizationOptions
 */
