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
		var result = [];
		for(var k in words){
			result.push(WordsObject[words[k]]);
		}
		
		return result;
	}
}