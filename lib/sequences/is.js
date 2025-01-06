import { Sequence } from "..";

/**
 * Creates a sequence that checks if the specified scope key's match value
 * is equal to the target value.
 * 
 * If the condition is met, it runs all conditional sequences.
 *
 * @param {string} targetScopeKey - The key in the scope to be checked.
 * @param {string|symbol} targetScopeValue - The value to match against the scope key's match value.
 * @returns {Sequence}
 */
export default function is( targetScopeKey, targetScopeValue )
{
	const sequence = new Sequence( "until", function({ stream, scope, astNode })
	{
		if( scope.scope[ targetScopeKey ].match === targetScopeValue )
		{
			for( const sequence of this.conditionalSequences )
			{
				sequence.run({ stream, scope, astNode });
			}
		}
	});

	sequence.movesCursor = true;

	return sequence;
}
