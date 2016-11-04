/**
 * 手风琴选项
 */
function AccordionItem(config){
	var _config = {
		create:true,
		appendEl:false,
		difference:0,
		data:false,
		loadHandler:false
	};
	$.extend(_config,config);
	
	var _loaded = {};
	//
	var _itemHtmlTemplate = [
		'<li>',
		'	<div class="title">{0}</div>',
		'	<div class="page"></div>',
		'</li>'
	].join('');
	
	_init();
	
	/**
	 * 初始化
	 */
	function _init(){
		//必须为jQuery物件
		if(!_config.appendEl||!(_config.appendEl instanceof jQuery)){
			console.error('AccordionItem:必须为jQuery物件');
			return;
		}
		_config.appendEl.addClass('accordion-item');
		
		if(_config.create&&$.isArray(_config.data)){
			_createItem(_config.data);
		}else if($.isArray(_config.data)){
			_addEvent1(_config.data);
		}else{
			_addEvent2();
		}
	}


	/**
	 * 产生选项
	 */
	function _createItem(data){
		var $array = [];
		var $el ;
		for(var i in data){
			obj = data[i];
			$el = $(String.format(_itemHtmlTemplate,obj.name));
			$el.find('.title').bind('click',{page:obj},_itemClickHandler);
			$array.push($el);
		}
		_config.appendEl.append($array);
	}

	/**
	 * 添加事件
	 */
	function _addEvent1(data){
		var $els = _config.appendEl.find('>li>.title');
		var $el;
		for(var i in $els){
			$el = $els.eq(i);
			$el.bind('click',{page:data[i]},_itemClickHandler);
		}
	}

	/**
	 * 添加事件
	 */
	function _addEvent2(){
		_config.appendEl.find('>li>.title').bind('click',_itemClickHandler);
	}
	
	/**
	 * title click event
	 */
	function _itemClickHandler(e){
		var $title = $(this);
		if($title.parent().hasClass('active')){
			$title.next().css({opacity:0,height:0});
			$title.parent().removeClass('active');
		}else{
			
			//关闭其他打开的
			_config.appendEl.find('>li.active .page').css({opacity:0,height:0});
			_config.appendEl.find('>li.active').removeClass('active');
			
			if(e.data&&e.data.page&&!_loaded[e.data.page.id]){
				_loadContent($title.next(),e.data.page,function(){
					_active($title);
				});
			}else{
				_active($title);
			}
		}
	}
	
	/**
	 * 
	 */
	function _active($el){
		$el.parent().addClass('active');
		$el.next().css({opacity:1,height:$el.next().find('.tab-content').height()});
		_scrollTop($el.next());
	}
	
	/**
	 * page scrollTop
	 */
	function _scrollTop($el){
		if(!$el||$el.length==0)return;
		setTimeout(function(){
			$('body>div').scrollTop($el.position().top-_config.difference);
		},0);
	}
	
	/**
	 * load content
	 */
	function _loadContent($el,page,callback){
		if(_loaded[page.id]){
			$.isFunction(callback)&&callback();
			return;
		};
		_loaded[page.id] = true;
		if($.isFunction(_config.loadHandler)){
			_config.loadHandler.apply(null,[$el,page]);
			callback();
		}else{
			$el.load(page.htmlUrl+'?v='+Config.VERSION,callback);
		}
	}
	
}