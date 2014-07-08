

//////////////////////////////////////////
// Initiated by eminem. June.2o14

var fs = require('fs');
var path = require('path');
var pat = /\.json$/i;

function isTargetClass(name){
	return 'Label' == name ||
		'TextArea' == name || 
		'TextButton' == name;
}

function parseJsonTree(tree, rootName){
	// classname
	// children
	// options
	//console.log('under ' + rootName);

	if(isTargetClass(tree.classname)){
		var text = tree.options && tree.options.text;
		var name = tree.options && tree.options.name || 'null';
		if(text){
			console.log(rootName + '.' + name + ':' + '"' + text + '"');
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

function processOne(fullpath){
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
	}
}

function walkDir(path, handler){
	fs.readdir(path, function(err, files){
		if(err){
			//console.error('error dir reading');
		} else {
			files.forEach(function(item){
				var full = path + '/' + item;
				fs.stat(full, function(err1, stats){
					if(err1){
						//console.error('state error');
					} else {
						if( stats.isDirectory()){
							walkDir(full, handler);
						} else{
							handler(full);
						}
					}
				});
			});
		}
	});
}

walkDir(__dirname, processOne);