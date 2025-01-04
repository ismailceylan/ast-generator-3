import { FAILED, Sequence } from "..";

/**
 * @param {Symbol|Symbol[]} target - The target to match against.
 * @returns {Sequence}
 */
export default function consume( target )
{
	const sequence = new Sequence( "consume", function({ stream, scope, astNode })
	{
		const result = stream.consume( target );

		if( result[ 0 ].length === 0 )
		{
			return FAILED;
		}

		if( this.minVal !== undefined )
		{
			if( result[ 0 ].toString().length < this.minVal )
			{
				return FAILED;
			}
		}

		// this.match = result[ 1 ];

		scope.set( this, { match: result[ 1 ], result: result[ 0 ]});
		astNode.createSubNode( this.scopeName, result[ 0 ]);

		return true;
	});

	sequence.movesCursor = true;

	return sequence;
}
