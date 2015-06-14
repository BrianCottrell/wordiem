var msg = new SpeechSynthesisUtterance('Hello World');
window.speechSynthesis.speak(msg);

var knownWords = ['the','be','to','of','and','a','in','that','have','I','it','for','not','on','with','he'];
var text;
function writeText(){
	while (document.getElementsByClassName('text-container')[0].firstChild) {
    	document.getElementsByClassName('text-container')[0].removeChild(document.getElementsByClassName('text-container')[0].firstChild);
	}
	text = document.getElementsByClassName('image-text')[0].innerHTML.split(' ');
	var words = [];
	for(var i = 0; i < text.length; i++){
		var word = document.createElement('p');
		word.innerHTML = text[i]+' ';
		word.style.backgroundColor = 'green';
		for(var j = 0; j < knownWords.length; j++){
			if(text[i] == knownWords[j] || text[i].length < 5){
				word.style.backgroundColor = 'transparent';
			}
		}
		word.addEventListener('click', function(){
			if(this.style.backgroundColor != 'transparent'){
				document.getElementsByClassName('definition-container')[0].style.display = 'block';
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
			this.style.backgroundColor = 'transparent';
			knownWords.push(this.innerHTML.slice(0,this.innerHTML.length-1));
			document.getElementsByClassName('definition-container')[0].style.display = 'none';
			writeText();
		});		
		document.getElementsByClassName('text-container')[0].appendChild(word);
	}
}
document.getElementsByClassName('url-input')[0].value = 'http://www.rjionline.org/sites/default/files/images/the_text_column_should_satisfy_four_conditions.jpeg'
document.getElementsByClassName('url-button')[0].addEventListener('click', function(){
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.idolondemand.com/1/api/sync/ocrdocument/v1?apikey=66c1a05f-e956-426f-a0e0-2c2f3756423f&url="+document.getElementsByClassName('url-input')[0].value;
//  http://www.rjionline.org/sites/default/files/images/the_text_column_should_satisfy_four_conditions.jpeg
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    	var response = JSON.parse(xmlhttp.responseText);
	        document.getElementsByClassName('image-text')[0].innerHTML = response.text_block[0].text;
	    }
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
});
document.getElementsByClassName('enter-text')[0].addEventListener('click', function(){
	writeText();
});
