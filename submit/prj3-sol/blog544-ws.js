import assert from 'assert';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import querystring from 'querystring';

import BlogError from './blog-error.js';

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

export default function serve(port, meta, model) {
  const app = express();
  app.locals.port = port;
  app.locals.meta = meta;
  app.locals.model = model;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

function setupRoutes(app) {
  //console.log(app.locals.meta);
  const my_meta = app.locals.meta;
  app.use(cors());
  app.use(bodyParser.json());
  //@TODO
  app.get('/', doBase(app));
  app.get('/meta', doMeta(app))
  	
	for(const category of Object.keys(app.locals.meta)){
		app.get(`/${category}`, doGet_1(category,app));
		app.get(`/${category}/:id`, doGet_2(category,app));
		app.delete(`/${category}/:id`, doDelete(category,app));
		app.post(`/${category}`, doCreate(category,app));
		app.patch(`/${category}/:id`, doUpdate(category,app));
	}
}

/****************************** Handlers *******************************/
function doBase(app){
    return errorWrap(async function(req, res) {
	const links = [{"rel" : "self","name" : "self","url" : "http://localhost:2345"},
		       {"url" : "http://localhost:2345/meta","name" : "meta","rel" : "describedby"},
		       {"rel" : "collection","url" : "http://localhost:2345/users","name" : "users"},
		       {"rel" : "collection","name" : "articles","url" : "http://localhost:2345/articles"},
		       {"rel" : "collection","name" : "comments","url" : "http://localhost:2345/comments"}];
	res.json({'links':links});
    });
}

function doMeta(app){
	return errorWrap(async function(req, res) {
	const temp = requestUrl(req);
	app.locals.meta['links'] = [{"rel" : "self","href" : temp,"name" : "self"}];
	res.json(app.locals.meta);
    });
}

function doGet_1(category,app){
	return errorWrap(async function(req,res){
		var i,j=0,counter=5,temp=[],result,url1,url2,url3,index=0;
	    try{
		
		if(req.query['_count'] !== undefined){counter = parseInt(req.query['_count']);}
		if(req.query['_index'] !== undefined){index = parseInt(req.query['_index']);}
		if(index===0){
			const results = await app.locals.model.find(category,req.query);
			for(i in results){
					if(j === counter){break;}
					(results[i])['links'] = [{"rel":"self","href":requestUrl(req)+'/'+(results[i])['id'],"name":"self"}];
					temp.push(results[i]);
			}
			if(results.length>=counter){
				var next_n = parseInt(counter) + parseInt(index);
				if((req['_parsedUrl']).search === null){var next_str = requestUrl(req)+'?_index='+next_n;var main_str = requestUrl(req);}
				else{var next_str = requestUrl(req)+(req['_parsedUrl']).search+'&_index='+next_n;var main_str = requestUrl(req)+(req['_parsedUrl']).search;}
				
				if(category === "users"){result = {"users":temp,"links":[{"rel" : "self","url" : main_str,"name" : "self"},{"rel":"next","name":"next","url":next_str}],"next":next_n}};
				if(category === "articles"){result = {"articles":temp,"links":[{"rel" : "self","url" : main_str,"name" : "self"},{"rel":"next","name":"next","url":next_str}],"next":next_n}};
				if(category === "comments"){result = {"comments":temp,"links":[{"rel" : "self","url" : main_str,"name" : "self"},{"rel":"next","name":"next","url":next_str}],"next":next_n}};
				res.json(result);
			}
			else{
				if((req['_parsedUrl']).search === null){var main_str = requestUrl(req);}
				else{var main_str = requestUrl(req)+(req['_parsedUrl']).search;}
				
				if(category === "users"){result = {"users":temp,"links":{"rel" : "self","url" : main_str,"name" : "self"}}};
				if(category === "articles"){result = {"articles":temp,"links":{"rel" : "self","url" : main_str,"name" : "self"}}};
				if(category === "comments"){result = {"comments":temp,"links":{"rel" : "self","url" : main_str,"name" : "self"}}};
				res.json(result);
			}
		} // if index===0 ending
		
		else{
			const results = await app.locals.model.find(category,req.query);
			for(i in results){
					if(j === counter){break;}
					(results[i])['links'] = [{"rel":"self","href":requestUrl(req)+'/'+(results[i])['id'],"name":"self"}];
					temp.push(results[i]);
			}
			
			if(results.length>=counter){
				var next_n = parseInt(counter) + parseInt(index);
				var previous_n = parseInt(index) - parseInt(counter);
				var next_str = requestUrl(req)+(req['_parsedUrl']).search; next_str = next_str.replace(/.$/,next_n);
				var main_str = requestUrl(req)+(req['_parsedUrl']).search;
				var previous_str = requestUrl(req)+(req['_parsedUrl']).search; previous_str = previous_str.replace(/.$/,previous_n);
				if(category==='users'){result={"users":temp,"links":[{"rel":"self","url":main_str,"name":"self"},{"rel":"next","url":next_str,"name":"next"},{"rel":"prev","url":previous_str,"name":"prev"}],"next":next_n,"prev":previous_n};}
				if(category==='articles'){result={"articles":temp,"links":[{"rel":"self","url":main_str,"name":"self"},{"rel":"next","url":next_str,"name":"next"},{"rel":"prev","url":previous_str,"name":"prev"}],"next":next_n,"prev":previous_n};}
				if(category==='comments'){result={"comments":temp,"links":[{"rel":"self","url":main_str,"name":"self"},{"rel":"next","url":next_str,"name":"next"},{"rel":"prev","url":previous_str,"name":"prev"}],"next":next_n,"prev":previous_n};}
				res.json(result);
			}
			else{
				var previous_n = parseInt(index) - parseInt(counter);
				var main_str = requestUrl(req)+(req['_parsedUrl']).search;
				var previous_str = requestUrl(req)+(req['_parsedUrl']).search; previous_str = previous_str.replace(/.$/,previous_n);
				if(category==='users'){result={"users":temp,"links":[{"rel":"self","url":main_str,"name":"self"},{"rel":"prev","url":previous_str,"name":"prev"}],"prev":previous_n};}
				if(category==='articles'){result={"articles":temp,"links":[{"rel":"self","url":main_str,"name":"self"},{"rel":"prev","url":previous_str,"name":"prev"}],"prev":previous_n};}
				if(category==='comments'){result={"comments":temp,"links":[{"rel":"self","url":main_str,"name":"self"},{"rel":"prev","url":previous_str,"name":"prev"}],"prev":previous_n};}
				res.json(result);
			}
		}



	    }
	    catch(err){
			const mapped = mapError(err);
			res.status(mapped.status).json(mapped);
	    }
	});
}

function doGet_2(category,app){
	return errorWrap(async function(req,res){
	    try{
		var result;
		const id = req.params.id;
		const obj = await app.locals.model.find(category,{id: id});
		(obj[0])['links'] = [{"rel" : "self","href" : requestUrl(req)+'/'+id,"name" : "self"}];
		if(category === 'users'){result = {'users':obj}};
		if(category === 'articles'){result = {'articles':obj}}
		if(category === 'comments'){result = {'comments':obj}}
		res.json(result);
	    }
	    catch(err){
			const mapped = mapError(err);
			res.status(mapped.status).json(mapped);
		}
	});
}

function doDelete(category,app){
	return errorWrap(async function(req,res){
	    try{
		const id = req.params.id;
		await app.locals.model.remove(category,{id: id});
		res.json({});
	    }
	    catch(err){
			const mapped = mapError(err);
			res.status(mapped.status).json(mapped);
		}
	});
		
}

function doCreate(category,app){
	return errorWrap(async function(req,res){
	    try{
		const obj = req.body;
		console.log(obj);
		//const results = await app.locals.model.create(category,obj);
		//await res.append('Location', `${requestUrl(req)}/${results}`);
		await app.locals.model.create(category,obj);
		res.append('Location', requestUrl(req)+'/'+obj.id);
		res.sendStatus(CREATED);
		res.json({});
	    }
	    catch(err){
			const mapped = mapError(err);
			res.status(mapped.status).json(mapped);
		}
	});
		
}

function doUpdate(category,app){
	return errorWrap(async function(req,res){
	    try{
		const patch = Object.assign({},req.body);
		patch.id = req.params.id;
		await app.locals.model.update(category,patch);
		res.json({});
	    }
	    catch(err){
			const mapped = mapError(err);
			res.status(mapped.status).json(mapped);
		}
	});
}



//@TODO

/**************************** Error Handling ***************************/

/** Ensures a server error results in nice JSON sent back to client
 *  with details logged on console.
 */ 
function doErrors(app) {
  return async function(err, req, res, next) {
    res.status(SERVER_ERROR);
    res.json({ code: 'SERVER_ERROR', message: err.message });
    console.error(err);
  };
}

/** Set up error handling for handler by wrapping it in a 
 *  try-catch with chaining to error handler on error.
 */
function errorWrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      next(err);
    }
  };
}

const ERROR_MAP = {
  BAD_CATEGORY: NOT_FOUND,
  EXISTS: CONFLICT,
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapError(err) {
  console.error(err);
  return (err instanceof Array && err.length > 0 && err[0] instanceof BlogError)
    ? { status: (ERROR_MAP[err[0].code] || BAD_REQUEST),
	code: err[0].code,
	message: err.map(e => e.message).join('; '),
      }
    : { status: SERVER_ERROR,
	code: 'INTERNAL',
	message: err.toString()
      };
} 

/****************************** Utilities ******************************/

/** Return original URL for req (excluding query params)
 *  Ensures that url does not end with a /
 */
function requestUrl(req) {
  const port = req.app.locals.port;
  const url = req.originalUrl.replace(/\/?(\?.*)?$/, '');
  return `${req.protocol}://${req.hostname}:${port}${url}`;
}


const DEFAULT_COUNT = 5;

//@TODO
