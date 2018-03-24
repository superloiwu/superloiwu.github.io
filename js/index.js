//----Global Vars---------------------
var answers = [
	{"code" : "100", "status" : "Continue"},
	{"code" : "200", "status" : "OK"},
	{"code" : "201", "status" : "Created"},
	{"code" : "204", "status" : "No Content"},
	{"code" : "206", "status" : "Partial Content"},
	{"code" : "301", "status" : "Moved Permanently"},
	{"code" : "302", "status" : "Found"},
	{"code" : "303", "status" : "See Other"},
	{"code" : "304", "status" : "Not Modified"},
	{"code" : "307", "status" : "Temporary Redirect"},
	{"code" : "308", "status" : "Permanent Redirect"},
	{"code" : "404", "status" : "Not Found"},
	{"code" : "410", "status" : "Gone"},
	{"code" : "412", "status" : "Precondition Failed"},
	{"code" : "451", "status" : "Unavailable For Legal Reasons"},
	{"code" : "500", "status" : "Internal Server Error"},
	{"code" : "501", "status" : "Not Implemented"},
	{"code" : "502", "status" : "Bad Gateway"},
	{"code" : "503", "status" : "Service Unavailable"},
	{"code" : "504", "status" : "Gateway Timeout"}
];
var code = null;
var def = null;
var timer = 5;
var score = 0;

//----Functions----------------------
function changeDisplay (val) {
	$('monitor screen status').slideUp(100, function(){
		$(this).html(val).fadeIn(150);
		resetQuestion();
	});
}
function checkAnswer(code, def) {
	answer = getAnswer(code);
	if (answer.status == def){
		return true;
	}else{
		return false;
	}
}
function getAnswer(code) {
	answer = null;
	for(i=0;i<answers.length;i++){
		if(answers[i].code == code){
			answer = answers[i];	
		}
	}
	return answer;
}
function resetQuestion() {
	$('screen').removeClass("success");
	$('screen').removeClass("failure");
	
	$('button').removeClass("success");
	$('button').removeClass("failure");
	
	$('status').removeClass('fail');
	$('status').removeClass('solved');
}
function removeAnswer(answer) {
	var index = answers.indexOf(answer);
	if (index > -1) {
		answers.splice(index, 1);
	}
}
function scoreScreen() {
	$('status').html("Score:<br>"+score);
}
//----Init---------------------------
jQuery(document).ready(function($){
	$timer_el = $('counter');
	setInterval(function(){
		timer--;
		if(timer <= 0){
			timer = 5;
			var randIndex = Math.floor(Math.random()*(answers.length-1));
			if (answers.length > 0) {
				changeDisplay(answers[randIndex].code);
				code = answers[randIndex].code;	
			}else{
				scoreScreen();
			}
		}
		$timer_el.html(timer);
	}, 1000);

	$('button').click(function(){
		def = $(this).val();
		if(!$('status').hasClass("solved") && !$('status').hasClass("fail")){
			if(checkAnswer(code, def)){
				$('screen').addClass("success");
				$(this).addClass("success");

				$('status').append("<br><span>"+def+"</span>");
				
				if(!$(this).hasClass("solved")){
					$(this).prepend(code+" - ");
					$(this).addClass("solved");
					$('status').addClass("solved");
					removeAnswer(getAnswer(code));
				}

				score += 10*timer;
				$('score').html(score);
			}else{
				$('screen').addClass("failure");
				$(this).addClass("failure");

				$('status').append("<br><span>"+getAnswer(code).status+"</span>");
				$('status').addClass('fail');

				score = Math.max(score-10, 0);
				$('score').html(score);
			}
			def = null;	
		}
	});
});