//     JavaScript Expression Parser (JSEP) 0.3.0
//     JSEP may be freely distributed under the MIT License
//     http://jsep.from.so/

/*global module: true, exports: true, console: true */
(function (root) {
	'use strict';
	// Node Types
	// ----------

	// This is the full set of types that any JSEP node can be.
	// Store them here to save space when minified
	var COMPOUND = 'Compound',
		IDENTIFIER = 'Identifier',
		MEMBER_EXP = 'MemberExpression',
		LITERAL = 'Literal',
		THIS_EXP = 'ThisExpression',
		CALL_EXP = 'CallExpression',
		UNARY_EXP = 'UnaryExpression',
		BINARY_EXP = 'BinaryExpression',
		LOGICAL_EXP = 'LogicalExpression',
		CONDITIONAL_EXP = 'ConditionalExpression',
		ARRAY_EXP = 'ArrayExpression',

		PERIOD_CODE = 46, // '.'
		COMMA_CODE  = 44, // ','
		SQUOTE_CODE = 39, // single quote
		DQUOTE_CODE = 34, // double quotes
		OPAREN_CODE = 40, // (
		CPAREN_CODE = 41, // )
		OBRACK_CODE = 91, // [
		CBRACK_CODE = 93, // ]
		QUMARK_CODE = 63, // ?
		SEMCOL_CODE = 59, // ;
		COLON_CODE  = 58; // :

	var evalBool = function(val) {
		if ((typeof val)==='boolean')
			return val;
		else
			return JSON.parse(val);
	}
	var unjsep = function(node) {
		switch (node.type) {
			case COMPOUND: return node.body.map(function(arg){return unjsep(arg)}).join(" ");
			case LITERAL: return node.raw;
			case IDENTIFIER: return node.name;
			case BINARY_EXP: return "(" + unjsep(node.left) + ")" + node.operator +  "(" + unjsep(node.right) + ")";
			case UNARY_EXP: return node.operator + unjsep(node.argument);
			case CALL_EXP: {
				let result = "("+unjsep(node.callee)+")" + "(" + node.arguments.map(function(arg){return unjsep(arg)}).join(",")+ ")"
                result = `${result}`
				return result;
			}
			case MEMBER_EXP: return unjsep(node.object) + (evalBool(node.computed)?("[" + unjsep(node.property) + "]"):("."+unjsep(node.property)));
			case THIS_EXP: return this_str;
			case LOGICAL_EXP: return "(" + unjsep(node.left) + ")" + node.operator +  "(" + unjsep(node.right) + ")";
			case CONDITIONAL_EXP: return "(" + unjsep(node.test) + ")?(" + unjsep(node.consequent) + "):(" + unjsep(node.alternate) + ")";
			case ARRAY_EXP: return  "[" + node.elements.map(function(arg){return unjsep(arg)}).join(",")+ "]";
			default: return "#";
		}
	}

	// In desktop environments, have a way to restore the old value for `unjsep`
	if (typeof exports === 'undefined') {
		var old_unjsep = root.unjsep;
		// The star of the show! It's a function!
		root.unjsep = unjsep;
		// And a courteous function willing to move out of the way for other similarly-named objects!
		unjsep.noConflict = function() {
			if(root.unjsep === unjsep) {
				root.unjsep = old_unjsep;
			}
			return unjsep;
		};
	} else {
		// In Node.JS environments
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = unjsep;
		} else {
			exports.parse = unjsep;
		}
	}
}(this));
