import { Component } from "..";

/**
 * Creates a new instance of the Component class with
 * the given arguments.
 *
 * @param {...*} args - The arguments to be passed to the Component constructor.
 * @returns {Component} A new Component instance.
 */
export default function component( ...args )
{
	return new Component( ...args );
}
