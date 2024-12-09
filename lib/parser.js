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
	 * Constructs a new instance of the Parser class.
	 *
	 * @param {object} options - The options for the parser.
	 * @param {Component[]} options.components - The components to use for parsing.
	 */
	constructor({ components })
	{
		this.components = components;
	}
}
