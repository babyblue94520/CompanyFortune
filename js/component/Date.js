/**
 * 
 */
Date.replaceChars = {
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Day
    d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function() { return this.getDate(); },
    l: function() { return Date.replaceChars.longDays[this.getDay()]; },
    N: function() { return this.getDay() + 1; },
    S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
    w: function() { return this.getDay(); },
    z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
    // Week
    W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
    // Month
    F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function() { return this.getMonth() + 1; },
    t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
    // Year
    L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
    o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
    Y: function() { return this.getFullYear(); },
    y: function() { return ('' + this.getFullYear()).substr(2); },
    // Time
    a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
    A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
    B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
    g: function() { return this.getHours() % 12 || 12; },
    G: function() { return this.getHours(); },
    h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
    H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
    i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
    s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
    u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?'0' : '')) + m; },
    // Timezone
    e: function() { return "Not Yet Supported"; },
    I: function() {
        var DST = null;
            for (var i = 0; i < 12; ++i) {
                    var d = new Date(this.getFullYear(), i, 1);
                    var offset = d.getTimezoneOffset();

                    if (DST === null) DST = offset;
                    else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
            }
            return (this.getTimezoneOffset() == DST) | 0;
        },
    O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
    P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
    T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
    Z: function() { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
    r: function() { return this.toString(); },
    U: function() { return this.getTime() / 1000; }
};

Date.prototype.format = function(format) {
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {       var curChar = format.charAt(i);         if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\"){
            returnStr += curChar;
        }
    }
    return returnStr;
};


if(!String.format){
	String.format = function() {
	    var theString = arguments[0];
	    
	    for (var i = 1; i < arguments.length; i++) {
	        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
	        theString = theString.replace(regEx, arguments[i]);
	    }
	    return theString;
	};
}

/**
 * mui 扩增 简单date套件
 * 
 * @param MUI
 */
