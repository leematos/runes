"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	fs = require("fs"),
	url = require("url"),
	color = require("cli-color"),
	fileUtil = require("xutil").file,
	shared = require("shared"),
	diffUtil = require("xutil").diff,
	path = require("path"),
	tiptoe = require("tiptoe");

shared.getSetsToDo().serialForEach(processSet, function(err)
{
	if(err)
	{
		base.error(err);
		process.exit(1);
	}

	process.exit(0);
});

function processSet(code, cb)
{
	base.info("Processing set: %s", code);

	tiptoe(
		function getJSON()
		{
			fs.readFile(path.join(__dirname, "..", "json", code + ".json"), {encoding : "utf8"}, this);
		},
		function processCards(setRaw)
		{
			var newSet = base.clone(C.SETS.mutateOnce(function(SET) { return SET.code===code ? SET : undefined; }));
			newSet.cards = JSON.parse(setRaw).cards;
			newSet.code = code; // Needed for shared.saveSet()

			shared.saveSet(newSet, this);
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}
