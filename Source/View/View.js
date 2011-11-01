/*
---

name: View

description: Provides the base class for every objects that are displayed 
             through an element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity
	
provides:
	- View

...
*/

Moobile.View = new Class({

	Extends: Moobile.Entity,
	
	content: null,

	options: {
		className: 'view'
	},

	teardown: function() {
		this.parent();
		this.content = null;
		return this;
	},

	attachEvents: function() {
		this.parent();
		this.element.addEvent('swipe', this.bound('onSwipe'));
		return this;
	},

	detachEvents: function() {
		this.parent();
		this.element.removeEvent('swipe', this.bound('onSwipe'));
		return this;
	},

	addChild: function(child, where, relative) {

		if (child instanceof Moobile.ViewContent) {
			return this.parent(child);
		}
		
		switch (where) {
			
			case 'header': 
				return this.parent(child, 'top'); 
			
			case 'footer': 
				return this.parent(child, 'bottom'); 
		}

		return this.content.addChild(child, where, relative);
	},

	getChild: function(name) {
		return this.content.getChild(name) || this.parent(name);
	},

	getChildAt: function(index) {
		return this.content.getChildAt(index) || this.parent(index);
	},

	replaceChild: function(replace, child) {
		return this.content.replaceChild(replace, child) || this.parent(replace, child);
	},

	removeChild: function(child) {
		return this.content.removeChild(child) || this.parent(child);
	},

	getContent: function() {
		return this.content;
	},

	rolesWillLoad: function() {
		
		this.parent();
	
		var content = this.getRoleElement('content');
		if (content == null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
		}
		
		this.setRole('content', content);
	},
	
	onSwipe: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
	}

});

Moobile.View.elementFromPath = function(path, callback) {
	new Moobile.Request.View().load(path, callback);
};

/**
 * @role content
 */
Moobile.Entity.defineRole('content', Moobile.View, function(element, options, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.ViewContent, element, options, name);
	if (instance instanceof Moobile.ViewContent) {
		this.addChild(instance);
	}

	this.content = instance;
	
	return instance;
});
