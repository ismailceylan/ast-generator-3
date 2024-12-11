import Component from "./component";

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
	constructor({ components })
	{
		this.components = components;
		this.tokenization = tokenization;
	}

}

/**
 * @typedef {{rules:[string,string,{merge?:boolean}?][],merge:boolean}} TokenizationOptions
 */
