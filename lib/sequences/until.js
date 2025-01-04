import { FAILED, Sequence } from "..";

/**
 * Creates a new sequence that matches the given target until it finds a match.
 *
 * @param {Symbol|Symbol[]} target - The target to match against.
 * @returns {Sequence} - An array of tokens that match the target, or undefined if no match is found.
 */
export default function until( target )
{
	const sequence = new Sequence( "until", function({ stream, scope, astNode })
	{
		const result = stream.until( target );

		if( result === undefined )
		{
			return FAILED;
		}

		this.match = result[ 1 ];

		scope.set( this, { result: result[ 0 ], match: result[ 1 ]});
		astNode.createSubNode( this.scopeName, result[ 0 ]);

		return true;
	});

	sequence.movesCursor = true;

	return sequence;
}
