var v = Object.defineProperty;
var k = (r, t, s) => t in r ? v(r, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[t] = s;
var i = (r, t, s) => k(r, typeof t != "symbol" ? t + "" : t, s);
const w = Symbol("blank");
class f {
  constructor(t, s = "", e = 1, n = 1, o = 1) {
    /**
     * The name of the token.
     * 
     * @type {Symbol}
     */
    i(this, "name");
    /**
     * The value of the token.
     * 
     * @type {string}
     */
    i(this, "value");
    /**
     * The line number of the token.
     * 
     * @type {number}
     */
    i(this, "line");
    /**
     * The start position of the token.
     * 
     * @type {number}
     */
    i(this, "start");
    /**
     * The end position of the token.
     * 
     * @type {number}
     */
    i(this, "end");
    this.name = t, this.value = s, this.line = e, this.start = n, this.end = o;
  }
  /**
   * Returns the length of the token's value.
   * 
   * @returns {number} The length of the value string.
   */
  get length() {
    return this.value.length;
  }
}
class m extends Array {
  /**
   * Gets the first token from the stack.
   * 
   * @returns {Token}
   */
  get first() {
    return this[0];
  }
  /**
   * Gets the last token from the stack.
   * 
   * @returns {Token}
   */
  get latest() {
    return this[this.length - 1];
  }
  /**
   * Appends the given string to the latest text node in the stack.
   * If the stack is empty or the latest token is not a text node,
   * a new text node is created. It returns the latest token.
   *
   * @param {string} text - The text to append
   * @param {string|Symbol} nodeName - The name of the node
   * @returns {Token}
   */
  pushToLatestNode(t, s) {
    let e = this[this.length - 1];
    return e ? e.name !== s ? this.push(
      // create a new text node
      e = new f(
        s,
        t,
        e.line,
        e.start + 1,
        (t || "").length
      )
    ) : e.name === s && (e.value += t, e.end += t.length) : this.push(
      // create a new text node
      e = new f(
        s,
        t,
        void 0,
        void 0,
        (t || "").length
      )
    ), e;
  }
  /**
   * Adds a token to the stack and returns the new length of
   * the stack.
   *
   * @param {Token} token The token to add.
   * @returns {number}
   */
  push(t) {
    const s = this[this.length - 1];
    return s && (t.start = s.end + 1, t.end = t.start + t.value.length - 1, t.line = s.line + t.value.split(`
`).length - 1), super.push(t);
  }
}
var b = Object.defineProperty, y = (r, t, s) => t in r ? b(r, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[t] = s, l = (r, t, s) => y(r, typeof t != "symbol" ? t + "" : t, s);
class N {
  /**
   * Initialize the stream.
   * 
   * @param {string} raw string data to get streamed
   */
  constructor(t) {
    l(this, "BEGINNING", Symbol("beginning")), l(this, "ENDING", Symbol("ending")), l(this, "raw", ""), l(this, "cursor", 0), this.raw = t;
  }
  /**
   * Get the current character.
   * 
   * @type {string|undefined}
   */
  get current() {
    return this.raw[this.cursor];
  }
  /**
   * Returns the next character in the stream and advances the cursor.
   *
   * @type {string|undefined}
   */
  get next() {
    return this.raw[++this.cursor];
  }
  /**
   * Returns the previous character in the stream and decrements the cursor.
   *
   * @type {string}
   */
  get prev() {
    return this.raw[--this.cursor];
  }
  /**
   * Checks if the given needle matches starting from the current
   * position.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".matches( "rem" ); // true
   * ```
   * 
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  matches(t) {
    return this.raw.slice(
      this.cursor,
      this.cursor + t.length
    ) === t;
  }
  /**
   * Checks if the given needle matches before the current position.
   * 
   * ```js
   * //   v  <-- cursor is here
   * "lorem ipsum".before( "lore" ); // true
   * ```
   * 
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  before(t) {
    return this.raw.slice(
      this.cursor - t.length,
      this.cursor
    ) === t;
  }
  /**
   * Checks if the given needle matches after the current position.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".after( "em" ); // true
   * ```
   *
   * @param {string} needle a string to check
   * @returns {boolean}
   */
  after(t) {
    return this.raw.slice(
      this.cursor + 1,
      this.cursor + t.length + 1
    ) === t;
  }
  /**
   * Calculates there are how many characters between the current
   * position and the specified needle in the stream.
   * 
   * If the needle is not found, Infinity will be returned.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".distanceTo( "p" ); // 4
   * ```
   * 
   * It also supports the "beginning" and "ending" symbols.
   * 
   * ```js
   * //   v  <-- cursor is here
   * "lorem ipsum".distanceTo( stream.BEGINNING ); // 4
   * "lorem ipsum".distanceTo( stream.ENDING ); // 6
   * ```
   * 
   * @param {string|Symbol} needle - The string to search for in the
   * stream or the symbol "beginning" or "ending".
   * @returns {number} The index representing the distance to the needle.
   */
  distanceTo(t) {
    const s = t === this.BEGINNING ? this.cursor : t === this.ENDING ? this.raw.length - this.cursor - 1 : this.raw.indexOf(
      t,
      this.cursor
    ) - this.cursor - 1;
    return s < 0 ? 1 / 0 : s;
  }
  /**
   * Returns an array of arrays, where each inner array contains a
   * needle and its distance to the current position in the stream.
   * 
   * The returned array is sorted in ascending order based on the distance.
   *
   * @param {Array<string>} needles - An array of needles to find the closest match for.
   * @returns {[string, number][]}
   */
  closest(t) {
    return t.map(
      (s) => [s, this.distanceTo(s)]
    ).sort(
      (s, e) => s[1] - e[1]
    );
  }
  /**
   * Starts a transaction and returns a rollback function.
   *
   * @returns {Function} The rollback function that resets the cursor.
   */
  startTransaction() {
    const { cursor: t } = this;
    function s() {
      this.cursor = t;
    }
    return s.bind(this);
  }
  /**
   * Returns a substring from the current cursor position to the first
   * occurrence of `target`.
   * 
   * If the target is not found, it returns `undefined`.
   *
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".getUntil( " " ); // "rem"
   * //    ^  <-- cursor is here now
   * ```
   * 
   * @param {string} target - The string to search for in stream.
   * @returns {string|undefined}
   */
  getUntil(t) {
    const s = this.raw.indexOf(t, this.cursor);
    if (s === -1)
      return;
    const e = this.raw.slice(this.cursor, s);
    return this.cursor += e.length, e;
  }
  /**
   * Slices a portion from the current position of the stream to the
   * given `length`.
   * 
   * ```js
   * // v  <-- cursor is here
   * "lorem ipsum".slice( 3 ); // "rem"
   * //    ^  <-- cursor is here now
   * ```
   *
   * @param {number} length - The length for slicing.
   * @throws {RangeError} when `length` is negative
   * @returns {string} The sliced portion of the raw data.
   */
  slice(t) {
    if (t < 0)
      throw new RangeError(
        `Cannot slice backwards from ${this.cursor} to ${t}.`
      );
    const s = this.raw.slice(
      this.cursor,
      this.cursor + t
    );
    return this.cursor = t === 1 / 0 ? this.raw.length : this.cursor + t, s;
  }
  /**
   * Moves the cursor by the specified length from the current position.
   *
   * ```js
   * //   v  <-- cursor is here
   *   "lorem ipsum".move( 2 );
   * //     ^  <-- cursor is here now
   * ```
   * 
   * @param {number} length - The amount by which to move the cursor.
   * @returns {this}
   */
  move(t) {
    return this.cursor += t, this;
  }
  /**
   * Sets the cursor to the specified position.
   *
   * ```js
   * //   v  <-- cursor is here
   *   "lorem ipsum".moveTo( 1 );
   * //  ^  <-- cursor is here now
   * ```
   * 
   * @param {number} position - The new cursor position.
   * @returns {this}
   */
  moveTo(t) {
    return this.cursor = t, this;
  }
  /**
   * Finds the index of the target in the stream starting from the
   * current cursor position and move the cursor to that position.
   *
   * @param {string} target - The string to search for in the stream.
   * @returns {number} The index of the target in the stream.
   */
  jumpTo(t) {
    return this.cursor = this.raw.indexOf(
      t,
      this.cursor
    );
  }
  /**
   * It eats the given target character set(s) starting from the position
   * of the cursor in the stream until it encounters something else.
   * 
   * The consumed data will be returned.
   *
   * ```js
   * //  v  <-- cursor is here
   * "fooooo ipsum".consume( "o" ); // ooo
   * //     ^  <-- cursor is here now
   * ```
   * 
   * It supports multibyte character targets.
   * 
   * ```js
   * //     v  <-- cursor is here
   * "Lorem 12 12 12 ipsum".consume( "12 " ); // 12 12 12 
   * //              ^  <-- cursor is here now
   * ```
   * 
   * It supports more than one target. With this, it will consume
   * if the characters at the reached position matches with any of
   * the given targets.
   * 
   * ```js
   * //    v  <-- cursor is here
   * "Lorem\s\t\t\s\sipsum".consume([ "\s", "\t" ]); // \s\t\t\s\s
   * //              ^  <-- cursor is here now
   * ```
   * 
   * @param {string|string[]} target - The string(s) to search for in the stream.
   * @returns {string}
   */
  consume(t) {
    let s;
    const e = this.cursor;
    for (Array.isArray(t) || (t = [t]); (s = t.findIndex((n) => this.matches(n))) > -1; )
      this.move(t[s].length);
    return this.raw.slice(e, this.cursor);
  }
}
function T(r, t, { mergeTokens: s = !1 } = {}) {
  const e = new m(), n = new N(r);
  do {
    let o;
    t: for (let [c, a, { merge: p } = {}] of t) {
      let g = s;
      typeof a == "string" && (a = [a]), p !== void 0 && (g = p);
      for (const h of a)
        if (n.matches(h)) {
          g ? o = e.pushToLatestNode(h, c) : (o = new f(), o.name = c, o.value = h, o.end = n.cursor + h.length, e.push(o)), n.cursor += h.length - 1;
          break t;
        }
    }
    o || e.pushToLatestNode(n.current, w);
  } while (n.next !== void 0);
  return e;
}
class E {
  /**
   * Constructs a new instance of the Parser class.
   *
   * @param {object} options - The options for the parser.
   * @param {Component[]} options.components - The components to use for parsing.
   * @param {TokenizationOptions} options.tokenization - The tokenization options.
   */
  constructor({ components: t, tokenization: s }) {
    /**
     * The components to be used for parsing.
     * 
     * @type {Component[]}
     */
    i(this, "components", []);
    /**
     * The tokenization options.
     * 
     * @type {TokenizationOptions}
     */
    i(this, "tokenization", {});
    this.components = t, this.tokenization = s;
  }
  parse(t) {
    const s = T(t, this.tokenization.rules, this.tokenization.merge), e = new S(s), n = [];
    do {
      for (const o of this.components) {
        const c = o.run({ stream: e });
        if (c !== u) {
          n.push(c);
          break;
        }
      }
      n.push(e.current), e.moveNext();
    } while (e.current !== void 0);
    return n;
  }
}
class A {
  constructor(t, s = []) {
    /**
     * The name of the component.
     * 
     * @type {string}
     */
    i(this, "name");
    /**
     * Component sequences.
     * 
     * @type {Sequence[]}
     */
    i(this, "sequences");
    this.name = t, this.sequences = s;
  }
  /**
   * Executes the component's structure on the given stream.
   * 
   * @param {object} options - The options for the component.
   * @param {TokenStream} options.stream - The stream to execute the component on.
   */
  run({ stream: t }) {
    const s = new I(this), e = t.startTransaction(), n = new x(this.name);
    n.init(t.current);
    for (const o of this.sequences) {
      if (o.run({ stream: t, scope: s, astNode: n }) === u)
        return e(), u;
      n.end = t.prev.end;
    }
    return n.assign(s), n;
  }
}
class d {
  /**
   * Creates a new sequence with the given name.
   * 
   * @param {string} name - The name of the sequence.
   * @param {SequenceHandler} handler - The handler function for the sequence.
   */
  constructor(t, s) {
    /**
     * The name of the sequence.
     * 
     * @type {string}
     */
    i(this, "name");
    /**
     * The handler function for the sequence.
     * 
     * @type {SequenceHandler}
     */
    i(this, "handler");
    /**
     * The matched token or value.
     * 
     * @type {Token|string|undefined}
     */
    i(this, "match");
    /**
     * Whether to move the cursor or not.
     * 
     * @type {boolean}
     */
    i(this, "movesCursor", !1);
    /**
     * The name of the scope.
     * 
     * @type {string}
     */
    i(this, "scopeName");
    this.name = t, this.handler = s;
  }
  /**
   * Executes the sequence on the provided stream and logs the current character.
   *
   * @param {Object} options - The options object.
   * @param {TokenStream} options.stream - The stream to execute the sequence on.
   * @param {Scope} options.scope - The scope object.
   * @param {ASTNode} options.astNode - The AST node to update.
   * @returns {Symbol|true}
   */
  run({ stream: t, scope: s, astNode: e }) {
    return this.handler.call(this, { stream: t, scope: s, astNode: e });
  }
  /**
   * Marks the sequence to move the cursor after execution.
   * 
   * @returns {this}
   */
  moveCursor() {
    return this.movesCursor = !0, this;
  }
  /**
   * Sets the scope name for the sequence and returns the current object.
   *
   * @param {string} name - The name to set for the scope.
   * @returns {this}
   */
  as(t) {
    return this.scopeName = t, this;
  }
}
class S {
  /**
   * Initializes a new instance of the TokenStream class.
   * 
   * @param {Token[]} tokens - The tokens in the stream.
   */
  constructor(t) {
    /**
     * The tokens in the stream.
     * 
     * @type {Token[]}
     */
    i(this, "tokens");
    /**
     * The current cursor position in the stream.
     * 
     * @type {number}
     */
    i(this, "cursor", 0);
    this.tokens = t;
  }
  /**
   * Moves the cursor to the next token in the stream and returns it.
   * 
   * @type {Token|undefined}
   */
  moveNext() {
    return this.tokens[++this.cursor];
  }
  /**
   * Moves the cursor to the previous token in the stream and returns it.
   * If the cursor is at the beginning of the stream, this will return undefined.
   * 
   * @type {Token|undefined}
   */
  movePrev() {
    return this.tokens[--this.cursor];
  }
  /**
   * Returns the next token in the stream. If the cursor is at the end of the
   * stream, this will return undefined.
   * 
   * @type {Token|undefined}
   */
  get next() {
    return this.tokens[this.cursor + 1];
  }
  /**
   * Returns the previous token in the stream. If the cursor is at the start of
   * the stream, this will return undefined.
   * 
   * @type {Token|undefined}
   */
  get prev() {
    return this.tokens[this.cursor - 1];
  }
  /**
   * Returns the current token in the stream.
   * 
   * @type {Token|undefined}
   */
  get current() {
    return this.tokens[this.cursor];
  }
  /**
   * Checks if the tokens in the stream match the given target(s).
   * 
   * @param {string|symbol|(string|symbol)[]} targets - The target(s) to match.
   * @param {object} [options] - The options for the match.
   * @return {Token[]|false} Returns true if the tokens match the target(s), false otherwise.
   */
  match(t) {
    Array.isArray(t) || (t = [t]);
    const s = this.tokens.slice(this.cursor, this.cursor + t.length);
    return s.every((n, o) => {
      const c = t[o];
      if (typeof c == "symbol")
        return n.name === c;
      if (typeof c == "string" && n.name === w)
        return n.value === c;
    }) ? s : !1;
  }
  /**
   * Starts a transaction and returns a rollback function.
   *
   * @returns {Function} The rollback function that resets the cursor.
   */
  startTransaction() {
    const { cursor: t } = this;
    function s() {
      this.cursor = t;
    }
    return s.bind(this);
  }
  /**
   * Consumes all the tokens in the stream until it reaches any of the given targets.
   * 
   * @param {symbol|symbol[]} target - The target(s) to match.
   * @returns {undefined|[TokenStack,symbol]} Returns a stack of tokens until it
   * reaches any of the given targets or undefined if any of the targets is not
   * found in the stream.
   */
  until(t) {
    const s = new m(), e = this.tokens.slice(this.cursor);
    Array.isArray(t) || (t = [t]);
    t: for (const n of e)
      for (const o of t)
        if (n.name !== o) {
          s.push(n), this.cursor++;
          continue t;
        } else
          return [s, o];
  }
}
class I {
  /**
   * Initializes a new instance of the Scope class.
   *
   * @param {Component} component - The component associated with this scope.
   */
  constructor(t) {
    /**
     * The component associated with this scope.
     * 
     * @type {Component}
     */
    i(this, "component");
    /**
     * The scope object.
     * 
     * @type {object}
     */
    i(this, "scope", {});
    this.component = t;
  }
  /**
   * Assigns the given value to the scope using the sequence's scope name as the key.
   *
   * @param {Sequence} sequence - The sequence whose scope name is used as the key.
   * @param {*} value - The value to be assigned to the scope.
   */
  set(t, s) {
    t.scopeName && (this.scope[t.scopeName] = s);
  }
}
class x {
  /**
   * Constructs an AST node.
   * 
   * @param {string} name - The name of the node.
   */
  constructor(t) {
    this.name = t;
  }
  /**
   * Initializes the AST node with the properties of a given token.
   *
   * @param {Token} token - The token containing start, end, and
   * line information.
   */
  init(t) {
    this.start = t.start, this.end = t.end, this.line = t.line;
  }
  /**
   * Assigns the properties from the given scope's scope object to
   * the AST node.
   * 
   * @param {Scope} scope - The scope containing the properties to
   * be assigned to the AST node.
   */
  assign(t) {
    for (const s in t.scope) {
      const e = t.scope[s];
      e instanceof m ? e.length > 0 && (this[s] = {
        value: e,
        start: e.first.start,
        end: e.latest.end
      }) : console.log("ast-node nasıl karışacak?");
    }
  }
}
function G(r, t) {
  return new A(r, t);
}
const u = Symbol("failed");
function z(r) {
  return new d("match", function({ stream: t, scope: s }) {
    let e;
    return (e = t.match(r)) ? (this.match = r, s.set(this, e), this.movesCursor && (t.cursor += e.length), !0) : u;
  });
}
function L(r) {
  return new d("not", function({ stream: t }) {
    return t.match(r) ? u : !0;
  });
}
function q(r) {
  return new d("until", function({ stream: t, scope: s }) {
    const e = t.until(r);
    return e === void 0 ? u : (this.match = e[1], s.set(this, e[0]), !0);
  });
}
export {
  x as ASTNode,
  A as Component,
  u as FAILED,
  E as Parser,
  I as Scope,
  d as Sequence,
  S as TokenStream,
  G as component,
  z as match,
  L as not,
  q as until
};
