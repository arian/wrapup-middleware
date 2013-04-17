Wrapup-middleware
=================

Express middleware for [wrapup](https://github.com/mootools/wrapup).

[![Build Status](https://secure.travis-ci.org/arian/wrapup-middleware.png)](https://travis-ci.org/arian/wrapup-middleware)


### Example

```js
var wrapup = require('wrapup-middleware');

// will require('foo.js')
app.get('/foo.js', wrapup());

// custom require()
app.get('/main.js', wrapup{
	requires: {
		prime: true,
		async: true,
		_: 'underscore', // set window._ = require('underscore')
		'./main.js': true
	}
});

// with some wrapup options
app.get('/js/*.js', wrapup({
	src: __dirname + '/public/js',
	output: __dirname + '/public/out.js',
	compress: true
}));

// instead of one output option (a single file), the dest option can be used
// for multiple files.
app.get('/js/*.js', wrapup({
	dest: __dirname + '/public',
	src: __dirname + '/views/js'
}));
```

### When to use

You don't want to use this in production. Instead you should build the files
and serve it as static files.

```js
app.configure('development', function(){
	app.get('/main.js', wrapup({
		src: __dirname + '/views/js',
		output: __dirname + '/public/main.js'
	}));
});

app.use(express.static(__dirname + '/public'));
```

With this example in a dev environment it will automatically create the static
file. In production it will skip the middleware and directly serve the static
file.
