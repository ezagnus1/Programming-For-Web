// -*- mode: JavaScript; -*-

import mongo from 'mongodb';

import BlogError from './blog-error.js';
import Validator from './validator.js';

//debugger; //uncomment to force loading into chrome debugger

/**
A blog contains users, articles and comments.  Each user can have
multiple Role's from [ 'admin', 'author', 'commenter' ]. An author can
create/update/remove articles.  A commenter can comment on a specific
article.

Errors
======

DB:
  Database error

BAD_CATEGORY:
  Category is not one of 'articles', 'comments', 'users'.

BAD_FIELD:
  An object contains an unknown field name or a forbidden field.

BAD_FIELD_VALUE:
  The value of a field does not meet its specs.

BAD_ID:
  Object not found for specified id for update/remove
  Object being removed is referenced by another category.
  Other category object being referenced does not exist (for example,
  authorId in an article refers to a non-existent user).

EXISTS:
  An object being created already exists with the same id.

MISSING_FIELD:
  The value of a required field is not specified.

*/

export default class Blog544 {

  constructor(client_con,db,meta, options) {
    //@TODO
	this.client_con = client_con;
	this.db = client_con.db(db);
	this.users = this.db.collection('users');
	this.articles = this.db.collection('articles');
	this.comments = this.db.collection('comments');
    this.meta = meta;
    this.options = options;
    this.validator = new Validator(meta);
  }

  /** options.dbUrl contains URL for mongo database */
  static async make(meta, options) {
    //@TOD
	const splits = options.dbUrl.split('://');
	const index = options.dbUrl.lastIndexOf('/');
	if(index<0 || splits.length !== 2 || splits[0]!== 'mongodb')
	{
		const msg = `BAD MONGODB URL '${options.dbUrl}'`;
		throw [new BlogError('BAD_MONGO_URL',msg)];
	}
	
	const db = options.dbUrl.slice(index+1);
	const client_con = await mongo.connect(options.dbUrl,MONGO_CONNECT_OPTIONS);
	
    return new Blog544(client_con,db,meta, options);
  }

  /** Release all resources held by this blog.  Specifically, close
   *  any database connections.
   */
  async close() {
	this.client_con.close();
    //@TODO
  }

  /** Remove all data for this blog */
  async clear() {
	await this.users.deleteMany({});
	await this.articles.deleteMany({});
	await this.comments.deleteMany({});
    //@TODO
  }

  /** Create a blog object as per createSpecs and 
   * return id of newly created object 
   */
  async create(category, createSpecs) {
    const obj = this.validator.validate(category, 'create', createSpecs);
	var x;
	if(category==="users")
	{
		obj['_id'] = obj['id'];
		await this.users.insertOne(obj);
	}
	else if(category==="articles")
	{
		x = Math.random();
		obj['_id'] = x.toString();
		obj['id'] = x.toString();
		await this.articles.insertOne(obj);
	}
	else if(category==="comments")
	{
		x = Math.random();
		obj['_id'] = x.toString();
		obj['id'] = x.toString();
		await this.comments.insertOne(obj);
	}
	return(obj['_id']);
    //@TODO
  }

