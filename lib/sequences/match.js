import { FAILED, Sequence } from "..";

/**
 * Checks if the current stream value matches the given target.
 *
 * @param {string|symbol|(string|symbol)[]} target - The target value to match with the current stream value.
 * @returns {Sequence} A new Sequence that represents the scenario.
 */
export default function match( target )
{
	return new Sequence( "match", function({ stream })
	{
		if( stream.match( target, { moveCursor: this.movesCursor }))
		{
			this.match = stream.current;
			return true;
		}

		return FAILED;
	});
}
