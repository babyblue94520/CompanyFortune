/**
 * 
 */
//限制輸入數字
function NumberInput(el){
	var $e ;
	if(el instanceof Element){
		$e = $(el);
	}else if(typeof el === "string"){
		$e = $('#'+el);
		if(!$e.get(0))return;
	}else{
		return;
	}
	
	
	$e.keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

/**
 * 延迟不重复执行相同action
 * @param {string} name 动作名称
 * @param {int} delay 延迟时间
 * @param {function} fn 执行的方法
 * 
 */
var delayAction = (function(){
	var _timers = {};
	return function(name,delay,fn){
		//实际执行
		function excute(){
			fn();
			delete _timers[name];
		}
		return (function(){
			if(_timers[name]){
				clearTimeout(_timers[name]);
				_timers[name] = setTimeout(excute,delay);
				return;
			}
			_timers[name] = setTimeout(excute,delay);
		})();
	};
})();

//判断Mobile装置
function isMobile(){
	return (/AppleWebKit.*Mobile/i.test(navigator.userAgent) 
		|| /Android/i.test(navigator.userAgent) 
		|| /BlackBerry/i.test(navigator.userAgent) 
		|| /IEMobile/i.test(navigator.userAgent) 
		|| (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent)));
}

function getMobileKind(){
	if(navigator.userAgent.match(/Android/i))
		return 'Android';
	if(navigator.userAgent.match(/iPhone/i)
	 || navigator.userAgent.match(/iPad/i)
	 || navigator.userAgent.match(/iPod/i))
		return 'IOS';
	if(navigator.userAgent.match(/Windows Phone/i))
		return 'Windows Phone';
	return 'other';
}