/**
 * 选单
 */
function MenuBox(){
	var that = this;
	
	var _ROLE = false;
	var _isShow = false;
	
	var _$info = false;
	var _$nodebox = false;
	
	var _menuHtml = [
	    '<div class="common-menu-screen"></div>',
		'<div class="common-menu">',
		'	<div class="user-info"></div>',
		'	<div class="node-box"></div>',
		'	<div class="space-3"></div>',
		'</div>'
	].join('');
	
	var _menuCustomInfoHtml = [
		'<div class="photo"><img src="/images/user/level/{3}.jpg" /></div>',
		'<div class="info">',
		'	<div class="row">',
		'		<div class="cell flaticon-social-1">官人：</div>',
		'		<div class="cell">{0}</div>',
		'	</div>',
		'	<div class="row">',
		'		<div class="cell flaticon-starred">封号：</div>',
		'		<div class="cell">{1}</div>',
		'	</div>',
		'	<div class="row">',
		'		<div class="cell flaticon-circle">银两：</div>',
		'		<div class="cell">{2}元</div>',
		'	</div>',
		'</div>',
	].join('');
	
	var _menuAgentInfoHtml = [
		'<div class="info">',
		'	<div class="row">',
		'		<div class="cell flaticon-social-1">官人：</div>',
		'		<div class="cell">{0}</div>',
		'	</div>',
		'	<div class="row">',
		'		<div class="cell flaticon-starred">封号：</div>',
		'		<div class="cell">{1}</div>',
		'	</div>',
		'	<div class="row">',
		'		<div class="cell flaticon-circle">老虎机佣金余额：</div>',
		'		<div class="cell">{2}元</div>',
		'	</div>',
		'	<div class="row">',
		'		<div class="cell flaticon-circle">其他佣金余额：</div>',
		'		<div class="cell">{3}元</div>',
		'	</div>',
		'</div>',
		'<div class="space-1"></div>',
		'<div class="report">',
		'	<div  class="report-box mui-col-xs32-4 mui-col-xs64-2">',
		'		<div class="report-title">本月总输赢<span style="color:#cf0f32;font-size:50%;">(元)</span></div>',
		'		<div class="report-text">{4}</div>',
		'	</div>',
		'	<div  class="report-box mui-col-xs32-4 mui-col-xs64-2">',
		'		<div class="report-title">本月总返水<span style="color:#cf0f32;font-size:50%;">(元)</span></div>',,
		'		<div class="report-text">{5}</div>',
		'	</div>',
		'	<div  class="report-box mui-col-xs32-4 mui-col-xs64-2">',
		'		<div class="report-title">本月总优惠<span style="color:#cf0f32;font-size:50%;">(元)</span></div>',,
		'		<div class="report-text">{6}</div>',
		'	</div>',
		'	<div  class="report-box mui-col-xs32-4 mui-col-xs64-2">',
		'		<div class="report-title">会员总人数</div>',,
		'		<div class="report-text">{7}</div>',
		'	</div>',
		'	<div  class="report-box mui-col-xs32-4 mui-col-xs64-2">',
		'		<div class="report-title">本月注册量</div>',,
		'		<div class="report-text">{8}</div>',
		'	</div>',
		'	<div  class="report-box mui-col-xs32-4 mui-col-xs64-2">',
		'		<div class="report-title">本月投注额</div>',,
		'		<div class="report-text">{9}</div>',
		'	</div>',
		'	<div class="space-2"></div>',
		'</div >',
   	].join('');
   	
	var _menuDefultInfoHtml = [
	    '<div class="logo">',
		'	算',
		'</div>'
   	].join('');
	
	var _nodeHtml = [
		'	<div class="node {2}">',
		'		<div class="icon {0}">{1}</div>',
		'	</div>'
	].join('');

	
	//按钮显示内容
	var _menuItems = [
	    {id:'index',text:'首页',icon:'flaticon-web-1'},
		{id:'company',text:'算-公司行號',icon:'flaticon-factory',
			nodes :[
				{id:'companyNameFortune',text:'公司行號運勢',icon:'flaticon-fortune-teller'},
				{id:'searchCompanyName',text:'智慧算名',icon:'flaticon-search'},
				{id:'companyWordNumFortune',text:'筆畫運勢',icon:'flaticon-symbol-1'}
		    ]
		},
		{id:'name',text:'算-姓名',icon:'flaticon-social-1',
			nodes :[
				{id:'nameFortune',text:'姓名運勢',icon:'flaticon-fortune-teller'},
				{id:'searchName',text:'智慧算名',icon:'flaticon-search'},
				{id:'nameWordNumFortune',text:'筆畫運勢',icon:'flaticon-symbol-1'}
		    ]
		}
	];
	
	//按钮显示权限
	var _customMenuItemAuth = ['index','company','companyNameFortune','searchCompanyName','companyWordNumFortune','name','nameFortune','searchName','nameWordNumFortune'];
	var _agentMenuItemAuth = ['index','agentWithdrawal','agent','agentHistory','email','news','preferential','cooperation','bbs','logout','preferential&news','accountM'];
	var _defultMenuItemAuth = ['index','company','companyNameFortune','searchCompanyName','companyWordNumFortune','name','nameFortune','searchName','nameWordNumFortune'];

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
		_$nodebox = that.$el.find('.node-box');

		//回上一页时，隐藏
		$(window).bind('popstate',function(){
			that.hide();
		});
		
		//绑定资料异动
		webManage.getStoreService().bind(StoreDataName.USER,function(store){
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
			webManage.getLoader().open('刷新中',999);
			webManage.getUserService().refresh(function(){
				webManage.getLoader().close();
			});
		});
	}
	

	/**
	 * 刷新使用者资讯
	 */
	function _renderInfo(userInfo){
		_$info.empty();
		if(_ROLE=='MONEY_CUSTOMER'){
			_$info.append(String.format(_menuCustomInfoHtml,userInfo.loginname,userInfo.level_name,userInfo.credit,userInfo.level));
		}else if(_ROLE=='AGENT'){
			_$info.append(String.format(_menuAgentInfoHtml,userInfo.loginname,userInfo.level_name,userInfo.slotAccount,userInfo.credit
					,userInfo.report.profitall||0,userInfo.report.ximafee||0,userInfo.report.couponfee||0,userInfo.report.reg||0,userInfo.report.monthly_reg||0,userInfo.report.betall||0));
		}else{
			_$info.append(_menuDefultInfoHtml);
			_$info.find('.login').click(function(){
				webManage.getDialog().open('login');
				_hide();
			});
			_$info.find('.register').click(function(){
				webManage.loadView('register');
				_hide();
			});
			_$info.find('.logo').click(function(){
				webManage.loadView('index');
				_hide();
			});
		}
	}
	
	/**
	 * 刷新选项
	 */
	function _renderItems(nodes){
		_$nodebox.empty();
		_$nodebox.append(_createNodes(_menuItems,_getItemAuth()));
		arr = obj = $item = null;
	}
	
	/**
	 * 产生Node
	 */
	function _createNodes(dataArray,authArray){
		var $nodesArray = [];
		var $node;
		for(var i in dataArray){
			data = dataArray[i];
			if(!data||authArray.indexOf(data.id)==-1){
				continue;
			}
			
			$node = $(String.format(_nodeHtml,data.icon,data.text,'active'));
			if(data.nodes){
				$node = $(String.format(_nodeHtml,data.icon,data.text,''));
				$node.append('<div class="sub-node"><div class="sub-node-content"></div></div>');
				$node.find('.sub-node-content').append(_createNodes(data.nodes,authArray));
				$node.bind('click',{id:data.id},_nodeShow);
			}else{
				$node = $(String.format(_nodeHtml,data.icon,data.text,'active'));
				$node.bind('click',{id:data.id},_menuItemHandler);
			}
			$nodesArray.push($node);
		}
		return $nodesArray;
	}
	
	
	/**
	 * 点击后展开
	 */
	function _nodeShow(e){
		var $node = $(this);
		if($node.hasClass('active')){
			$node.find('.sub-node').css({opacity:0,height:0});
			$node.removeClass('active');
		}else{
			$node.addClass('active');
			$node.find('.sub-node').css({opacity:1,height:$node.find('.sub-node').find('.sub-node-content').height()});
		}
	}
	
	/**
	 * 点击后处理
	 */
	function _menuItemHandler(e){
		event.stopPropagation();
		setTimeout(_hide,100);
		switch(e.data.id){
			case 'login':
				webManage.getDialog().open('login');
				break;
			case 'bbs':
				webManage.redirect(e.data.id);
				break;
			case 'logout':
				webManage.getDialog().open('logout');
				break;
			default:
				webManage.loadView(e.data.id);
		}
	}
	
	
	
	
	/**
	 * 取得item显示权限
	 */
	function _getItemAuth(){
		if(_ROLE=='MONEY_CUSTOMER')
			return _customMenuItemAuth;
		if(_ROLE=='AGENT')
			return _agentMenuItemAuth;
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