import { Sequence, FAILED } from "..";

/**
 * Matches if the given target doesn't match with the current stream value.
 *
 * @param {string|symbol|(string|symbol)[]} target - The target value to compare with the current stream value.
 * @returns {Sequence} A new Sequence that represents the scenario.
 */
export default function not( target )
{
	return new Sequence( "not", function({ stream })
	{
		if( ! stream.match( target ))
		{
			return true;
		}

		return FAILED;
	});
}
