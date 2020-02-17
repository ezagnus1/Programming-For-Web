// -*- mode: JavaScript; -*-

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

  constructor(meta, options) {
    //@TODO
	this.blog={users:[],articles:[],comments:[]};
    this.meta = meta;
    this.options = options;
    this.validator = new Validator(meta);
  }

  static async make(meta, options) {
    //@TODO
    return new Blog544(meta, options);
  }

  /** Remove all data for this blog */
  async clear() {
    //@TODO
	this.blog={users:[],articles:[],comments:[]};
  }

  /** Create a blog object as per createSpecs and 
   * return id of newly created object 
   */
  async create(category, createSpecs) {
    const obj = this.validator.validate(category, 'create', createSpecs);
    //@TODO
	var x;
	if(category==="users"){this.blog.users.push(obj);}
	else if(category==="articles")
	{
		x = Math.random();
		obj['id'] = x.toString();
		this.blog.articles.push(obj);
	}
	else if(category==="comments")
	{
		x = Math.random();
		obj['id'] = x.toString();
		this.blog.comments.push(obj);
	}
	return(obj['id']);
  }

  /** Find blog objects from category which meets findSpec.  Returns
   *  list containing up to findSpecs._count matching objects (empty
   *  list if no matching objects).  _count defaults to DEFAULT_COUNT.
   */
  async find(category, findSpecs={}) {
    const obj = this.validator.validate(category, 'find', findSpecs);
    //@TODO
    	var flag=true;
	var temp=[];
	var counter=0;
	var i,y,j;
	for(i in findSpecs){counter++;}
	if(counter<1)
	{
		counter=0;
		if(category === "users"){
			for(y in this.blog.users)
			{
				if(counter===5){break;}
				temp.push(this.blog.users[y]);
				counter++;
			}
			return temp;
		}
		
		else if(category === "articles"){
			for(y in this.blog.articles)
			{
				if(counter===5){break;}
				temp.push(this.blog.articles[y]);
				counter++;
			}
			return temp;
		}
		
		else if(category === "comments"){
			for(y in this.blog.comments)
			{
				if(counter===5){break;}
				temp.push(this.blog.comments[y]);
				counter++;
			}
			return temp;
		}
	}
	
	else if(counter>=1)
	{
		counter=0;
		if(category === 'users')
		{
			for(j in this.blog.users)
			{
				flag=true;
				for(i in findSpecs)
				{
					if((i === '_count') && (counter===0)){break;}
					
					if((this.blog.users[j])[i] === findSpecs[i])
					{
						counter++;
					}
					else{if(i === '_count'){break;}flag=false;counter++;break;}
					counter++;
				}
				if(counter>0 && flag === true)
				{
					temp.push(this.blog.users[j]);
				}
			}
			if(counter===0)
			{
				var x = Number(findSpecs[i])-1;
				for(i in this.blog.users){temp.push(this.blog.users[i]);if(counter===x){break;}counter++;}
			}
			return temp;
		}

		if(category === 'articles')
		{
			for(j in this.blog.articles)
			{
				flag=true;
				for(i in findSpecs)
				{
					if((i === '_count') && (counter===0)){break;}
					
					if((this.blog.articles[j])[i] === findSpecs[i])
					{
						counter++;
					}
					else{if(i === '_count'){break;}flag=false;counter++;break;}
					counter++;
				}
				if(counter>0 && flag === true)
				{
					temp.push(this.blog.articles[j]);
				}
			}
			if(counter===0)
			{
				var x = Number(findSpecs[i])-1;
				for(i in this.blog.articles){temp.push(this.blog.articles[i]);if(counter===x){break;}counter++;}
			}
			return temp;
		}

		if(category === 'comments')
		{
			for(j in this.blog.comments)
			{
				flag=true;
				for(i in findSpecs)
				{
					if((i === '_count') && (counter===0)){break;}
					
					if((this.blog.comments[j])[i] === findSpecs[i])
					{
						counter++;
					}
					else{if(i === '_count'){break;}flag=false;counter++;break;}
					counter++;
				}
				if(counter>0 && flag === true)
				{
					temp.push(this.blog.comments[j]);
				}
			}
			if(counter===0)
			{
				var x = Number(findSpecs[i])-1;
				for(i in this.blog.comments){temp.push(this.blog.comments[i]);if(counter===x){break;}counter++;}
			}
			return temp;
		}
	}
  }

  /** Remove up to one blog object from category with id == rmSpecs.id. */
  async remove(category, rmSpecs) {
    const obj = this.validator.validate(category, 'remove', rmSpecs);
    //@TODO
	var i;
	if(category === 'users')
	{
		for(i in this.blog.users)
		{
			if((this.blog.users[i])['id'] === rmSpecs.id){delete(this.blog.users[i]);}
		}
	}
	
	else if(category === 'articles')
	{
		for(i in this.blog.articles)
		{
			if((this.blog.articles[i])['id'] === rmSpecs.id){delete(this.blog.articles[i]);}
		}
	}

	else if(category === 'comments')
	{
		for(i in this.blog.comments)
		{
			if((this.blog.comments[i])['id'] === rmSpecs.id){delete(this.blog.comments[i]);}
		}
	}
  }

  /** Update blog object updateSpecs.id from category as per
   *  updateSpecs.
   */
  async update(category, updateSpecs) {
    const obj = this.validator.validate(category, 'update', updateSpecs);
    //@TODO
	var i,j,flag=true;
	if(category==='users')
	{
		for(i in this.blog.users)
		{
			if((this.blog.users[i])['id'] === updateSpecs.id)
			{
				for(j in updateSpecs)
				{
					if(flag===true){flag=false;continue;}
					(this.blog.users[i])[j] = updateSpecs[j];
				}
			}
		}
	}
	
	else if(category==='articles')
	{
		for(i in this.blog.articles)
		{
			if((this.blog.articles[i])['id'] === updateSpecs.id)
			{
				for(j in updateSpecs)
				{
					if(flag===true){flag=false;continue;}
					(this.blog.articles[i])[j] = updateSpecs[j];
				}
			}
		}
	}

	else if(category==='comments')
	{
		for(i in this.blog.comments)
		{
			if((this.blog.comments[i])['id'] === updateSpecs.id)
			{
				for(j in updateSpecs)
				{
					if(flag===true){flag=false;continue;}
					(this.blog.comments[i])[j] = updateSpecs[j];
				}
			}
		}
	}
  }
  
}

//You can add code here and refer to it from any methods in Blog544.
