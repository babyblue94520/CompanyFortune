/**
 * 
 */
function HeaderBar(){
	var that = this;
	
	var _ROLE = false;
	var _InputFocus = false;
	
	var _headerHtml = [
		'<header class="common-header">',
	    '</header>'
	].join('');
	
	var _headerItemHtml = [
		'<div class="{0} {1}">{2}</div>'
	].join('');

	var _logoHtml = [
		'<span class="icon-logo">',
		'<span class="path1"></span>',
		'<span class="path2"></span>',
		'<span class="path3"></span>',
		'<span class="path4"></span>',
		'<span class="path5"></span>',
		'<span class="path6"></span>',
		'<span class="path7"></span>',
		'<span class="path8"></span>',
		'<span class="path9"></span>',
		'<span class="path10"></span>',
		'<span class="path11"></span>',
		'<span class="path12"></span>',
		'<span class="path13"></span>',
		'</span>'
	].join('');
	
	
	var _headerItems = {
		'title':{id:'title',text:'天機洩漏',icon:'',className:'left-button'},
		'menu':{id:'menu',text:'',icon:'flaticon-interface',className:'left-button'},
//		'contact':{id:'contact',text:'',icon:'flaticon-microphone',className:'right-button'}
	};

	var _menuBox;
	var _contactBox;
	
	
	var _customHeaderItemAuth = ['logout','logo','contact','menu','title'];
	var _agentHeaderItemAuth = ['logout','logo','contact','menu','title'];
	var _defultHeaderItemAuth = ['login','logo','contact','menu','title'];
	
	
	var _event = {};
	var _$container;
	var _$scrollWrap;
	var _delay = 200;

	that.bind = _bind;
	that.unbind = _unbind;
	that.scrollHide = _scrollHide;
	that.scrollHide = _scrollHide;
	that.hide = _hide;
	that.show = _show;
	that.onHide = false;
	that.onShow = false;
	that.defHeight = 0;
	
	function _init(){
		_$container = $('body');
		if(_$container.find('header[class="common-header"]').length>0){
			return;
		}
		_$container.append(_headerHtml);
		that.$el = _$container.find('header[class="common-header"]');
		that.defHeight = that.$el.height();
		
		//绑定资料异动
		webManage.getStoreService().bind(StoreDataName.USER,function(store){
			if(store.data){
				_ROLE = store.data.role;
			}else{
				_ROLE = false;
			}
			_renderItem();
			that.defHeight = that.$el.height();
		});
		
		//绑定资料异动
		webManage.getStoreService().bind(StoreDataName.INPUTFOCUS,function(store){
			if(store.data){
				_InputFocus = store.data||false;
			}else{
				_InputFocus = store.data||false;
			}
		});
		
		_menuBox = new MenuBox();
//		_contactBox = new ContactBox();
		
	}

	//产生header item
	function _renderItem(){
		that.$el.empty();
		var itemArray = [];
		var itemAuth = _getItemAuth();
		var obj,$item;
		for(var i = 0,l = itemAuth.length;i<l;i++){
			obj = _headerItems[itemAuth[i]];
			if(obj){
				if(obj.html){
					$item = $(String.format(_headerItemHtml,obj.className,obj.icon,obj.html));
				}else{
					$item = $(String.format(_headerItemHtml,obj.className,obj.icon,obj.text));
				}
				$item.bind('click',{itemObj:obj},_getClickEvent);
				itemArray.push($item);
			}
		}
		that.$el.append(itemArray);
		itemArray = itemAuth = obj = $item = null;
	}
	
	//取得item显示权限
	function _getItemAuth(){
		if(_ROLE=='MONEY_CUSTOMER')
			return _customHeaderItemAuth;
		if(_ROLE=='AGENT')
			return _agentHeaderItemAuth;
		return _defultHeaderItemAuth;
	}
	
	//设定按钮事件
	function _getClickEvent(e){
		switch (e.data.itemObj.id){
			case 'login':
				webManage.getDialog().open('login',['index']);
				break;
			case 'logout':
				webManage.getDialog().open('logout');
				break;
			case 'register':
				webManage.getDialog().open('register');
				break;
			case 'logo':
				webManage.loadView('index');
				break;
			case 'contact':
				if(_contactBox.isShow()){
					_contactBox.hide();
				}else{
					_contactBox.show();
				}
				break;
			case 'menu':
				if(_menuBox.isShow()){
					_menuBox.hide();
				}else{
					_menuBox.show();
				}
				break;
			case 'title':
				webManage.loadView('title');
				break;
			default:
		}
	}
	
	/**
	 * 滑动时隐藏
	 * @param {Boolean} hide 
	 * 
	 */
	function _scrollHide(hide){
		_$scrollWrap = _$container.find(' .container');
		if(hide){
			_$container.bind('scroll',_onScroll);
		}else{
			_$container.unbind('scroll',_onScroll);
		}
	}
	
	/**
	 * 计算往上滑动显示
	 */
	var _currentTop = 0;
	function _onScroll(e){
		if(_InputFocus)return;
		delayAction('headerOnScorll',_delay,function(){
			if(_$container.find(' .container').position().top>=0){
				_show();
				return;
			}
			if(_$container.find(' .container').position().top>_currentTop){
				_show();
			}else{
				_hide();
			}
			_currentTop = _$container.find(' .container').position().top;
		});
	}
	
	/**
	 * 绑定事件
	 * @param {String} event 名称
	 * @param {Function} 处理方法
	 */
	function _bind(event,handler){
		if(typeof event !== 'string'){
			alert('event 参数格式错误！');
			return;
		}
		if(typeof handler !== 'function'){
			alert('handler 参数格式错误！');
			return;
		}
		
		if(!_event[event]){
			_event[event] = [];
		}
		_event[event].push(handler);
	}

	/**
	 * 解绑定事件
	 * @param {String} event 名称
	 * @param {Function} 处理方法
	 */
	function _unbind(event,handler){
		if(typeof event !== 'string'){
			alert('event 参数格式错误！');
			return;
		}
		if(typeof handler !== 'function'){
			alert('handler 参数格式错误！');
			return;
		}
		
		if(_event[event]){
			_event[event] = null;
		}
	}
	

	/**
	 * 绑定事件
	 * @param {String} event 名称
	 */
	function _trigger(event){
		if(typeof event !== 'string'){
			alert('event 参数格式错误！');
			return;
		}
		var array = _event[event];
		if(!array)return;
		
		for(var i = 0,l=array.length;i<l;i++){
			array[i]();
		}
	}
	
	/**
	 * 隐藏
	 */
	function _hide(){
		that.$el.css('top',-that.defHeight);
		_trigger('hide');
	}
	
	/**
	 * 显示
	 */
	function _show(){
		that.$el.css('top',0);
		_trigger('show');
	}
	
	_init();
}