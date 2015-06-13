var xmlhttp = new XMLHttpRequest();
var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?text=pizza&apikey=66c1a05f-e956-426f-a0e0-2c2f3756423f&max_page_results=1&summary=quick";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    	var response = JSON.parse(xmlhttp.responseText);
        console.log(response.documents[0].summary);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();