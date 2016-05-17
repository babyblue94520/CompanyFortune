/**
 * 
 */
function WordService(){
	var that = this;
	
	that.getWord = _getWord;
	that.getWords = _getWords;
	
	/**
	 * @param {String} word 文字
	 * @return {Object} wordObject
	 */
	function _getWord(word){
		if(!WordsObject){
			alert('WordsObject load fail');
			return null;
		}
		if(!/^[\u4e00-\u9fa5]+$/.test(word)){
			alert('只允許輸入漢字');
			return null;
		}
		return WordsObject[word];
	}
	
	/**
	 * 
	 * @param {Array} word 文字
	 * @return {Array} wordObject
	 */
	function _getWords(words){
		if(!WordsObject){
			alert('WordsObject load fail');
			return null;
		}
		if(!words||words.length==0){
			return null;
		}
		if(!/^[\u4e00-\u9fa5]+$/.test(words.join(''))){
			alert('只允許輸入漢字');
			return null;
		}
		var result = new Array();
		for(var k in words){
			result.push(WordsObject[words[k]]);
		}
		
		return result;
	}
}