(function(MUI){
	function Datepicker(mui){
		var that = this;
		var $datepicker = false;
    	var dateLocale = {
    		zh_TW:{
    			month:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    			week:['日','一','二','三','四','五','六']
    		}
    	};
    	var locale = 'zh_TW';
    	var _type = {
    		'Y-m-d':0,
    		'Y-m':1
    	};
    	
    	var dateText = dateLocale[locale];
    	var dateTemplate = [
    		'<div class="mui-datepicker">',
			'<div class="mui-datepicker-screen"></div>',
           	'<div class="mui-datepicker-window">',
           	'	<div class="d-header">',
           	'		<div class="d-header-text-1"></div>',
           	'		<div class="d-header-text-2"></div>',
           	'	</div>',
           	'	<div class="d-content">',
           	'		<div class="d-content-day-wrap">',
           	'			<div class="d-content-yesrmonth">',
           	'				<div class="d-content-yesrmonth-text" ></div>',
           	'				<div class="d-content-yesrmonth-prev flaticon-arrows-2"></div>',
           	'				<div class="d-content-yesrmonth-next flaticon-arrows-2"></div>',
           	'			</div>',
           	'			<div class="d-content-week"></div>',
           	'			<div class="d-content-day"></div>',
           	'			<div class="d-buttons-wrap">',
            '    		  	<div class="mui-btn mui-btn--raised mui-btn--primary submit">确认</div>',
            '    		  	<div class="mui-btn mui-btn--raised mui-btn--dark cancel">取消</div>',
           	'			</div>',
           	'		</div>',
           	'		<div class="d-content-year-wrap">',
           	'			<div class="d-content-year"></div>',
           	'			<div class="d-buttons-wrap">',
            '    		  	<div class="mui-btn mui-btn--raised mui-btn--dark back">返回</div>',
           	'			</div>',
           	'		</div>',
           	'		<div class="d-content-month-wrap">',
           	'			<div class="d-content-month"></div>',
           	'			<div class="d-buttons-wrap">',
            '    		  	<div class="mui-btn mui-btn--raised mui-btn--primary submit">确认</div>',
            '    		  	<div class="mui-btn mui-btn--raised mui-btn--dark cancel">取消</div>',
           	'			</div>',
           	'		</div>',
           	'	</div>',
           	'</div>',
           	'</div>',
           	'</div>'
    	].join('');
    	var blockTemplat = [
    		'<div class="d-content-date-block"><span>{0}</span></div>'
    	].join('');
    	
    	/**
    	 * 初始化日期物件
    	 */
    	function init(){
    		if($datepicker)return;
    		
			$datepicker = $(dateTemplate);
			//生成年选单
			var years = [];
	   		for(var i = 1911;i<2099;i++){
	   			var y = $('<div>'+i+'</div>');
	   			y.bind('click',{year:i},changeYear);
	   			years.push(y);
	   		}
	    	$datepicker.find('.d-content-year').append(years);
	    	//生成月选单
			var months = [];
	   		for(var i = 0;i<12;i++){
	   			var m = $('<div>'+dateText['month'][i]+'</div>');
	   			m.bind('click',{month:i},changeMonth2);
	   			months.push(m);
	   		}
	    	$datepicker.find('.d-content-month').append(months);
	    	
	    	//生成日期选单
	   		var week = dateText['week'];
	   		var weeks = [];
	   		for(var i = 0,len = week.length;i<len;i++){
	   			weeks.push(String.format(blockTemplat,week[i]));
	   		}
	    	$datepicker.find('.d-content-week').append(weeks);
	    	that.$yearWrap = $datepicker.find('.d-content-year-wrap');
	    	that.$monthWrap = $datepicker.find('.d-content-month-wrap');
	    	that.$dayWrap = $datepicker.find('.d-content-day-wrap');
	    	that.$daysContent = $datepicker.find('.d-content-day');
	    	that.$headerText1 = $datepicker.find('.d-header-text-1');
	    	that.$headerText2 = $datepicker.find('.d-header-text-2');
	    	that.$yesrmonthText = $datepicker.find('.d-content-yesrmonth-text');

	    	//确定
	    	$datepicker.find('.submit').click(function(){
	    		that.submit();
	    	});

	    	//取消
	    	$datepicker.find('.cancel').click(function(){
	    		that.close();
	    	});
	    	//返回
	    	$datepicker.find('.back').click(function(){
	    		if(_type[that.format]==0){
		    		activeWrap('day');
	    		}else if(_type[that.format]==1){
		    		activeWrap('month');
	    		}
	    	});
	    	//年
	    	$datepicker.find('.d-header-text-2').click(function(){
	    		if(!that.$yearWrap.hasClass('active')){
	    			activeYear();
	    		}
	    	});
	    	//左右变更月份
	    	$datepicker.find('.d-content-yesrmonth-prev').click(function(){
	    		changeMonth(-1);
	    	});

	    	$datepicker.find('.d-content-yesrmonth-next').click(function(){
	    		changeMonth(1);
	    	});
	    	
	    	$datepicker.find('.mui-datepicker-screen').click(function(){
	    		that.close();
	    	});
	    	$('body').append($datepicker);
	    	week = weeks = null;
    	}

    	/**
    	 * 变更年
    	 * @param {object} e
    	 */
    	function changeYear(e){
    		that.activeDate.setFullYear(e.data.year);
    		if(_type[that.format]==0){
	    		restView();
	    		activeDay();
    		}else if(_type[that.format]==1){
	    		activeMonth();
    		}
    	}
    	
    	/**
    	 * 变更月
    	 * 
    	 * @param {int} i 
    	 */
    	function changeMonth(i){
    		that.activeDate.setMonth(that.activeDate.getMonth()+i);
    		restView();
    		activeDay();
    	}
    	
    	/**
    	 * 变更月2
    	 * @param {object} e
    	 */
    	function changeMonth2(e){
    		that.activeDate.setMonth(e.data.month);
    		activeMonth();
    	}
    	
    	/**
    	 * 变更日
    	 * @param {object} e
    	 */
    	function changeDay(e){
    		that.activeDate.setDate(e.data.day);
    		restView();
    		activeDay();
    	}
    	
    	/**
    	 * 切换分页
    	 * @param {string} id 'year' or 'month' or 'day'
    	 */
    	function activeWrap(key){
    		$datepicker.find('.d-content-year-wrap').removeClass('active');
    		$datepicker.find('.d-content-month-wrap').removeClass('active');
    		$datepicker.find('.d-content-day-wrap').removeClass('active');
    		if('year'==key){
        		that.$yearWrap.addClass('active');
    		}else if('month'==key){
        		that.$monthWrap.addClass('active');
    		}else if('day'==key){
        		that.$dayWrap.addClass('active');
    		}
    	}
    	
    	/**
    	 * 设定日期
    	 * @param {string} dateStr 
    	 */
    	function setValue(dateStr){
    		if(!dateStr){
    			that.activeDate = new Date();
    		}else{
    			if(_type[that.format]==0&&!/^\d{4}-([0][1-9]|[1][0-2])-([0][1-9]|[1-2][0-9]|[3][0-1])$/.test(dateStr)){
	    			alert('日期格式错误');
	    			return;
	    		}
    			if(_type[that.format]==1&&!/^\d{4}-([0][1-9]|[1][0-2])$/.test(dateStr)){
	    			alert('日期格式错误');
	    			return;
	    		}
    			that.activeDate = new Date(dateStr);
    		}
    		restView();
    	}
    	
    	/**
    	 * 取得{Y-m-d}字串日期
    	 */
    	function getValue(){
    		return that.activeDate.format(that.format);
    	}
    	
    	
    	/**
    	 * 刷新日期
    	 */
    	function restView(){
    		//总日数
    		var dayTotal = new Date(that.activeDate.getFullYear(),that.activeDate.getMonth()+1,0).getDate();
    		//开始星期
    		var startWeek = new Date(that.activeDate.getFullYear(),that.activeDate.getMonth(),1).getDay();
    		var $day;
    		var $days = [];
    		var i=0;
    		//前面空白
    		for(i=0;i<startWeek;i++){
    			$days.push($(String.format(blockTemplat,'')));
    		}
    		//日
    		for(i=1;i<=dayTotal;i++){
    			$day = $(String.format(blockTemplat,i));
    			$day.bind('click',{day:i},changeDay);
    			$days.push($day);
    		}
    		
    		that.$daysContent.empty();
    		that.$daysContent.append($days);
    		that.$yesrmonthText.html(String.format('{0} {1}',dateText['month'][that.activeDate.getMonth()],that.activeDate.getFullYear()));
    		that.$days = $datepicker.find('.d-content-date-block');
    		
    		dayTotal = startWeek = $day = $days = i = null;
    	}
    	

    	/**
    	 * 标记年
    	 */
    	function activeYear(){
    		activeWrap('year');
    		that.$yearWrap.find('.d-content-year').scrollTop(0);
    		var divs = that.$yearWrap.find('.d-content-year div');
    		divs.removeClass('active');
    		for(var i = 0,l = divs.length;i<l;i++){
    			if(divs.eq(i).html()==that.activeDate.getFullYear() ){
    				divs.eq(i).addClass('active');
    				that.$yearWrap.find('.d-content-year').scrollTop(divs.eq(i).position().top-(divs.eq(i).height()*3));
    				break;
    			}
    		}
    		divs = null;
    	}
    	
    	/**
    	 * 标记月
    	 */
    	function activeMonth(){
    		activeWrap('month');
    		that.$monthWrap.find('.d-content-month').scrollTop(0);
    		var divs = that.$monthWrap.find('.d-content-month div');
    		divs.removeClass('active');
    		for(var i = 0,l = divs.length;i<l;i++){
    			if(divs.eq(i).html()==dateText['month'][that.activeDate.getMonth()]){
    				divs.eq(i).addClass('active');
    				that.$monthWrap.find('.d-content-month').scrollTop(divs.eq(i).position().top-(divs.eq(i).height()*3));
    				break;
    			}
    		}
    		that.$headerText1.html(String.format('{0}月',that.activeDate.getMonth()+1));
    		that.$headerText2.html(that.activeDate.getFullYear());
    		divs = null;
    	}
    	
    	
    	/**
    	 * 标记日期
    	 */
    	function activeDay(){
    		activeWrap('day');
    		that.$days.removeClass('active');
    		var spans = that.$days.find('span');
    		for(var i = 0,l = spans.length;i<l;i++){
    			if(spans.eq(i).html()==that.activeDate.getDate() ){
    				spans.eq(i).parent().addClass('active');
    				break;
    			}
    		}

    		that.$headerText1.html(String.format('{0}月{1}日 星期{2}',that.activeDate.getMonth()+1,that.activeDate.getDate(),dateText['week'][that.activeDate.getDay()]));
    		that.$headerText2.html(that.activeDate.getFullYear());
    		spans = l = null;
    	}
    	
    	
    	
    	
    	/**
    	 * 
    	 */
    	function ressize(){
    		if($datepicker){
    			if($(window).height()<$datepicker.height()){
        			$datepicker.addClass('top');
        		}else{
        			$datepicker.removeClass('top');
        		}
    		}
    	}
    	
    	$(window).bind('resize',function(){
    		ressize();
    	});
    	
    	/**
    	 * 打开日期套件
    	 * @param {jquery element object} $element
    	 */
    	that.open = function($element){
    		that.$element = $element;
    		that.format = $element.attr('date-format');
    		that.format = that.format?that.format:'Y-m-d';
    		init();
    		setValue($element.val());

    		if(_type[that.format]==0){
        		activeDay();
    		}else if(_type[that.format]==1){
        		activeMonth();
    		}
    		ressize();
    		setTimeout(function(){
    			$datepicker.addClass('show');
    			
    		},100);
    	};

    	/**
    	 * 关闭日期套件
    	 */
    	that.close = function(){
    		$datepicker.removeClass('show');
    	};

    	/**
    	 * 将日期写回input
    	 */
    	that.submit = function(){
    		that.$element.val(getValue());
    		$datepicker.removeClass('show');
    	};
	}
	
	mui.datepicker = new Datepicker(mui);
})(mui);
