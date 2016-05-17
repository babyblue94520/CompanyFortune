/**
 * 
 */
function Dialog(config){
	var that = this;
	var _config = {
		id:false,
		initFn:false,
		defaultSetFn:false,
		html:false
	};
	$.extend(_config,config);

	var _event = {};
	var _dialogHtml = [
		'<div class="common-dialog">',
		'	<div>',
		'  		<div class="common-dialog-position">{0}</div>',
		'	</div>',
		'	<div class="common-dialog-screen"></div>',
		'</div>'
	].join('');
  	
	that.$el = false;
	that.bind = _bind;
	that.unbind = _unbind;
	that.show = function(param){
		if(that.$el){
			that.param = param;
			_config.defaultSetFn&&_config.defaultSetFn(that);
			_showHandler();
		}
	};
	
	that.hide = function(){
		_hideHandler();
	};

	that.resize = function(){
		_resizeHandler();
	};

	
	function _init(){
		_initElement();
		_config.initFn&&_config.initFn(that);
	}
	
	/**
	 * 产生Dialog物件
	 */
	function _initElement(){
		that.$el = $(String.format(_dialogHtml,_config.html));
		that.$el.find('.common-dialog-screen').bind('click',function(){
			that.hide();
		});
		that.$el.find('.common-dialog-close-btn').bind('click',function(){
			that.hide();
		});
		$('body').append(that.$el);
	}
	
	/**
	 * 显示
	 */
	function _showHandler(){
		that.$el.find('input').removeClass('mui--is-dirty');
		that.$el.find('input').removeClass('mui--is-not-empty');
		that.$el.find('input').addClass('mui--is-empty');
		
		$('body').addClass('show-dialog');
		that.$el.css('left','0px');
		that.$el.find('.common-dialog-screen').css({opacity:1,left:'0px'});
		that.$el.find('.common-dialog-position').css({opacity:1,top:'0px'});

		_resizeHandler();
		_trigger('show');
	}
	
	/**
	 * 隐藏
	 */
	function _hideHandler(){
		$('body').removeClass('show-dialog');
		that.$el.css('left','-10000px');
		that.$el.find('.common-dialog-screen').css({opacity:0,left:'-10000px'});
		that.$el.find('.common-dialog-position').css({opacity:0,top:'-40px'});
		that.$el.find('input').focusout();
		that.$el.find('textarea').focusout();
		_trigger('hide');
	}
	
	/**
	 * 视窗大小改变时，处理
	 */
	function _resizeHandler(){
		
		var $model = that.$el.find('.common-dialog-model');
		
		//确认model height 没有超过荧幕高度，超过则不使用置中
		if($('body').height()-100<$model.height()){
			that.$el.addClass('top');
		}else{
			that.$el.removeClass('top');
			that.$el.css('padding-top',($('body').height()-$model.height())/2);
		}
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
			_event[event] = 

				Array();
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
	
	_init();
}

/**
 * 
 * 负责产生&管理 Dialog
 */
function DialogManage(){
	
	var that = this;
	var _dialogs = {};
	//当前的model
	var _$currentDialog = false;
	var _$currentId = false;
	var _zIndex = 999;


	var _dialogConfigs = {
		'login':{id:'login',initFn:false,defaultSetFn:false,html:false},
		'logout':{id:'logout',initFn:false,defaultSetFn:false,html:false},
		'makeCall':{id:'makeCall',initFn:false,defaultSetFn:false,html:false},
		'modifyPassword':{id:'modifyPassword',initFn:false,defaultSetFn:false,html:false},
		'question':{id:'question',initFn:false,defaultSetFn:false,html:false},
		'news':{id:'news',initFn:false,defaultSetFn:false,html:false},
		'download':{id:'download',initFn:false,defaultSetFn:false,html:false},
		'bankBind':{id:'bankBind',initFn:false,defaultSetFn:false,html:false},
		'goGame':{id:'goGame',initFn:false,defaultSetFn:false,html:false},
		'sign':{id:'sign',initFn:false,defaultSetFn:false,html:false},
		'zfbBind':{id:'zfbBind',initFn:false,defaultSetFn:false,html:false},
		'confirm':{id:'confirm',initFn:false,defaultSetFn:false,html:false},
		'selectSlot':{id:'selectSlot',initFn:false,defaultSetFn:false,html:false}
		
	};
	
	var _inputFocus = false;
	mobileManage.getStoreManage().bind(StoreDataName.InputFocus,function(store){
		_inputFocus = store.data;
	});
	
	//视窗改变时，去变更top位置
	$(window).resize(function(){
		if(_$currentDialog&&!_inputFocus){
			_$currentDialog.resize();
		}
	});
	
	/**
	 * 开启弹窗
	 * @param {string} actionName
	 * @param {Object} param
	 */
	that.open = function(id,param){
		if(!_dialogConfigs[id]){
			alert(id+' dialog 不存在！')
			return ;
		}

		//隐藏上一个dialog
		that.close();

		_$currentDialog = _dialogs[id];
		_$currentId = id;
		if(_$currentDialog){
			_$currentDialog.show(param);
			return;
		}
		//建立Dialog
		_dialogs[id] = _$currentDialog = new Dialog(_dialogConfigs[id]);
		//隐藏触发时，更新状态
		_dialogs[id].bind('hide',function(){
			_$currentDialog = false;
			_$currentId = false;
		});
		
		_$currentDialog.show(param);
	};
	
	/**
	 * 关闭
	 */
	that.close = function(){
		if(_$currentDialog){
			_$currentDialog.hide();
			_$currentDialog = false;
			_$currentId = false;
		}
	};
	
	
	//登录 html 
	_dialogConfigs['login'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
	  		'<div class="common-dialog-title"><div class="common-dialog-title-text flaticon-arrows">会员登陆</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
     			'<div class="dialog-error-message"></div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
     		    	'<input id="dialog-login-account" type="text" required>',
     		    	'<label>账号</label>',
     		    	'<div class="message"></div>',
     		 	'</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
     		  	  	'<input id="dialog-login-password" type="password" required>',
     		    	'<label>密码</label>',
     		  	'</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
     		  	  	'<input id="dialog-login-code" type="text" required>',
     		    	'<label>验证码</label>',
     		    	'<img id="dialog-login-img" title="如果看不清验证码，请点图片刷新" />',
     		    	'<div class="message">如果看不清验证码，请点图片刷新</div>',
     		  	'</div>',
    			'<div class="mui-buttons">',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-login-submit-btn">登录</div>',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--pink small" id="dialog-login-forgotPassword-btn">忘记密码</div>',
     		  	'</div>',
     		'</div>',
     	'</div>'
    ].join('');
	

	/**
	 * 登录 Model 初始化
	 * @param {JQuery Object} dialog.$el
	 */
	_dialogConfigs['login'].initFn = function(dialog){
		dialog.$account = dialog.$el.find('#dialog-login-account');
		dialog.$password = dialog.$el.find('#dialog-login-password');
		dialog.$code = dialog.$el.find('#dialog-login-code');
		dialog.$image = dialog.$el.find('#dialog-login-img');
		dialog.$errorMessage = dialog.$el.find('.dialog-error-message');
		dialog.$forgotPasswordBtn = dialog.$el.find('#dialog-login-forgotPassword-btn');
		dialog.$submitBtn = dialog.$el.find('#dialog-login-submit-btn');

		dialog.$image.attr('src',mobileManage.getSecurityCodeUrl()+'?'+Math.random());
		dialog.$image.click(function(){
			dialog.$image.attr('src',mobileManage.getSecurityCodeUrl()+'?'+Math.random());
		});
		
		dialog.$forgotPasswordBtn.click(function(){
			dialog.hide();
			mobileManage.loadView('forgotPassword');
		});
		
		dialog.$submitBtn.click(function(){
			var formData = {
				account:dialog.$account.val(),
				password:dialog.$password.val(),
				imageCode:dialog.$code.val()
			};
			mobileManage.getLoader().open('验证中',_zIndex);
			mobileManage.getUserManage().login(formData, function(result){
				if(result.success){
					alert(result.message);
					dialog.hide();
					mobileManage.loadView((dialog.param&&dialog.param.redirect)||'index');
				}else{
					dialog.$code.val('');
					dialog.$image.attr('src',mobileManage.getSecurityCodeUrl()+'?'+Math.random());
					dialog.$errorMessage.html(result.message);
					dialog.resize();
				}
				mobileManage.getLoader().close();
				formData = null;
			});
		});
		
		dialog.$el.bind("keyup",function(e){  
            if(e.which=='13'&&dialog.$el.find('input').is(":focus")){
            	dialog.$submitBtn.click();
            }
        });
	};

	/**
	 * 设定初始值
	 * @param {JQuery Object} dialog.$el
	 * @param {=Object} param 
	 */
	_dialogConfigs['login'].defaultSetFn = function (dialog){
		 dialog.$account.val('');
		 dialog.$password.val('');
		 dialog.$code.val('');
		 dialog.$errorMessage.html('');
		 dialog.$image.attr('src',mobileManage.getSecurityCodeUrl()+'?'+Math.random());
	};
	
	
	//登出 html 
	_dialogConfigs['logout'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
  			'<div class="common-dialog-title"><div class="common-dialog-title-text flaticon-symbol">会员登出</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
    		'<div class="mui-panel">',
    			'<div class="common-dialog-message">确定要登出？</div>',
    			'<div class="mui-buttons">',
    		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-logout-submit-btn">确定</div>',
    		  	'	<div class="mui-btn mui-btn--raised mui-btn--pink" id="dialog-logout-cancel-btn">取消</div>',
    		  	'</div>',
    		'</div>',
    	'</div>'
   ].join('');
	
	/**
	 * 登出 Model 初始化
	 * @param {JQuery Object} dialog.$el
	 */
	_dialogConfigs['logout'].initFn = function(dialog){
		dialog.$el.find('#dialog-logout-cancel-btn').click(function(){
			dialog.hide();
		});
		dialog.$el.find('#dialog-logout-submit-btn').click(function(){
			mobileManage.getLoader().open('登出中',_zIndex);
			mobileManage.getUserManage().logout( function(result){
				mobileManage.getLoader().close();
				if(result.success){
					dialog.hide();
					mobileManage.loadView('index');
				}else{
					alert(result.message);
				}
			});
		});
	};
	
	
	//电话回播 html 
	_dialogConfigs['makeCall'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
	  		'<div class="common-dialog-title"><div class="common-dialog-title-text flaticon-telephone">电话回播</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
     			'<div class="common-dialog-message"></div>',
     		  	'<div class="mui-textfield">',
     		    	'<input id="dialog-makeCall-phone" type="text" placeholder="这里输入联系号码">',
     		    	'<label>您的联系号码</label>',
     		    	'<div class="message">回拨为注册电话，点击号码回拨即可，如果回拨不是注册电话，请输入最新电话 ，点击回拨</div>',
     		 	'</div>',
     			'<div class="common-dialog-message"></div>',
    			'<div class="mui-buttons">',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-makeCall-submit-btn">电话回播</div>',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--pink" id="dialog-makeCall-cancel-btn">取消</div>',
     		  	'</div>',
     		'</div>',
     	'</div>'
    ].join('');
	

	/**
	 * 电话回播 Model 初始化
	 */
	_dialogConfigs['makeCall'].initFn = function(dialog){
		dialog.$phone = dialog.$el.find('#dialog-makeCall-phone');
		
		dialog.$el.find('#dialog-makeCall-cancel-btn').click(function(){
			dialog.hide();
		});
		dialog.$submitBtn = dialog.$el.find('#dialog-makeCall-submit-btn');
		dialog.$submitBtn.click(function(){
			var formData = {
				phone:dialog.$phone.val()
			};
			mobileManage.getLoader().open('处理中',_zIndex);
			mobileManage.getUserManage().makeCall(formData, function(result){
				if(result.success){
					alert(result.message);
				}else{
					alert(result.message);
				}
				mobileManage.getLoader().close();
				formData = null;
			});
		});
		
		dialog.$el.bind("keyup",function(e){  
            if(e.which=='13'&&dialog.$el.find('input').is(":focus")){
            	dialog.$submitBtn.click();
            }
        }); 
	};
	
	/**
	 * 初始化设定
	 * @param {JQuery Object} dialog.$el
	 * @param {=Object} param 
	 */
	_dialogConfigs['makeCall'].defaultSetFn = function(dialog){
		dialog.$phone.val('');
	};
	

	//修改密码 html 
	_dialogConfigs['modifyPassword'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
	  		'<div class="common-dialog-title"><div class="common-dialog-title-text">修改密码</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
     			'<div class="dialog-error-message"></div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
     		    	'<input id="dialog-modifyPassword-password" type="password" required>',
     		    	'<label>旧密码</label>',
     		    	'<div class="message"></div>',
     		 	'</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
     		  	  	'<input id="dialog-modifyPassword-newPassword" type="password" required>',
     		    	'<label>新密码</label>',
     		    	'<div class="message">密码为6-16位数字或英文字母，英文字母开头且不能和账号相同</div>',
     		  	'</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
	 		  	  	'<input id="dialog-modifyPassword-confirmPassword" type="password" required>',
	 		    	'<label>确认密码</label>',
     		    	'<div class="message">再次输入密码，确认新密码无误</div>',
	 		  	'</div>',
    			'<div class="mui-buttons">',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-modifyPassword-submit-btn">修改</div>',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--pink" id="dialog-modifyPassword-cancel-btn">取消</div>',
     		  	'</div>',
     		'</div>',
     	'</div>'
    ].join('');

	/**
	 * 修改密码 Model 初始化
	 */
	_dialogConfigs['modifyPassword'].initFn = function (dialog){
		dialog.$password = dialog.$el.find('#dialog-modifyPassword-password');
		dialog.$newPassword = dialog.$el.find('#dialog-modifyPassword-newPassword');
		dialog.$confirmPassword = dialog.$el.find('#dialog-modifyPassword-confirmPassword');
		dialog.$errorMessage = dialog.$el.find('.dialog-error-message');
		
		dialog.$el.find('#dialog-modifyPassword-cancel-btn').click(function(){
			dialog.hide();
		});
		dialog.$submitBtn = dialog.$el.find('#dialog-modifyPassword-submit-btn');
		dialog.$submitBtn.click(function(){
			var formData = {
				password:dialog.$password.val(),
				newPassword:dialog.$newPassword.val(),
				confirmPassword:dialog.$confirmPassword.val()
			};
			mobileManage.getLoader().open("修改中",_zIndex);
			mobileManage.getUserManage().changePassword(formData, function(result){
				mobileManage.getLoader().close();
				if(result.success){
					alert(result.message);
					dialog.hide();
				}else{
					dialog.$errorMessage.html(result.message);
					dialog.resize();
					alert(result.message);
				}
			});
		});
		
		dialog.$el.bind("keyup",function(e){  
            if(e.which=='13'&&dialog.$el.find('input').is(":focus")){
            	dialog.$submitBtn.click();
            }
        });
	};
	
	/**
	 * 修改密码视窗
	 */
	_dialogConfigs['modifyPassword'].defaultSetFn = function(dialog){
		dialog.$password.val('');
		dialog.$newPassword.val('');
		dialog.$confirmPassword.val('');
		dialog.$errorMessage.html('');
	};
	

	//密保问题 html 
	_dialogConfigs['question'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
	  		'<div class="common-dialog-title"><div class="common-dialog-title-text flaticon-lock">设定密保</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
     			'<div class="dialog-error-message"></div>',
     		  	'<div class="mui-select">',
     		    	'<select id="dialog-question-question"></select>',
     		    	'<label>密保问题</label>',
     		 	'</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
     		  	  	'<input id="dialog-question-answer" type="text" required>',
     		    	'<label>你的回答</label>',
     		  	'</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
	 		  	  	'<input id="dialog-question-password" type="password" required>',
	 		    	'<label>登录密码</label>',
	 		  	'</div>',
    			'<div class="mui-buttons">',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-question-submit-btn">设定</div>',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--pink" id="dialog-question-cancel-btn">取消</div>',
     		  	'</div>',
     		'</div>',
     	'</div>'
    ].join('');
	

	/**
	 * 密保问题 Model 初始化
	 */
	_dialogConfigs['question'].initFn = function(dialog){
		var questionData = [
			{value:'1',name:'您最喜欢的明星名字？'},
            {value:'2',name:'您最喜欢的职业？'},
            {value:'3',name:'您最喜欢的城市名称？'},
            {value:'4',name:'对您影响最大的人名字是？'},
            {value:'5',name:'您就读的小学名称？'},
            {value:'6',name:'您最熟悉的童年好友名字是？'}
        ];
		var optionHtml = '<option value="{0}">{1}</option>';
		var options = new Array();
		
		dialog.$question = dialog.$el.find('#dialog-question-question');
		dialog.$answer = dialog.$el.find('#dialog-question-answer');
		dialog.$password = dialog.$el.find('#dialog-question-password');
		dialog.$errorMessage = dialog.$el.find('.dialog-error-message');
		
		for(var i =0;i<questionData.length;i++){
			options.push(String.format(optionHtml,questionData[i]['value'],questionData[i]['name']));
		}
		dialog.$question.append(options);
		
		dialog.$el.find('#dialog-question-cancel-btn').click(function(){
			dialog.hide();
		});
		dialog.$submitBtn = dialog.$el.find('#dialog-question-submit-btn');
		dialog.$el.find('#dialog-question-submit-btn').click(function(){
			var formData = {
				password:dialog.$password.val(),
				answer:dialog.$answer.val(),
				questionId:dialog.$question.val()
			};
			mobileManage.getLoader().open("设置中",_zIndex);
			mobileManage.getUserManage().saveQuestion(formData, function(result){
				mobileManage.getLoader().close();
				if(result.success){
					alert(result.message);
					dialog.hide();
				}else{
					alert(result.message);
					dialog.$errorMessage.html(result.message);
					dialog.resize();
				}
			});
		});

		dialog.$el.bind("keyup",function(e){  
            if(e.which=='13'&&dialog.$el.find('input').is(":focus")){
            	dialog.$submitBtn.click();
            }
        });
		optionHtml = options = questionData = null;
	};
	
	
	/**
	 * 设定密保问题
	 */
	_dialogConfigs['question'].defaultSetFn = function(dialog){
		dialog.$question.val('1');
		dialog.$answer.val('');
		dialog.$password.val('');
		dialog.$errorMessage.html('');
	};
	
	//新闻动态 html
	_dialogConfigs['news'].html = [
   		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
     		'<div class="common-dialog-title"><div id="dialog-news-title" class="common-dialog-title-text flaticon-black"></div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
       		'<div class="mui-panel">',
       			'<div id="dialog-news-message" class="common-dialog-message"></div>',
    			'<div class="mui-buttons">',
       		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-news-last-btn">上一条</div>',
       		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-news-next-btn">下一条</div>',
       		  	'</div>',
       		'</div>',
       	'</div>'
   	].join('');
	
	/**
	 * 公告信息 Model 初始化
	 */
	_dialogConfigs['news'].initFn = function(dialog){
		dialog.$title = dialog.$el.find('#dialog-news-title');
		dialog.$message = dialog.$el.find('#dialog-news-message');

		dialog.$el.find('#dialog-news-last-btn').click(function(){
			if(dialog.param.active>=0){
				dialog.param.active--;
			}
	    	if(!dialog.param.data[dialog.param.active]){
	    		dialog.$title.html('公告');
	    		dialog.$message.html('无上一条公告');
	    	}else{
	    		var content = dialog.param.data[dialog.param.active].content;
	    		content = content?content.replace(/\n/g,"<br/>"):'';
	    		dialog.$title.html(dialog.param.data[dialog.param.active].title);
	    		dialog.$message.html(content);
	    	}
			dialog.resize();
		});
		
		dialog.$el.find('#dialog-news-next-btn').click(function(){
			if(dialog.param.active<dialog.param.data.length){
				dialog.param.active++;
			}
	    	if(!dialog.param.data[dialog.param.active]){
	    		dialog.$title.html('公告');
	    		dialog.$message.html('无下一条公告');
	    	}else{
	    		var content = dialog.param.data[dialog.param.active].content;
	    		content = content?content.replace(/\n/g,"<br/>"):'';
	    		dialog.$title.html(dialog.param.data[dialog.param.active].title);
	    		dialog.$message.html(content);
	    	}
			dialog.resize();
		});
	}
	
	/**
	 * 开启公告视窗
	 * @param {object} data 传入公告资料
	 * @param {integer} active 显示该则公告
	 * 
	 */
	_dialogConfigs['news'].defaultSetFn = function(dialog){
		dialog.$title.html(dialog.param.data[dialog.param.active].title);
		dialog.$message.html(dialog.param.data[dialog.param.active].content);
	};
	
	
	//檔案下载 html
	_dialogConfigs['download'].html = [
     	'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
   			'<div class="common-dialog-title"><div id="dialog-download-title" class="common-dialog-title-text"></div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
     			'<div id="dialog-download-message" class="common-dialog-message"></div>',
    			'<div class="mui-buttons">',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-download-submit-btn">继续下载</div>',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--pink" id="dialog-download-cancel-btn">取消</div>',
     		  	'</div>',
     		'</div>',
     	'</div>'
 	].join('');
	
	/**
	 * 檔案下载 Model 初始化
	 */
	_dialogConfigs['download'].initFn = function(dialog){
		dialog.$title = dialog.$el.find('#dialog-download-title');
		dialog.$message = dialog.$el.find('#dialog-download-message');

		dialog.$el.find('#dialog-download-cancel-btn').click(function(){
			dialog.hide();
		});
		dialog.$el.find('#dialog-download-submit-btn').click(function(){
			if(!dialog.param.data||!dialog.param.data.url){
				alert('下载路径不存在！')
				return;
			}
			window.location.href = dialog.param.data.url;
			dialog.hide();
		});
	};
	
	/**
	 * 
	 * 檔案下载
	 */
	_dialogConfigs['download'].defaultSetFn = function(dialog){
		dialog.$title.html(dialog.param.data.title);
		dialog.$message.html(dialog.param.data.content);
	};
	
	//银行卡 html 
	_dialogConfigs['bankBind'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
	  		'<div class="common-dialog-title"><div class="common-dialog-title-text flaticon-lock">银行卡绑定</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
 				'<div class="mui-message"><font color="red" style="font-size:80%;">注：只可以绑定三个银行卡/折号，且每个银行只可绑定一个卡号。如须解绑，请与在线客服联系。</font></div>',
     			'<div class="dialog-error-message">注：只可以绑定三个银行卡/折号，且每个银行只可绑定一个卡号。如须解绑，请与在线客服联系。</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
	 		  	  	'<input id="dialog-bankBind-password" type="password" required>',
	 		    	'<label>游戏账户密码</label>',
	 		  	'</div>',
     		  	'<div class="mui-select">',
     		    	'<select id="dialog-bankBind-bankName"></select>',
     		    	'<label>银行</label>',
     		 	'</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
     		  	  	'<input id="dialog-bankBind-cardNo" type="text" required>',
     		    	'<label>银行卡号</label>',
     		  	'</div>',
    			'<div class="mui-buttons">',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary block" id="dialog-bankBind-submit-btn">绑定</div>',
     		  	'</div>',
     		'</div>',
     	'</div>'
    ].join('');

	/**
	 * 绑定支付宝 Model 初始化
	 */
	_dialogConfigs['bankBind'].initFn = function(dialog){
		var bankBindData = [
		    {value:'',name:'请选择'},
   		    {value:'支付宝',name:'支付宝'},
			{value:'工商银行',name:'工商银行'},
			{value:'招商银行',name:'招商银行'},
			{value:'商业银行',name:'商业银行'},
			{value:'农业银行',name:'农业银行'},
			{value:'建设银行',name:'建设银行'},
			{value:'交通银行',name:'交通银行'},
			{value:'民生银行',name:'民生银行'},
			{value:'光大银行',name:'光大银行'},
			{value:'兴业银行',name:'兴业银行'},
			{value:'上海浦东银行',name:'上海浦东银行'},
			{value:'广东发展银行',name:'广东发展银行'},
			{value:'深圳发展银行',name:'深圳发展银行'},
			{value:'中国银行',name:'中国银行'},
			{value:'中信银行',name:'中信银行'},
			{value:'邮政银行',name:'邮政银行'}
        ];
		var optionHtml = '<option value="{0}">{1}</option>';
		var options = new Array();
		
		dialog.$bankName = dialog.$el.find('#dialog-bankBind-bankName');
		dialog.$cardNo = dialog.$el.find('#dialog-bankBind-cardNo');
		dialog.$password = dialog.$el.find('#dialog-bankBind-password');
		dialog.$errorMessage = dialog.$el.find('.dialog-error-message');
		
		for(var i =0;i<bankBindData.length;i++){
			options.push(String.format(optionHtml,bankBindData[i]['value'],bankBindData[i]['name']));
		}
		dialog.$bankName.append(options);
		
		dialog.$el.find('#dialog-bankBind-cancel-btn').click(function(){
			dialog.hide();
		});
		
		dialog.$submitBtn = dialog.$el.find('#dialog-bankBind-submit-btn');
		
		dialog.$submitBtn.click(function(){
			var formData = {
				cardNo:dialog.$cardNo.val(),
				bankName:dialog.$bankName.val(),
				password:dialog.$password.val(),
				addr:'none'
			};
			mobileManage.getLoader().open("绑定中",_zIndex);
			mobileManage.getBankManage().bindBankNo(formData, function(result){
				mobileManage.getLoader().close();
				if(result.success){
					alert(result.message);
					dialog.hide();
				}else{
					alert(result.message);
					dialog.$errorMessage.html(result.message);
					dialog.resize();
				}
			});
		});
		
		dialog.$el.bind("keyup",function(e){  
            if(e.which=='13'&&dialog.$el.find('input').is(":focus")){
            	dialog.$submitBtn.click();
            }
        });
		optionHtml = options = bankBindData = null;
	};
	
	/**
	 * 绑定银行卡/支付宝
	 */
	_dialogConfigs['bankBind'].defaultSetFn = function(dialog){
		dialog.$password.val('');
		dialog.$bankName.val('');
		dialog.$cardNo.val('');
		dialog.$errorMessage.html('');
	};
	

	//进入游戏 html
	_dialogConfigs['goGame'].html = [
     	'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
   			'<div class="common-dialog-title"><div id="dialog-goGame-title" class="common-dialog-title-text"></div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
 				'<div class="dialog-error-message"></div>',
     			'<div id="dialog-goGame-message" class="common-dialog-message"></div>',
    			'<div class="mui-buttons">',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-goGame-submit-btn">进入游戏</div>',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--pink" id="dialog-goGame-cancel-btn">取消</div>',
     		  	'</div>',
     		'</div>',
     	'</div>'
 	].join('');
	
	/**
	 * 进入游戏 Model 初始化
	 */
	_dialogConfigs['goGame'].initFn = function(dialog){
		dialog.$title = dialog.$el.find('#dialog-goGame-title');
		dialog.$message = dialog.$el.find('#dialog-goGame-message');
		dialog.$error = dialog.$el.find('.dialog-error-message');

		dialog.$el.find('#dialog-goGame-cancel-btn').click(function(){
			dialog.hide();
		});
		
		dialog.$el.find('#dialog-goGame-submit-btn').click(function(e){

			if(dialog.param.data.onSubmit){
				dialog.param.data.onSubmit.apply(dialog.$el,[e,dialog.$el]);
			}else{
				if(!dialog.param.data||!dialog.param.data.url){
					dialog.$error.html('游戏路径不存在！');
					alert('游戏路径不存在！')
					return;
				}
				window.location.href = dialog.param.data.url;
				dialog.hide();
			}
		});
	};
	
	
	/**
	 * 进入游戏
	 */
	_dialogConfigs['goGame'].defaultSetFn = function(dialog){
		dialog.param.data = data;
		dialog.$title.html(dialog.param.data.title);
		dialog.$message.html(dialog.param.data.content);
		dialog.$error.html(dialog.param.data.error);
	};

	//签到 html 
	_dialogConfigs['sign'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1">',
  			'<div class="common-dialog-title"><div class="common-dialog-title-text flaticon-money">签到有奖，惊喜不断</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
    		'<div class="mui-panel">',
    			'<div class="common-dialog-message">',
	    			'本月总存款：<font id="dialog-sign-money" color="red"></font>元<br>',
	    			'签到余额：<font id="dialog-sign-signMoney" color="red"></font>元<br><br>',
		            '签到条件：',
		            '<p style="font-size:80%">当月存款满<font color="red">100</font>以上，即可进行活动。</p><br>',
		            '签到方式：',
		            '<p style="font-size:80%">1.由下方"签到"按钮直接签到。</p><br>',
		            '<p style="font-size:80%">2.至帐户中心点击"签到"。</p><br>',
		            '详细活动内容，请至 <div style="color:#2C6AE0;text-decoration: underline;display: inline-block;" onclick="mobileManage.loadView(\'preferential\')">优惠活动</div>查询。',
    			'</div>',
    			'<div class="mui-buttons">',
    		  		'<div class="mui-btn mui-btn--raised mui-btn--pink" id="dialog-sign-submit-btn">签到</div>',
    			'</div>',
    		'</div>',
    	'</div>'
   ].join('');

	/**
	 * 签到 Model 初始化
	 */
	_dialogConfigs['sign'].initFn = function(dialog){
		dialog.$money = dialog.$el.find('#dialog-sign-money');
		dialog.$signMoney = dialog.$el.find('#dialog-sign-signMoney');
		
		dialog.$el.find('#dialog-sign-cancel-btn').click(function(){
			dialog.hide();
		});
		dialog.$el.find('#dialog-sign-submit-btn').click(function(){
			mobileManage.getLoader().open('处理中',_zIndex);
			mobileManage.getSignManage().doSign( function(result){
				if(result.success){
					alert(result.message);
					dialog.hide();
				}else{
					alert(result.message);
				}
				mobileManage.getLoader().close();
			});
		});
	};
	
	/**
	 * 取得 签到 物件
	 * @param {Object} param 参数
	 */
	_dialogConfigs['sign'].defaultSetFn = function(dialog){
		dialog.$money.html(param.money);
		dialog.$signMoney.html(param.signMoney);
	};
	
	
	//支付宝扫描账号绑定
	_dialogConfigs['zfbBind'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1 mui-col-xs48-8 mui-col-xs48-offset-2 mui-col-xs64-6 mui-col-xs64-offset-3 mui-col-sm-6 mui-col-sm-offset-3 mui-col-md-4 mui-col-md-offset-4">',
	  		'<div class="common-dialog-title"><div class="common-dialog-title-text flaticon-lock">支付宝扫描账号绑定</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
			'<div class="dialog-error-message"></div>',
 				'<div class="mui-message"><font color="red" style="font-size:80%;">注：支付宝“二维码”扫描存款，必须用您绑定的支付宝账号进行存款，否则无法实时到账;每位会员只能绑定一个支付宝帐号</font></div>',
     			'<div class="mui-textfield mui-textfield--float-label">',
     			'<input id="dialog-zfbBind-alipayAccount" type="text" required>',
     			'<label>支付宝存款账号</label>',
     			'</div>',
     		  	'<div class="mui-textfield mui-textfield--float-label">',
	 		  	  	'<input id="dialog-zfbBind-password" type="password" required>',
	 		    	'<label>游戏账户密码</label>',
	 		  	'</div>',
     		  	'<div class="mui-btn mui-btn--raised mui-btn--primary block" id="dialog-zfbBind-submit-btn">绑定</div>',
     		'</div>',
     	'</div>'
    ].join('');


	/**
	 * 支付宝扫马 Model 初始化
	 */
	_dialogConfigs['zfbBind'].initFn = function(dialog){
		dialog.$errorMessage = dialog.$el.find('.dialog-error-message');
		dialog.$alipayAccount = dialog.$el.find("#dialog-zfbBind-alipayAccount");
		dialog.$password = dialog.$el.find("#dialog-zfbBind-password");
		dialog.$submitBtn = dialog.$el.find("#dialog-zfbBind-submit-btn");
		
		dialog.$el.find('#dialog-zfbBind-cancel-btn').click(function(){
			dialog.hide();
		});

		dialog.$submitBtn.click(function(){
			mobileManage.getLoader().open("绑定中",_zIndex);
			mobileManage.getBankManage().bindZFBQR({
				account:dialog.$alipayAccount.val(),
				password:dialog.$password.val()
			},function(result){
				mobileManage.getLoader().close();
				dialog.$errorMessage.html(result.message);
				dialog.resize();
				alert(result.message);
				if(typeof dialog.param.callback === 'function'){
					dialog.param.callback(result);
				}
			});
		});
		
		dialog.$el.bind("keyup",function(e){  
            if(e.which=='13'&&dialog.$el.find('input').is(":focus")){
            	dialog.$submitBtn.click();
            }
        }); 
	};
	
	/**
	 * 支付宝扫马绑定
	 */
	_dialogConfigs['zfbBind'].defaultSetFn = function(dialog){
		var _config = {
			callback:false
		};
		$.extend(_config,dialog.param);
		dialog.param = _config;
		dialog.$alipayAccount.val('');
		dialog.$password.val('');
	};

	
	//确认html 
	_dialogConfigs['confirm'].html = [
		'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1 mui-col-xs48-8 mui-col-xs48-offset-2 mui-col-xs64-6 mui-col-xs64-offset-3 mui-col-sm-6 mui-col-sm-offset-3 mui-col-md-4 mui-col-md-offset-4">',
  			'<div class="common-dialog-title"><div id="dialog-confirm-title" class="common-dialog-title-text"></div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
    		'<div class="mui-panel">',
    			'<div id="dialog-confirm-message" class="common-dialog-message" ></div>',
    			'<div class="mui-buttons">',
		  			'<div class="mui-btn mui-btn--raised mui-btn--primary" id="dialog-confirm-submit-btn">确定</div>',
    		  		'<div class="mui-btn mui-btn--raised mui-btn--pink" id="dialog-confirm-cancel-btn">取消</div>',
    		  	'</div>',
    		'</div>',
    	'</div>'
    ].join('');
	
	/**
	 * 确认 Model 初始化
	 */
	_dialogConfigs['confirm'].initFn = function(dialog){
		dialog.$title = dialog.$el.find('#dialog-confirm-title');
		dialog.$message = dialog.$el.find('#dialog-confirm-message');
		
		dialog.$el.find('#dialog-confirm-cancel-btn').click(function(){
			dialog.hide();
			if(typeof dialog.param.callback === 'function'){
				dialog.param.callback(false);
			}
		});
		
		dialog.$el.find('#dialog-confirm-submit-btn').click(function(){
			dialog.hide();
			if(typeof dialog.param.callback === 'function'){
				dialog.param.callback(true);
			}
		});
	};

	/**
	 * 取得 确认 物件
	 * @param {Object} param 参数
	 */
	_dialogConfigs['confirm'].defaultSetFn = function(dialog){
		var _config = {
			title:'输入标题',
			message:'内容',
			callback:false
		};
		$.extend(_config,dialog.param);
		dialog.param = _config;
		dialog.$title.html(_config.title);
		dialog.$message.html(_config.message);
	};

	_dialogConfigs['selectSlot'].html = [
			'<div class="common-dialog-model mui-col-xs32-10 mui-col-xs32-offset-1 mui-col-xs64-8 mui-col-xs64-offset-2 mui-col-sm-6 mui-col-sm-offset-3 mui-col-md-4 mui-col-md-offset-4">',
	  		'<div class="common-dialog-title"><div class="common-dialog-title-text">选择老虎机平台</div><div class="common-dialog-close-btn flaticon-shapes"></div></div>',
     		'<div class="mui-panel">',
     			'<div class="mui-error-message"></div>',
     		  	'<div class="mui-select">',
     		    	'<select id="dialog-selectSlot-platform"></select>',
     		    	'<label>老虎机平台</label>',
     		 	'</div>',
 				'<div class="mui-message">注：确定后，我们不接受任何重新转至其他老虎机平台的申请</div>',
    			'<div class="mui-buttons">',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--danger right" id="dialog-selectSlot-cancel-btn">关闭</div>',
     		  	'	<div class="mui-btn mui-btn--raised mui-btn--primary right" id="dialog-selectSlot-submit-btn">领取</div>',
     		  	'</div>',
     		'</div>',
     	'</div>'
    ].join('');
	
	_dialogConfigs['selectSlot'].initFn = function(dialog){
		dialog.$platform = dialog.$el.find('#dialog-selectSlot-platform');
		
		dialog.$el.find('#dialog-selectSlot-cancel-btn').click(function(){
			dialog.hide();
			if(dialog.param&&dialog.param.cancelHandler instanceof Function){
				dialog.param.cancelHandler(dialog);
			}
		});
		dialog.$el.find('#dialog-selectSlot-submit-btn').click(function(){
			if(dialog.param&&dialog.param.submitHandler instanceof Function){
				dialog.param.submitHandler(dialog);
			}
		});
		
		optionHtml = options = null;
	}
	
	/**
	 * 取得 确认 物件
	 * @param {Object} param 参数
	 */
	_dialogConfigs['selectSlot'].defaultSetFn = function(dialog){
		dialog.$platform.empty();
		var optionHtml = '<option value="{0}">{1}</option>';
		var options = new Array();
		if(dialog.param&&dialog.param.platformData){
			for(var i =0;i<dialog.param.platformData.length;i++){
				options.push(String.format(optionHtml,dialog.param.platformData[i]['value'],dialog.param.platformData[i]['name']));
			}
			dialog.$platform.append(options);
		}
	};
	
}