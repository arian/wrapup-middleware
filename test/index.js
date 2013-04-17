"use strict";

var expect = require('expect.js');
var path = require('path');
var mock = require('./mock');
var middle = require('../');

var next = function(){};
var WrapUp = mock.WrapUp;
var Request = mock.Request;
var Response = mock.Response;

describe('wrapup-middleware', function(){

	it('should return a function', function(){
		expect(typeof middle()).to.be('function');
	});

	it('should call next when the method is not GET', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		req.method = 'POST';
		var count = 0, next = function(){ count++; };

		middle()(req, res, next);

		expect(count).to.be(1);
	});

	it('should set the response type to "js"', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		middle(null, wrup)(req, res, next);
		expect(res.responseType).to.be('js');
	});

	it('should call next with an error object when wrapup fails', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		var err, next = function(e){ err = e; };

		middle(null, wrup)(req, res, next);

		var error = new Error('failure');
		wrup.emit('error', error);

		expect(err).to.be(error);
	});

	it('should pipe the output in the response', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		middle(null, wrup)(req, res, next);
		expect(wrup.piping).to.be(res);
	});

	it('should set some wrup options', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		var opts = {output: 'some-file.js'};
		middle(opts, wrup)(req, res, next);
		expect(wrup.opts).to.be(opts);
	});

	it('should require the url', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		req.url = '/foo.js';
		middle(null, wrup)(req, res, next);
		expect(wrup.required[0][0]).to.be(path.normalize(__dirname + '/../foo.js'));
	});

	it('should set the output option with the dest option and req.url', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		req.url = '/js/foo.js';
		middle({dest: __dirname + '/public/'}, wrup)(req, res, next);
		expect(wrup.opts.output).to.equal(__dirname + '/public/js/foo.js');
	});

	it('should require the url from a src path', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		req.url = '/foo.js';
		middle({src: __dirname + '/foo'}, wrup)(req, res, next);
		expect(wrup.required[0][0]).to.be(path.normalize(__dirname + '/foo/foo.js'));
	});

	it('should configure to require multiple modules', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		req.url = '/foo.js';
		middle({requires: {
			'prime': true,
			'elements': '../elements',
			'../moofx': true
		}}, wrup)(req, res, next);
		expect(wrup.required.length).to.be(3);
		expect(wrup.required[0][0]).to.be('prime');
		expect(wrup.required[1][0]).to.be('elements');
		expect(wrup.required[1][1]).to.be('../elements');
		expect(wrup.required[2][0]).to.be('../moofx');
	});

	it('should call wrup.up', function(){
		var req = new Request(), res = new Response(), wrup = new WrapUp();
		req.url = '/foo.js';
		middle(null, wrup)(req, res, next);
		expect(wrup.upped).to.be.ok();
	});

});

