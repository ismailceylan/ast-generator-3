/**
 * Represents a component.
 */
export default class Component
{
	/**
	 * The name of the component.
	 * 
	 * @type {string}
	 */
	name;

	/**
	 * Component sequences.
	 * 
	 * @type {Sequence[]}
	 */
	sequences;

	constructor( name, sequences = [])
	{
		this.name = name;
		this.sequences = sequences;
	}
}
