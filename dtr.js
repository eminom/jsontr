

//////////////////////////////////////////
// Initiated by eminem. June.
// Revserse procedure for tr.js

var fs = require('fs');
var path = require('path');
var pat = /\.json$/i;

function genProcess(oc){
	function parseJsonTree(tree, rootName){
		var name = tree.options && tree.options.name || 'null';
		var key = rootName + '.' + name;

		if ( oc[key] ){
			if( tree.options && tree.options.text ){
				tree.options.text = oc[key];
			}
		}

		//recursively parsing
		var name = tree.options && tree.options.name || 'null';
		var rootNext = rootName + '.' + name;
		if( tree.children && Array.isArray(tree.children) ){
			var len = tree.children.length;
			for(var i=0;i<len;++i){
				parseJsonTree(tree.children[i], rootNext);
			}
		}
	}

	return function(fullpath){
		if( !pat.exec(fullpath)){
			return;
		}
		// console.log(fullpath);
		var pos = fullpath.lastIndexOf('/');
		var name = pos >= 0 ? fullpath.substr(pos+1) : fullpath;

		var content = require(fullpath);
		//console.log(JSON.stringify(content));

		if( content.widgetTree ){
			parseJsonTree(content.widgetTree, name);

			var newContent = JSON.stringify(content);
			fs.writeFileSync(fullpath, newContent);
		}
	}
};// end of gen


function dWalk(path, handler){
	var dirs  = fs.readdirSync(path);
	dirs.forEach(function(item){
		var full = path + '/' + item;
		try{
			var st = fs.statSync(full);
			if(st.isDirectory()){
			} else {
				handler(full);
			}
		}catch(err){
		}
	});
}

function loadCodes(path){
	var dict = {};
	var buf = fs.readFileSync(path,'utf8');
	buf.replace(/\r/g, '\n');
	var lines = buf.split('\n');	//Windows splits in here
	//console.log(lines.length);
	var count = lines.length;
	for(var i=count-1;i>=0;--i){
		var line = lines[i];
		var left = line.indexOf('"');
		if(left < 2){
			continue;
		}
		var key = line.substr(0, left - 1);
		dict[key] = line.substr(left + 1, line.length - (left+1) - 1);
	}

	// Open this for debug
	// for(var k in dict){
	// 	console.log(k+ ':' + '(' + dict[k] + ')');
	// }

	return dict;
}

//
var oc = loadCodes(path.join(__dirname, 'input.txt'))
var processOne = genProcess(oc);
dWalk(__dirname, processOne);

