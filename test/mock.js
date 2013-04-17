"use strict";

var EventEmitter = require("events").EventEmitter;

// Mock Object for wrapup

function WrapUp(){
	EventEmitter.call(this);
	this.required = [];
	this.opts = null;
	this.piping = null;
	this.upped = false;
}

WrapUp.prototype = Object.create(EventEmitter.prototype);

WrapUp.prototype.options = function(options){
	this.opts = options;
};

WrapUp.prototype.require = function(name, file){
	this.required.push([name, file]);
};

WrapUp.prototype.up = function(){
	this.upped = true;
};

WrapUp.prototype.pipe = function(pipe){
	this.piping = pipe;
};

function Request(){
	this.method = 'GET';
	this.url = '/';
}

function Response(){
	this.responseType = null;
}

Response.prototype.type = function(type){
	this.responseType = type;
};

exports.WrapUp = WrapUp;
exports.Request = Request;
exports.Response = Response;
