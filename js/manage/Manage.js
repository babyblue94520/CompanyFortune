/**
 * 管理Manage、轉址以及Storage存取
 * 
 */

function Manage(){
	var that = this;
//	var _version = '1';
	var _version = new Date().getTime();
	var _APPID = 'fortune';
	
	var _baseUrl = '';
	
	//管理同样的url 不重复执行
	var _ajaxObj = {};
	//管理同样的url 不重复执行
	var _$views = {};
	var _$currentView = false;//当前显示View
	var _currentViewID = false;//当前显示View id
	
	var _storeManage = false;//资料中心
	//MUI model
	var _dialogManage = false;
	//loading model
	var _loader = false;
	var _urlParamValue = {};
	
	var _viewAuth =['index','select','help'];
	
	
	//方法對應
	var _viewUrls = {
		'index':'index.html',
		'select':'select.html',
		'help':'help.html'
	};
	
	//所有動作對應的網址
	var _urls = {
		'initialize':'main/initialize'//初始化
	};
	
	//Storage Name
	var _storages = {
		'index':'mobi-index-storage',
		'select':'mobi-select-storage',
		'help':'mobi-help-storage'
	};
	
	
	that.getVersion = function(){
		return _version;
	};
	
	//取得ID
	that.getAPPID = function(){
		return _APPID;
	};
	//轉址
	that.redirect = function(key,param,target){
		_redirect(key,param,target);
	};
	
	//Get Object from SessionStorage
	that.getSessionStorage = function(key){
		return getSessionStorage(key);
	};
	//set Object in SessionStorage
	that.setSessionStorage = function(key,param){
		setSessionStorage(key,param);
	};

	//Get Object from Storage
	that.getLocalStorage = function(key){
		return getLocalStorage(key);
	};
	//set Object in Storage
	that.setLocalStorage = function(key,param){
		setLocalStorage(key,param);
	};
	
	/**
	 * 取得get param
	 */
	that.getUrlParamValue = _getUrlParamValue;
	
	/**
	 * 取得验证码url
	 */
	that.getSecurityCodeUrl = function(){
		return _urls['securityCode'];
	};

	/**
	 * 载入view
	 * @param {String} name view name;
	 */
	that.loadView = function(name){
		if(_viewAuth.indexOf(name)==-1){
			name = 'index';
		}
		if(_loadView.apply(null,[name])){
			//修改history，让上下页有作用
			window.history.pushState(null,name,'index.html?view='+name+'&v='+that.getVersion());
			_initUrlParamValue();
		}
	};
	
	
	/**
	 * 取得MUI 弹窗 model 
	 */
	that.getDialog = function(){
		if(!_dialogManage){
			_dialogManage = new DialogManage();
		}
		return _dialogManage;
	};
	
	/**
	 * get loader
	 */
	that.getLoader = function(){
		if(!_loader){
			if(!Loader||typeof Loader !== 'function'){
				alert('Loader 加载失败，请重新刷新页面。');
				return;
			}
			_loader = new Loader();
		}
		return _loader;
	};
	

	/**
	 * get StoreManage
	 */
	that.getStoreManage = function(){
		if(!_storeManage){
			if(!StoreManage||typeof StoreManage !== 'function'){
				alert('StoreManage 加载失败，请重新刷新页面。');
				return;
			}
			_storeManage = new StoreManage();
		}
		return _storeManage;
	};
	
	
	that.abortAjax = _abortAjax;

	
	/**
	 * 离开网页时，检查是否有正在运行的ajax
	 */
	$(window).bind('beforeunload',function(){
		if(_hasRunAjax()){
			return '目前尚有正在执行的动作，可能会造成资料异常，确定要离开？';
		}
	});

	/**
	 * 离开网页时，退出运行的ajax
	 */
	$(window).bind('unload',_abortAjax);
	

	/**
	 * 初始化
	 * 
	 */
	function _initialize(){
		window.onpopstate = function(event) {
			_initUrlParamValue();
			//一定要使用原生方法避免重复history.pushState，导致无法下一页
			_loadView(_getUrlParamValue('view')||'index');
		};
		
		
		//向Server取得资料
		//that.ajax({
		//		url:_urls['initialize'],
		//		type:'get',
		//		callback:function(){
				_initUrlParamValue();
				manage.loadView(_getUrlParamValue('view')||'index');
		//	}
		//});
	}
	
	
	/**
	 * 如果有ajax在运行的话，就退出运行的ajax
	 */
	function _abortAjax(){
		for(var key in _ajaxObj){
			if(_ajaxObj[key]&&_ajaxObj[key].abort){
				_ajaxObj[key].abort();
				_ajaxObj[key] = false;
			}
		}
	}

	/**
	 * 检查是否有正在运行的ajax
	 */
	function _hasRunAjax(){
		for(var key in _ajaxObj){
			if(_ajaxObj[key]&&_ajaxObj[key].abort){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 统一使用 ajax
	 * @param {Object} config 资料 
	 * {
	 *		url:来源网址,
	 *		param:请求参数,
	 *		timeout:timeout ms,
	 *		callback:回调方法
	 *	}
	 */
	var _dataType = ['json'];
	that.ajax = function(config){
		//预设参数
		var _config = {
			url:false,
			param:{},
			type:'post',
			dataType:'json',
			timeout:false,
			callback:false
		};
		
		$.extend(_config,config);

		//统一回传讯息
		var _result = {
			success:false,
			message:false
		};
		//检查网址是否存在
		if(!_config.url){
			_result.message='来源网址不存在！';
			_executeCallBack(_result);
			return;
		}
		
		//检查返回资料格式
		if(_dataType.indexOf(_config.dataType)==-1){
			_result.message='不支持'+_config.dataType+'资料格式！';
			_executeCallBack(_result);
			return;
		}
		
		//避免重複執行
		if(_ajaxObj[_config.url]){
			_result.message='目前正在执行，请稍候再尝试！';
			_executeCallBack(_result);
			return;
		}
		_ajaxObj[_config.url] = true;
		
		//回調
		function _executeCallBack(result){
			if(typeof _config.callback ==='function'){
				_config.callback(result);
			}
		}
		_ajaxObj[_config.url] = $.ajax({
			type:_config.type,
			url:_config.url,
			data:_config.param,
			dataType:_config.dataType,
			timeout:_config.timeout,
			success:function(data,success,response){
				_ajaxObj[_config.url] = false;
				$.extend(_result,data);
				_result.message = _getHttpStatusText(response);
				_result.success = true;
				_executeCallBack(_result);
				
				_result = null;
			}
		}).fail(function(response) {
			_ajaxObj[_config.url] = false;
			_result.message = _getHttpStatusText(response);
			_result.success = false;
			if(_result.message){
				_executeCallBack(_result);
			}else{
				
			}
			_result = null;
		});
		
		return _ajaxObj[_config.url];
	};
	
	
	/**
	 * 刷新资料
	 */
	function _refreshStoreData(refreshData){
		for(var key in refreshData){
			that.getStoreManage().set(key,refreshData[key]);
		}
	}
	
	/**
	 * 取得请求失败信息
	 * @param {String} statusCode HttpStatusCode
	 * @param {String} statusText status = 0 有不同的状况
	 * @return {String} text 对应的信息
	 */
	function _getHttpStatusText(response){
		var text = '';
		if(response.status!=0){
			switch (response.status){
				case 200:
					if(response.responseJSON&&response.responseJSON.refreshData){
						_refreshStoreData(response.responseJSON.refreshData);//刷新资料
					}
					break;
				case 400:
					text = '當前請求無法理解！';
					break;
				case 401:
					that.getStoreManage().set(StoreDataName.UserInfo,false);//清除使用者资料
					text = '用户验证失败！';
					break;
				case 403:
					text = '拒絕執行當前請求！';
					break;
				case 404:
					text = '网址不存在！';
					break;
				case 408 :
					text = '请求超时，请稍候再试！';
					break;
				case 500 :
					text = '发生无法预料错误！';
					break;
				case 502 :
					text = '请求无回应，请稍候再试！';
					break;
				case 504 :
					text = '请求超时，请稍候再试！';
					break;
			}
		}else{
			switch (response.statusText){
				case 'error':
					text = '网路异常，请稍候再试！';
					break;
				case 'timeout':
					text = '请求超时，请稍候再试！';
					break;
				case 'abort':
//					text = '请求已中断！';
					text = false;
					break;
			}
		}
		return (response.responseJSON&&response.responseJSON.message)||text;
	}
	
	/**
	 * 加载View
	 */
	function _loadView(name){
		console.log('_loadView ',name);
		if(typeof name !=='string'||!_viewUrls[name]){
			alert('view 不存在');
			return false;
		}
		if(name==_currentViewID){
			return false;
		}
		that.getLoader().open('加载中');
		try{
			$('body').removeClass(_currentViewID);
			if(_$views[name]){
				_currentViewID = name;
				_$currentView = _$views[name];
				$('body').addClass(_currentViewID);
				that.getStoreManage().set(StoreDataName.ActiveView,{id:_currentViewID});
				that.setSessionStorage('common',{activeView:_currentViewID});
				that.getLoader().close();
			}else{
				var $tempView = $(String.format('<div class="view {0}" data-view="{0}"></div>',name));
				$('body>.main-wrap>.views').append($tempView);

				$('body').addClass(name);
				$tempView.load(_baseUrl+'views/'+_viewUrls[name]+'?'+new Date().getTime()
				,function(response, status, xhr){
					that.getLoader().close();
					var text = _getHttpStatusText(xhr);
					if(text){
						alert(text);
						$tempView.remove();
						$('body').removeClass(name);
						if(_currentViewID){
							$('body').addClass(_currentViewID);
						}
					}else{
						_currentViewID = name;
						_$currentView = $tempView;
						 _$views[name] = _$currentView;
						that.getStoreManage().set(StoreDataName.ActiveView,{id:_currentViewID});
						that.setSessionStorage('common',{activeView:_currentViewID});
					}
					$tempView = null;
				});
			}
		}catch(e){
			alert(e);
		}
		return true;
	}
	
	/**
	 * 取得路径传入参数
	 */
	function _getUrlParamValue(name){
		return _urlParamValue[name];
	}
	
	/**
	 * 点触
	 * @param {function} callback 回调函数
	 */
	function _startTouClick(callback){
		window.TouClick.Start({
            position_code: 0,
            website_key: '0304e3d8-6d75-4bce-946a-06ada1cc5f4e',
            onSuccess: function (args, checkObj){
            	TouClick.Close();
				callback({success:true,data:checkObj});
            },
            onError: function (args){
            	TouClick.Close();
				callback({success:false,data:args,message:'点触验证加载失败，请刷新页面！'});
            }
        });
	}
	
	//轉址
	function _redirect(key,param,target){
		var url = _urls[key];
		if(!url){
			alert(key+' 不存在');
			return;
		}
		setSessionStorage(key,param);
		if(!/^(http|https):\/\//.test(url)){
			url = _baseUrl+url;
		}
		if(!target){
			that.getLoader().open('跳转中');
			window.location.href = url;
		}else if(target=='_blank '){
			window.open(url,target)
		}
		
		url = null;
	}
	
	/**
	 * get SessionStorage
	 */
	function getSessionStorage(key){
		if(!key)return undefined;

		var name = _storages[key];
		var storage = sessionStorage[name];
		if(storage){
			return JSON.parse(storage);
		}else{
			return {};
		}
		name = storage = null;
	}
	
	/**
	 * set SessionStorage
	 */
	function setSessionStorage(key,param){
		if(!key)return;
		if(!param)return;
		
		var name = _storages[key];
		var storage = sessionStorage[name];
		if(storage){
			var obj = JSON.parse(storage);
			$.extend(obj,param);
			sessionStorage[name] = JSON.stringify(obj);
		}else{
			sessionStorage[name] = JSON.stringify(param);
		}
		name = storage = null;
	}
	
	/**
	 * get LocalStorage
	 */
	function getLocalStorage(key){
		if(!key)return undefined;

		var name = _storages[key];
		var storage = localStorage[name];
		if(storage){
			return JSON.parse(storage);
		}else{
			return {};
		}
		name = storage = null;
	}
	
	/**
	 * set LocalStorage
	 */
	function setLocalStorage(key,param){
		if(!key)return;
		if(!param)return;

		var name = _storages[key];
		var storage = localStorage[name];
		if(storage){
			var obj = JSON.parse(storage);
			$.extend(obj,param);
			localStorage[name] = JSON.stringify(obj);
		}else{
			localStorage[name] = JSON.stringify(param);
		}
		name = storage = null;
	}
	
	/**
	 * 解析Url param内容
	 */
	function _initUrlParamValue() {
		_urlParamValue = {};
		var query = window.location.search.substring(1);
		var vars = query.split("&"),pair;
		for (var i=0;i<vars.length;i++) {
			pair = vars[i].split("=");
			_urlParamValue[pair[0]] = pair[1];
		}
		query = vars = pair = null;
	}
	_initialize();
}
