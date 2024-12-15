/**
 * Represents a component's scope.
 */
export default class Scope
{
	/**
	 * The component associated with this scope.
	 * 
	 * @type {Component}
	 */
	component;

	/**
	 * The scope object.
	 * 
	 * @type {object}
	 */
	scope = {};

	/**
	 * Initializes a new instance of the Scope class.
	 *
	 * @param {Component} component - The component associated with this scope.
	 */
	constructor( component )
	{
		this.component = component;
	}

	/**
	 * Assigns the given value to the scope using the sequence's scope name as the key.
	 *
	 * @param {Sequence} sequence - The sequence whose scope name is used as the key.
	 * @param {*} value - The value to be assigned to the scope.
	 */
	set( sequence, value )
	{
		if( sequence.scopeName )
		{
			this.scope[ sequence.scopeName ] = value;
		}
	}
}
