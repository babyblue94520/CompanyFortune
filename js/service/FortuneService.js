
function FortuneService(){
	var that = this;
	
	that.getFortuneByNum = _getFortuneByNum;
	that.getBestWordNum = _getBestWordNum;
	that.getGoodNameByWord = _getGoodNameByWord;

	/**
	 * @param {Integer} num 文字
	 * @return {Object} fortune Object
	 */
	function _getFortuneByNum(num){
		if(!FortuneArray){
			alert('WordsObject load fail');
			return null;
		}
		return FortuneArray[num-1];
	}


	/**
	 * 計算字數五行關係
	 * 
	 * 邏輯：
	 * 1.前字生後字
	 * 2.後字筆劃大於等於前字
	 * 
	 * @param {Integer} total 總筆畫
	 * @param {Integer} count 字數
	 * @return {Array} 回傳 Array[{relation:..,wordsNumArray:...}]
	 */
	function _getBestWordNum(total,count){
		if(count<2){
			alert('至少兩個字！');
			return;
		}
		//每個字的筆劃
		var _wordArr = new Array(count);
		var _wordArrLen = _wordArr.length;
		
		//五行數理
		var _type = ['水','木','木','火','火','土','土','金','金','水'];
		//相生
		var _create = ['木','火','土','金','水'];
		//相剋
		var _delete = ['火','金','木','土','水'];
		//目前計算位置標記
		var _index = count-2;
		//陣列最後位置
		var _last = _wordArrLen-1;
		//陣列內容初始值
		var _defaultValue = 1;
		//紀錄文字五行關係
		var _show;
		//文字前後者
		var _befer,_after;

		/**
		 * 下一組 字數陣列
		 */
		function _nextWordArr(){
			var c = 0;
			for(var i = _index;i<_wordArrLen;i++){
				if(i>_index){
					_wordArr[i]-=c;
				}else{
					_wordArr[i]+=1;
					c+=1;
				}
			}
			//檢查是否繼續執行
			if(!_wordArr.reduce(function(c, o) {return c && c <= o ? o : false }, 1)){

				if(_index>0){
					_initWordArr();
					if(!_wordArr.reduce(function(c, o) {return c && c <= o ? o : false }, 1)){
						return false;
					}
					return true;
				}
				return false;
			}else{
				return true;
			}
		}
		
		/**
		 * 初始化 字數陣列
		 */
		function _initWordArr(){
			_wordArr.fill(_defaultValue).fill(1,1);
			var v ;
			var temp = _wordArr;
			for(var i in _wordArr){
				//處理最後一個值
				if(i>_index){
					v = total-_wordArr.slice(0,i).reduce(function(previousValue, currentValue, currentIndex, array) {
						  return previousValue + currentValue;
					});
					_wordArr[i] = v;
				}else if(i!=0){
					v = _wordArr[i-1]+1;
					_wordArr[i] = v;
				}
			}
			_defaultValue++;
			if(_wordArr[_index]==_wordArr[_index+1]){
				_index--;
			}
		}

		/**
		 * 執行
		 */
		function _run(){
			var result = new Array();
			_initWordArr();
			result.push(_wordArr.slice(0));
			while(_nextWordArr()){
				result.push(_wordArr.slice(0));
			}
			return result;
		}
		return _run();
	}


	/**
	 * 取得好名字組合
	 */
	function _getGoodNameByWord(numArray,type,word,WordsByNumObject){

		//相生
		var _create = ['木', '火', '土', '金', '水'];
		var wordCount = numArray.length;

		function _getNiceWord(nameArray, index, type) {

			var temps = new Array();
			var nextType = _create[(_create.indexOf(type) + 1) % 5];
			var strs = WordsByNumObject[numArray[index]][nextType] || [];
			var end = false;

			for (var i in strs) {
				for(var j in nameArray){
					temps.push({name: nameArray[j].name + strs[i].word, rel:nameArray[j].type+' 生 '+nextType});
				}
			}
			if (++index  < wordCount) {
				temps = _getNiceWord(temps,index,type);
			}

			return temps;
		}
		return _getNiceWord([{name:word,rel:type}],1,type);
	}
}


function parseData(){
	var dataArr = document.querySelector('div').innerHTML.replace(/\s+/g,'：').replace(/\\r\\n/g,'：').replace(/：+/g,'：').split('：');


	  console.log(dataArr)
	var reg1 = /^(\d+)畫/;
	var reg2 = /^五行屬「(.)」的字有/;
	var dictionary = new Object();
	var m1,m2,obj = new Object();
	var index1,index2;

	for(var i in dataArr){
	  if(!dataArr[i])continue;
	  m1 = dataArr[i].match(reg1);
	  if(m1){
	    if(index1){
	      dictionary[index1] = obj;
	    }
	    index1 = m1[1];
	    obj = new Object();
	    continue;
	  }
	  
	  m2 = dataArr[i].match(reg2);
	  if(m2){
	    index2 = m2[1];
	    obj[index2] = new Array();
	    continue;
	  }
	  obj[index2] = obj[index2].concat(dataArr[i].split(''));
	}
	console.log('var dictionary = '+JSON.stringify(dictionary)+';')
	
}