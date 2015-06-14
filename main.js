var knownWordList = ['the','be','to','of','and','a','in','that','have','I','it','for','not','on','with','he'];
var text;
function getText(){  
  $.get(
		"https://api.idolondemand.com/1/api/sync/ocrdocument/v1", 
		{ 	
			url:"http://cs-server.usc.edu:28154/uploads/capture.jpg", 
			apikey:"438b3ec2-75ab-4201-b2f2-db10d0c40aa1" 
		}, 
		function(data, status, xhr)
		{
			//alert(data.text_block[0].text);
			document.getElementsByClassName('image-text')[0].innerHTML=data.text_block[0].text;
		},
		"json"
	);
}
function writeText(){
	while (document.getElementsByClassName('text-container')[0].firstChild) {
    	document.getElementsByClassName('text-container')[0].removeChild(document.getElementsByClassName('text-container')[0].firstChild);
	}
	text = document.getElementsByClassName('image-text')[0].innerHTML.split(' ');
	var words = [];
	for(var i = 0; i < text.length; i++){
		var word = document.createElement('p');
		word.innerHTML = text[i]+' ';
		word.classList.add('highlighted');
		for(var j = 0; j < knownWordList.length; j++){
			if(text[i] == knownWordList[j] || text[i].length < 6 || !allLetter(text[i].slice(0, text[i].length-1))){
				word.classList.remove('highlighted');
			}
		}
		word.addEventListener('click', function(){
			if(this.classList.contains('highlighted')){
				var x = event.clientX;
				var y = event.clientY+window.pageYOffset+10;
				document.getElementsByClassName('definition-container')[0].style.display = 'block';
				document.getElementsByClassName('definition-container')[0].style.left = x+'px';
				document.getElementsByClassName('definition-container')[0].style.top = y+'px';
				var xmlhttp = new XMLHttpRequest();
				var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?apikey=66c1a05f-e956-426f-a0e0-2c2f3756423f&max_page_results=1&summary=quick&text="+this.innerHTML.slice(0,this.innerHTML.length-1);
				xmlhttp.onreadystatechange = function() {
				    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				    	var response = JSON.parse(xmlhttp.responseText);
				        document.getElementsByClassName('definition-container')[0].innerHTML = response.documents[0].summary;
				    }
				}
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
			}
		});
		word.addEventListener('mouseenter', function(){
			document.getElementsByClassName('definition-container')[0].style.display = 'none';
		});
		word.addEventListener('mouseleave', function(){
			document.getElementsByClassName('definition-container')[0].style.display = 'none';
		});		
		word.addEventListener('dblclick', function(){
			this.classList.remove('highlighted');
			knownWordList.push(this.innerHTML.slice(0,this.innerHTML.length-1));
			document.getElementsByClassName('definition-container')[0].style.display = 'none';
			updateVocabulary();
			writeText();
		});		
		document.getElementsByClassName('text-container')[0].appendChild(word);
	}
}
function updateVocabulary(){
	var list = '';
	for(var i = 0; i < knownWordList.length; i++){
		list+=knownWordList[i];
		if(i < knownWordList.length-1){
			list+=', ';
		}
	}
	document.getElementsByClassName('vocabulary-list')[0].innerHTML = list;
}
function allLetter(inputtxt){  
	var letters = /^[A-Za-z]+$/;  
	if(inputtxt.match(letters)){  
		return true;
	}  
	else
	{  
		return false;  
	}  
} 
document.getElementsByClassName('url-input')[0].value = 'http://www.rjionline.org/sites/default/files/images/the_text_column_should_satisfy_four_conditions.jpeg'
document.getElementsByClassName('url-button')[0].addEventListener('click', function(){
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.idolondemand.com/1/api/sync/ocrdocument/v1?apikey=66c1a05f-e956-426f-a0e0-2c2f3756423f&url="+document.getElementsByClassName('url-input')[0].value;
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    	var response = JSON.parse(xmlhttp.responseText);
	        document.getElementsByClassName('image-text')[0].innerHTML = response.text_block[0].text;
	    }
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
});
document.getElementsByClassName('photo-button')[0].addEventListener('click', getText);
document.getElementsByClassName('enter-text')[0].addEventListener('click', function(){
	writeText();
});
document.getElementsByClassName('speech-button')[0].addEventListener('click', function(){
	var knownWords = [];
	var unknownWords = [];
	var wordGroup = '';
	var wordKnown = false;
	var index = 0;
	var msg;
	var voices;
	for(var i = 0; i < text.length; i++){
		var wordKnown = false;
		for(var j = 0; j < knownWords.length; j++){
			if(text[i] == knownWords[j] || text[i].length < 6 || !allLetter(text[i].slice(0, text[i].length-1))){
				wordKnown = true;
			}
		}
		if(wordKnown){
			wordGroup+=text[i]+' ';
		}else{
			wordGroup+=text[i];
			knownWords.push(wordGroup);
			wordGroup = '';
			unknownWords.push(text[i]);
		}
		if(i == text.length-1){
			knownWords.push(wordGroup);
		}
	}
	function addDefinition(){
		var xmlhttp = new XMLHttpRequest();
		var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?apikey=66c1a05f-e956-426f-a0e0-2c2f3756423f&max_page_results=1&summary=quick&text="+unknownWords[index];
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    	var response = JSON.parse(xmlhttp.responseText);
		        if(response.documents[0]){
		        	unknownWords[index] = response.documents[0].summary.slice(0, response.documents[0].summary.indexOf('.'));
		        }
		        index++;
				if(index < unknownWords.length){
					addDefinition();
				}else{
					for(var i = 0; i < knownWords.length; i++){
						msg = new SpeechSynthesisUtterance();
						msg.pitch = 0;
						msg.text = knownWords[i];
						window.speechSynthesis.speak(msg);
						msg = new SpeechSynthesisUtterance();
						msg.pitch = 1.5;
						msg.text = unknownWords[i];
						if(i > 0 && msg != undefined){
							window.speechSynthesis.speak(msg);
						}
						console.log(knownWords);
						console.log(unknownWords);
					}
				}
		    }
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}
	addDefinition();
});
document.getElementsByClassName('vocabulary-button')[0].addEventListener('click', function(){
	if(document.getElementsByClassName('vocabulary-list')[0].style.display == 'block'){
		document.getElementsByClassName('vocabulary-list')[0].style.display = 'none';
	}else{
		document.getElementsByClassName('vocabulary-list')[0].style.display = 'block';
	}
});
document.getElementsByClassName('info')[0].addEventListener('click', function(){
	alert('	- The blue words are the words that you do not know\n	- Click on the word for the definition\n	- Double click the word if you know the word.\n	- Click on the “Text Audio” for Assisted Audio reading\n	- Click on “My Vocabulary” for a list of the words that you know.');
});
updateVocabulary();
