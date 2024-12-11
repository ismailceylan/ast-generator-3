import { FAILED, Sequence } from "..";

/**
 * Creates a new sequence that matches the given target until it finds a match.
 *
 * @param {Symbol|Symbol[]} target - The target to match against.
 * @returns {Sequence} - An array of tokens that match the target, or undefined if no match is found.
 */
export default function until( target )
{
	return new Sequence( "until", function({ stream })
	{
		const tokens = stream.until( target );

		if( tokens === undefined )
		{
			return FAILED;
		}

		this.match = tokens[ 1 ];

		return true;
	});
}
