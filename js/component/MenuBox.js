/**
 * 选单
 */
function MenuBox(){
	var that = this;
	
	var _ROLE = false;
	var _isShow = false;
	
	var _$info = false;
	var _$itembox = false;
	
	var _menuHtml = [
	    '<div class="common-menu-screen"></div>',
		'<div class="common-menu">',
		'	<div class="user-info"></div>',
		'	<div class="item-box"></div>',
		'	<div class="space-3"></div>',
		'</div>'
	].join('');
   	
	var _menuDefultInfoHtml = [
   		'<section class="stage">',
		'  <figure class="ball"><span class="shadow"></span></figure>',
		'</section>'      
   	].join('');
	
	var _itemHtml = [
		'	<div class="item">',
		'		<div class="icon {0}">{1}</div>',
		'	</div>'
	].join('');
	
	
	//按钮显示内容
	var _menuItems = {
		'index':{id:'index',text:'首页',icon:'flaticon-web-1'},
		'select':{id:'select',text:'找公司名字',icon:'flaticon-coins'},
		'help':{id:'help',text:'救命',icon:'flaticon-mark'}
	};
	
	//按钮显示权限
	var _defultMenuItemAuth = ['index','select','help'];

	var _event = {};
	var _$body;
	
	that.bind = _bind;
	that.unbind = _unbind;
	that.hide = _hide;
	that.show = _show;
	that.isShow = function(){return _isShow;};
	
	/**
	 * 初始化
	 */
	function _init(){
		_$body = $('body');
		if(_$body.find('.common-menu').length>0){
			return;
		}
		_$body.append(_menuHtml);
		$('.common-menu-screen').click(_showOrHide);
		
		that.$el = _$body.find('.common-menu');
		_$info = that.$el.find('.user-info');
		_$itembox = that.$el.find('.item-box');
		
		//绑定资料异动
		manage.getStoreManage().bind(StoreDataName.UserInfo,function(store){
			if(store.data){
				_ROLE = store.data.role;
			}else{
				_ROLE = false;
			}
			_refresh(store.data);
		});
		
	}
	
	/**
	 * 刷新
	 */
	function _refresh(userInfo){
		_renderInfo(userInfo);
		_renderItems();
		
		_$info.find('.photo').click(function(){
			manage.getLoader().open('刷新中',999);
			manage.getUserManage().refresh(function(){
				manage.getLoader().close();
			});
		});
	}
	

	/**
	 * 刷新使用者资讯
	 */
	function _renderInfo(userInfo){
		_$info.append(String.format(_menuDefultInfoHtml,'','',''));
		_$info.find('.ball').click(function(){
			manage.getDialog().open('login');
			_hide();
		});
	}
	
	/**
	 * 刷新选项
	 */
	function _renderItems(){
		_$itembox.empty();
		var array = [],obj,$item,auth = _getItemAuth();
		for(var i in auth){
			obj = _menuItems[auth[i]];
			if(obj){
				$item = $(String.format(_itemHtml,obj.icon,obj.text));
				$item.bind('click',{id:obj.id},_menuItemHandler);
				array.push($item);
			}
		}
		_$itembox.append(array);
		arr = obj = $item = null;
	}
	
	/**
	 * 点击后处理
	 */
	function _menuItemHandler(e){
		setTimeout(_hide,100);
		switch(e.data.id){
			case 'login':
				manage.getDialog().open('login');
				break;
			case 'bbs':
				manage.redirect(e.data.id);
				break;
			case 'logout':
				manage.getDialog().open('logout');
				break;
			default:
				manage.loadView(e.data.id);
		}
	}
	
	
	/**
	 * 取得item显示权限
	 */
	function _getItemAuth(){
		return _defultMenuItemAuth;
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
			_event[event] = new Array();
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
		if($('body').hasClass('show-menu')){
			$('body').removeClass('show-menu');
			_isShow = false;
		}
		_trigger('hide');
	}
	
	/**
	 * 显示
	 */
	function _show(){
		if(!$('body').hasClass('show-menu')){
			$('body').addClass('show-menu');
			_isShow = true;
		}
		_trigger('show');
	}
	
	function _showOrHide(){
		if($('body').hasClass('show-menu')){
			$('body').removeClass('show-menu');
			_isShow = false;
		}else{
			$('body').addClass('show-menu');
			_isShow = true;
		}
	}
	
	_init();
}