  /** Find blog objects from category which meets findSpec.  
   *
   *  First returned result will be at offset findSpec._index (default
   *  0) within all the results which meet findSpec.  Returns list
   *  containing up to findSpecs._count (default DEFAULT_COUNT)
   *  matching objects (empty list if no matching objects).  _count .
   *  
   *  The _index and _count specs allow paging through results:  For
   *  example, to page through results 10 at a time:
   *    find() 1: _index 0, _count 10
   *    find() 2: _index 10, _count 10
   *    find() 3: _index 20, _count 10
   *    ...
   *  
   */
  async find(category, findSpecs={}) {
    const obj = this.validator.validate(category, 'find', findSpecs);
    //@TODO
	var flag_count=false,flag_index=false,flag_other=false;
	var temp_i,temp_spec;
	var limit=5,_index=0;
    	var flag=true;
	var counter=0;
	var temp=[],temp2=[];
	var i,y,j;
	for(i in findSpecs){counter++;}
	if(counter<1)
	{
		if(category === "users"){
			const result = await this.users.find().sort({creationTime:-1}).limit(5).toArray();
			for(i=0;i<5;i++){await delete (result[i])['_id'];}
			return result;
		}
	
		
		else if(category === "articles"){
			const result = await this.articles.find().sort({creationTime:-1}).limit(5).toArray();
			for(i=0;i<5;i++){await delete (result[i])['_id'];}
			return result;
		}
		
		else if(category === "comments"){
			const result = await this.comments.find().sort({creationTime:-1}).limit(5).toArray();
			for(i=0;i<5;i++){await delete (result[i])['_id'];}
			return result;
		}
	}
	
	else if(counter>=1)
	{
		counter=0;
		if(category === 'users')
		{
			for(var t in findSpecs)
			{
				if(t === '_count'){limit = Number(findSpecs[t]); flag_count=true;}
				else if(t === '_index'){_index = Number(findSpecs[t]);flag_index=true;}
				else{temp_i = t;temp_spec=findSpecs[t];flag_other=true;}
			}

			if(flag_other)
			{
				if(temp_i==='creationTime')
				{
					const result2 = await this.users.find().sort({creationTime:-1}).skip(_index).toArray();
					for(j=0;j<result2.length;j++)
					{
						if(Date.parse(temp_spec) > (Date.parse(((result2[j])['creationTime']))).toString()){await temp.push(result2[j]);}
					}
				}
				else{
						var query = {[temp_i]: temp_spec}
						temp = await this.users.find(query).sort({creationTime:-1}).skip(_index).limit(limit).toArray();
				}
			}
			else{
				temp = await this.users.find().sort({creationTime:-1}).skip(_index).limit(limit).toArray();
			}
			
			if(limit>temp.length){limit=temp.length}
			for(y=0;y<limit;y++){
				
				delete (temp[y])['_id'];
				await temp2.push(temp[y]);
			}
				return temp2;
		}

		if(category === 'articles')
		{
			for(var t in findSpecs)
			{
				if(t === '_count'){limit = Number(findSpecs[t]); flag_count=true;}
				else if(t === '_index'){_index = Number(findSpecs[t]);flag_index=true;}
				else{temp_i = t;temp_spec=findSpecs[t];flag_other=true;}
			}

			if(flag_other)
			{
				if(temp_i==='creationTime')
				{
					const result2 = await this.articles.find().sort({creationTime:-1}).skip(_index).toArray();
					for(j=0;j<result2.length;j++)
					{
						if(Date.parse(temp_spec) > (Date.parse(((result2[j])['creationTime']))).toString()){await temp.push(result2[j]);}
					}
				}
				else{
						var query = {[temp_i]: temp_spec}
						temp = await this.articles.find(query).sort({creationTime:-1}).skip(_index).limit(limit).toArray();
				}
			}
			else{
				temp = await this.articles.find().sort({creationTime:-1}).skip(_index).limit(limit).toArray();
			}
			
			if(limit>temp.length){limit=temp.length}
			for(y=0;y<limit;y++){
				
				delete (temp[y])['_id'];
				await temp2.push(temp[y]);
			}
				return temp2;
		}

		if(category === 'comments')
		{
			for(var t in findSpecs)
			{
				if(t === '_count'){limit = Number(findSpecs[t]); flag_count=true;}
				else if(t === '_index'){_index = Number(findSpecs[t]);flag_index=true;}
				else{temp_i = t;temp_spec=findSpecs[t];flag_other=true;}
			}

			if(flag_other)
			{
				if(temp_i==='creationTime')
				{
					const result2 = await this.comments.find().sort({creationTime:-1}).skip(_index).toArray();
					for(j=0;j<result2.length;j++)
					{
						if(Date.parse(temp_spec) > (Date.parse(((result2[j])['creationTime']))).toString()){await temp.push(result2[j]);}
					}
				}
				else{
						var query = {[temp_i]: temp_spec}
						temp = await this.comments.find(query).sort({creationTime:-1}).skip(_index).limit(limit).toArray();
				}
			}
			else{
				temp = await this.comments.find().sort({creationTime:-1}).skip(_index).limit(limit).toArray();
			}
			
			if(limit>temp.length){limit=temp.length}
			for(y=0;y<limit;y++){
				
				delete (temp[y])['_id'];
				await temp2.push(temp[y]);
			}
				return temp2;
		}
		
	}

  }

  /** Remove up to one blog object from category with id == rmSpecs.id. */
  async remove(category, rmSpecs) {
    const obj = this.validator.validate(category, 'remove', rmSpecs);
	var query = {"_id":rmSpecs['id']};
	if(category === 'users')
	{
			await this.users.deleteOne(query);
	}
	
	else if(category === 'articles')
	{
			await this.articles.deleteOne(query);
	}

	else if(category === 'comments')
	{
			await this.comments.deleteOne(query);
	}
    //@TODO
  }

  /** Update blog object updateSpecs.id from category as per
   *  updateSpecs.
   */
  async update(category, updateSpecs) {
    const obj = this.validator.validate(category, 'update', updateSpecs);
	var j,flag=true;
	var query = {"_id":updateSpecs.id};
	var newvalues;
	if(category==='users')
	{
		for(j in updateSpecs)
		{
			if(flag===true){flag=false;continue;}
			newvalues = { $set: {[j]: updateSpecs[j]} };
			await this.users.updateOne(query,newvalues);
		}
	}
	
	else if(category==='articles')
	{
		for(j in updateSpecs)
		{
			if(flag===true){flag=false;continue;}
			newvalues = { $set: {[j]: updateSpecs[j]} };
			await this.articles.updateOne(query,newvalues);
		}
	}

	else if(category==='comments')
	{
		for(j in updateSpecs)
		{
			if(flag===true){flag=false;continue;}
			newvalues = { $set: {[j]: updateSpecs[j]} };
			await this.comments.updateOne(query,newvalues);
		}
	}
  }
    //@TODO
  
  
}

const DEFAULT_COUNT = 5;

const MONGO_CONNECT_OPTIONS = { useUnifiedTopology: true };
