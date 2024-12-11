import { FAILED } from "./constants";
import TokenStream from "./token-stream";

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

	/**
	 * Executes the component's structure on the given stream.
	 * 
	 * @param {object} options - The options for the component.
	 * @param {TokenStream} options.stream - The stream to execute the component on.
	 */
	run({ stream })
	{
		const rollbackStream = stream.startTransaction();

		for( const sequence of this.sequences )
		{
			if( sequence.run({ stream }) === FAILED )
			{
				rollbackStream();
				return FAILED;
			}
		}

		return true;
	}
}
