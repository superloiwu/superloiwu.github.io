/*------Problems and Notes----------*/
//based on https://www.reddit.com/r/dailyprogrammer/comments/3qjnil/20151028_challenge_238_intermediate_fallout/.
//No current Problems.
//problem with input screen not appending correctly
//problem with dud removed not working once the screen had reset once
//Project is completed.
//() <> [] {} --- duds

var howManyDuds = 7; //must be less than 15.
var tries = 4;
var x_length = 315; //changes how much the gibberish screen will spread across the x axis
//y axis requires to add in more in the variable rows on line 265.
var player_selected_words = false;//change how much words you want, must be less than 15.
var allowToPress = true;//determines if the player can press the on/off button used for testing purposes.
var sayCorrectWord = false;//should the correct word be displayed in the console?
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const quotes = {
  quote1:"Realize that sleeping on a futon when you're 30 is not the worst thing. You know what's worse, sleeping in a king bed next to a wife you're not really in love with but for some reason you married, and you got a couple kids, and you got a job you hate. You'll be laying there fantasizing about sleeping on a futon. There's no risk when you go after a dream. There's a tremendous amount of risk to playing it safe.",
  quote2:"At the end of the day I say to myself, 'Did I make a difference?' I hope the answer is always yes.",
  quote3:"Service to others is the rent you pay for your room here on Earth.",
  quote4:"Don't cling to a mistake just because you spend a lot of time making it.",
  quote5:"Your future self is watching you right now through your memories.",
  quote6:"Listen<br>I wish I could tell you it gets better.<br> But it doesn't get better.<br>You get Better.",
  quote7:"Sometimes you never know the value of a moment until it becomes a memory.",
  quote8:"I'll tell you a secret. Something they don;t teach you in your temple. The Gods envy us. They envy us because we're mortal, because any moment might be our last. Everything is more beautiful because we're doomed. You will never be lovelier than you are right now. We will never be here again.",
  quote9:"If I quit now, I will soon be back to where I started and when I started, I was desperately wishing to be where I am now.",
  quote10:"Just because you took longer than others, doesn't mean you failed.<br> Remember that.",
  quote11:"I understand there's a guy inside me who wants to lay in bed, smoke weed all day, and watch cartoons and old movies. My whole life is a series of stratagems to avoid, and outwit, that guy.",
  quote12:"The greatest pleasure in life is doing what people say you cannot do.",
  quote13:"Ideas not coupled with action never become bigger than the brain cells they occupied.",
  quote14:"Every day may not be good, but there's something good in every day.",
  quote15:"Stop waiting for Friday, for summer, for someone to fall in love with you, for life. Happiness is achieved when you stop waiting for it and make the most of the moment you're in right now.",
  quote16:"I've had a lot of worries in my life, most of which never happened.",
  quote17:"Why Worry? If you have done the very best you can. Worrying won't make it any better. If you want to be successful, respect one rule - <br> Never let failure take control of you.<br> Everybody has gone through something that has changed them in a way that they could never go back to the person they once were. Relations are like electric currents, wrong connections will give you shocks throughout your life, but the right ones will light up your life.",
  quote18:"It does not matter how slowly you go as long as you do not stop.",
  quote19:"If it's not impossible there must be a way to do it.",
  quote20:"Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.",
  quote21:"Computer are like Old Testament gods: <br>lots of rules and no mercy.",
  quote22:"The night is far spent, the day is at hand;<br> let us therefore cast off the works of darkness, and let us put on the armor of light.",
  quote23:"The release of atomic energy has not created a new problem. It has merely made more urgent the necessity of solving an existing one.",
  quote24:"Be extremely subtle, even to the point of formlessness. Be extremely mysterious, even to the point of soundlessness. Thereby you can be the director of the opponent's fate.",
  quote25:"Take the risk of thinking for yourself,<br>much more happiness, truth, beauty, and wisdom<br> will come to you that way.",
  haiku1:"The wren<br>Earns his living<br>Noiselessly.",
  haiku2:"Winter seclusion -<br> Listening, that evening,<br>To the rain in the mountain.",
  haiku3:"Summer night -<br>even the stars<br>are whispering to each other.",
  haiku4:"Over the wintry<br>forest, winds howl in rage<br>with no leaves to blow.",
  haiku5:"Toward those short trees<br>We saw a hawk descending<br>On a day in spring.",
  haiku6:"Sparrow's child<br>out of the way, out of the way!<br>the stallion's coming through.",
  haiku7:"I kill an ant<br>and realize my three children<br>have been watching.",
  haiku8:"The lamp once out<br>Cool stars enter<br>The window frame.",
  haiku9:"In the cicada's cry<br>No sign can foretell<br>How soon it must die.",
  haiku10:"First autumn morning<br>the mirror I stare into<br>shows my father's face.",
  haiku11:"Now my tendrilled soul,<br>Has found its pergola-- Christ--<br>To wind its way up....",
  haiku12:"Won't you come and see<br>loneliness? Just one leaf<br>from the kiri tree.<br>Fallen sick on a journey,<br>In dreams I run wildly<br>Over a withered moor.",
  haiku13:"If I had the knack<br>I'd sing like<br>Cherry flakes falling<br>Summer grasses,<br>All that remains<br>Of soldiers' dreams",
  haiku14:"Clouds come from time to time<br>and bring to men a chance to rest<br>from looking at the moon.",
  haiku15:"Hold fast to dreams<br>For if dreams die<br>Life is a broken-winged bird<br>That cannot fly.<br>Hold fast to dreams<br>For when dreams go<br>Life is a barren field<br>Frozen with snow. "
}
const words = {
  very_easy: ["FRIED","TREES","RIGID","HIRED","TRIES","WRITE","TRIED","GREED","DRIED","BRAIN","SKIES","LAWNS","GHOST","CAUSE","PAINT","SHINY","MAKES","GAINS","THIEF","BASES","RAISE","REFER","CARES","TAKEN","WAKES","WAVES","WARNS","SAVES"],
  easy:["STATING","HEALING","COSTING","REASONS","SEASIDE","SPARING","CAUSING","CRAFTED","PRISONS","PRESENT","DEALING","SETTING","LEAVING","VERSION","DEATHLY","BLAZING","GRANITE","TESTING","TRAITOR","STAMINA","TRINITY","CALLING","TALKING","ACQUIRE","WELCOME","DECRIES","FALLING","PACKING","ALLOWED","SELLING","AFFRONT","WALKING"],
  average:["CONQUORER","CONSISTED","WONDERFUL","COMMITTEE","SURRENDER","SUBJECTED","CONVICTED","FORBIDDEN","FORTIFIED","COLLECTED","CONTINUED","PERIMETER","SOUTHEAST","RELEASING","SOMETHING","ACCEPTING","MUTATIONS","GATHERING","LITERALLY","REPAIRING","INCESSANT","INTERIORS","REGARDING","TELEPHONE","OBTAINING","EXTENSIVE","DEFEATING","REQUIRING","UNLOCKING","RECYCLING","INSTINCTS","BARTERING","COMMUNITY","BATTERIES","RECIEVING","INCLUDING","INITIALLY","INVOLVING","MOUNTAINS"],
  hard:["DISCOVERING","ELIMINATING","UNIMPORTANT","MISTRUSTING","MANUFACTURE","RADIOACTIVE","EXCLUSIVELY","BOMBARDMENT","DECEPTIVELY","INDEPENDENT","UNBELIEVERS","EFFECTIVELY","IMMEDIATELY","INFESTATION","DESCRIPTION","INFORMATION","REMEMBERING","NIGHTVISION","DESTRUCTION","OVERLOOKING"],
  very_hard : ["INFILTRATION","ORGANIZATION","AUTHENTICITY","APPRECIATION","SPOKESPERSON","LABORATORIES","INITIATEHOOD","SUBTERRANEAN","PURIFICATION","TRANSMISSION","CIVILIZATION","CONSTRUCTION","RESURRECTION","REPRIMANDING","ACCOMPANYING","OVERWHELMING","CONVERSATION","NORTHERNMOST","TRANSCRIBING","ANNOUNCEMENT","SECLUTIONIST"]
}
var audioIDs = ["k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11",]
var letters = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890[]()<>{}\|/!@#$%^&*";
function randomLetter () {
  return letters[getRandomInt(0,letters.length-1)];
}

function wordToNumber (letter) {
  switch(letter) {
      case "first" :
	      return 1;
      case "second" :
	      return 2;
      case "third" :
	      return 3;
      case "fourth" :
	      return 4;
      case "fifth" : 
	      return 5;
      case "sixth" :
	      return 6;
      case "seventh" :
	      return 7;
      case "eighth" :
	      return 8;
      case "ninth" : 
        return 9;
      case "tenth" :
        return 10;
      case "eleventh" : 
        return 11;
      case "twelfth" :
        return 12;
      case "thirteenth" : 
        return 13;
      case "fourteenth" : 
        return 14;
      case "fifteenth" : 
        return 15;
      case "sixteenth" : 
        return 16;
      case "seventeenth" :
        return 17;
      case "eighteenth" : 
        return 18;
      case "nineteenth" : 
        return 19;
      case "twentieth" : 
        return 20;
  }
}

function getDuds(amt_of_inner) {
  var dud_endings = [["[","]"],["{","}"],["<",">"],["(",")"]];
  var single_dud = [];
  let amountIn = getRandomInt(1,amt_of_inner);
  let dudSelection = dud_endings[getRandomInt(0,3)];
  for (var x = 0; x<= amountIn;x++) {
    if (x === 0) {
     single_dud.push(dudSelection[0]);
    }
    else if (x == amountIn) {
      single_dud.push(dudSelection[1]);
    }
    else {
      single_dud.push(letters[getRandomInt(0,letters.length-1)]);
    }
    
  }
  return single_dud.join("");
}


var difficulty = "";
$(document).ready(function() {
  
  $(".fa-cogs").click(function() {
    $(".black-computer-framing-before").css("display","none");
    $(".settings-screen").css("display","block");
  })
  
  $("#confirm").click(function() {
    var wd = $("#wd").val(),//word
        dd = $("#dd").val(),//duds
        tr = $("#tr").val();//tries
    if (wd != "" && wd != null && wd != undefined && typeof +wd == "number") {
      if (wd >= 15) {
        player_selected_words = 15;
      }
      else {
        player_selected_words = wd;
      }
      
    }
    
    if (dd != "" && dd != null && typeof +dd == "number") {
      if (dd >= 15) {
        howManyDuds = 15;
      }
      else {
        howManyDuds = dd;
      }
    }
    
    if (tr != "" && tr != undefined && tr != "null" && typeof +tr == "number") {
      if (tr>=10) {
        tries = 10;
      }
      else {
        tries = tr;
      }
    }
    $(".settings-screen").css("display","none");
    $(".black-computer-framing-before").css("display","block");
  })
  
  $("#back").click(function() {
    $(".help-screen").css("display","none");
    $(".black-computer-framing-before").css("display","block");
  })
  
  $("#help").click(function() {
    $(".black-computer-framing-before").css("display","none");
    $(".help-screen").css("display","block");
  })
  
  $("li").click(function() {
    difficulty = $(this).text().replace(" ", "_").toLowerCase();
    $(".black-computer-framing-before").css("display","none");//changing screens
    $(".black-computer-framing").css("display","block");
    $(".title-screen").html("<p class = 'text-center' id = 'title'></p>")//title-reading
    $(".title-screen").append("<p id = 'enter-password'></p>"); //enterpassword
    $(".title-screen").append("<p id = 'password-attempts'><span id = 'player-tries'></span></p><br>");//password attempts
    var readings = {
      title: "ROBO INDSTRUIES (TM) TERMLINK PROTOCOL",
      password: "ENTER PASSWORD :",
      attempts:"Attempts remaining --> " + tries + " "+ dots(tries)
    }, 
    reading = "",counter_title = 0,counter_password = 0, counter_attempts = 0;
    
     var typing_effect = setInterval(function() {
       allowToPress = false;
       $("#"+ audioIDs[getRandomInt(0,audioIDs.length-1)] )[0].play();
      if (undefined != readings.title && counter_title <= readings.title.length) {
        reading += readings.title.charAt(counter_title);
        $("#title").text(reading);
        counter_title++;
      }
      else if (undefined != readings.password && counter_password <= readings.password.length) {
        if (counter_password === 0) {
          reading = "";
        }
        reading += readings.password.charAt(counter_password);
        $("#enter-password").text(reading);
        counter_password++;
      }
       else if (undefined != readings.attempts && counter_attempts <= readings.attempts.length + 4) {
         if (counter_attempts === 0) {
           reading = "";
         }
         reading += readings.attempts.charAt(counter_attempts);
         $("#password-attempts").text(reading);
         counter_attempts++;
       }
      else {
        clearInterval(typing_effect);
        hacking_interface();
        allowToPress = true;
      }
    },50)
    
  })//.click
  
var dudsThatAreInActualGame = [],
    correct_word = "",
    inGameWordsThatAreInActualGame = [];
function hacking_interface() {//36
  {
    letters = letters.split(""); //570
  var duds = [];
  var ingame_words = [];
    
  for (var x = 0;x<=howManyDuds;x++) {
    duds.push(getDuds(10));
    }
  }
  
  (function getWords() {//?
    var player_selected_difficulty = words[difficulty];
    if (player_selected_words === false) {
      var randomNumber = getRandomInt(7,15);
    }
    else {
      randomNumber = player_selected_words;
    }
    for (var x = 0;x<=randomNumber;x++) {
      ingame_words.push(player_selected_difficulty[getRandomInt(0,player_selected_difficulty.length-1)] );
    }
    correct_word = ingame_words[getRandomInt(0,ingame_words.length-1)];
  })();
    ingame_words.splice(ingame_words.indexOf(correct_word),1);
  var rows = {
    first:null,
    second:null,
    third:null,
    fourth:null,
    fifth:null,
    sixth:null,
    seventh:null,
    eigth:null,
    ninth:null,
    tenth:null,
    eleventh:null,
    twelfth:null,
    thirteenth:null,
    fourteenth:null,
    fifteenth:null
  }
  var correctWordUsed = false;
  
  function willUseCorrectWord(rowName) {
    if (correctWordUsed === false && wordToNumber(rowName) != Object.keys(rows).length) {
        if (Math.random() <=0.1) {
          correctWordUsed = true;
          return true;
        }
        else {
          return false;
        }
    }
    else if (correctWordUsed === true) {
      return false;
    }
    else {
      correctWordUsed = true;
      return true;
    }
  }
  
  function willUseRandomWord (rowName) {
    if ((ingame_words.length + wordToNumber(rowName)) >= Object.keys(rows).length +1) {//if there is too few rows for words
      return true;
    }
    else if (ingame_words[0] == undefined || ingame_words[0] == null) {//if there is no more words to choose from
      return false;
    }
    else {
      return Math.random()>=0.5;
    }
  }
  
  function willUseDud(rowName) {
    if ((duds.length + wordToNumber(rowName)) >= Object.keys(rows).length+1) {
      return true;
    }
    else if (duds[0] == undefined || duds[0] == null) {
      return false;
    }
    else {
      return Math.random()>=0.5;
    }
  }
    
  function makeFirstRow(row,correctWord,dud,randomWord) {
    //problem where an undefined value gets into the array
     var dummyRow = [],
         rdmint1 = getRandomInt(0,30),
         rdmint2 = getRandomInt(0,30),
         rdmint3 = getRandomInt(0,30);
      for (var x = 0; x<=30;x++) {
        dummyRow.push(randomLetter())
        if (correctWord && x == rdmint1) {
          correctWordUsed = true;
          dummyRow.push(correct_word);
        }
      
        if (dud && x == rdmint2) {
          let rdm = duds[getRandomInt(0,duds.length-1)]
          dummyRow.push(rdm);
          dudsThatAreInActualGame.push(rdm);
          duds = duds.filter(function(value) {
            if (value == rdm) {
              return false;
            }
            else {
              return true;
            }
          });
          
        }
      
        if (randomWord && x == rdmint3) {
          let rdm1 = ingame_words[getRandomInt(0,ingame_words.length-1)];
          dummyRow.push(rdm1);
          inGameWordsThatAreInActualGame.push(rdm1);
          ingame_words = ingame_words.filter(function(value) {
            if (value != rdm1) {
              return true;
            }
            else {
              return false;
            }
          });
        }
      }
      return dummyRow;
  }
    
  function minimizeRow (row) {
    var askd = 1;
    return row.filter(function(value) {
      if (value.length == 1 && askd == 1) {
        askd--;
        return false;
      }
      else {
        return true;
      }
    })
  }
  
  function addToRow (row) {
    for (var x = 0;x<=2;x++) {
      let rdm4 = getRandomInt(0,row.length-1);
       row.splice(rdm4,0,randomLetter() );
    } 
    return row;
  }
  
  function maximizeRow (row,correctWord,dud,randomWord) {
    if (row[0] == undefined || row[0] == null) {
      return makeFirstRow(row,correctWord,dud,randomWord);
    }
    else {
      return addToRow(row);
    }
    
  }
    
  function addHTML (row) {//problem with &lt;
    return row.map(function(value) {
      if (value.length == 1) {//if its a random letter
      value = "<span id = 'letter'>" + value + "</span>";  
      }// if its a dud
      else if (value[0] == "(" || value[0] == "[" || value[0] == "{" || ( /&lt;/.test(value) == true && /&gt;/.test(value) == true)   ) {
        value = "<span id = 'dud' data-dud = '"+value+"'>" + value + "</span>";
      }
      else {//if its a word
        value = "<span id = 'word' data-word = '"+value+"'>" + value + "</span>"
      }
      return value;
    })
    
  }
  
  function changeToCharacterEntity(row) {
    return row.map(function(value) {
      value = value.replace(/</g,"&lt;");
      value = value.replace(/>/g,"&gt;");
      //value = value.replace(/\//g,"&sol;");
      return value;
    })
  }
  
  function createRow (row,theRowName) {
    var resultantRow = "";
    if (correctWordUsed === false) {
      var useCorrectWord = willUseCorrectWord(theRowName);
    }
    else {
      var useCorrectWord = false
    }
    var useDud = willUseDud(theRowName);
    var useRandomWord = willUseRandomWord(theRowName);
    var widthOfRow = 0;
    function checkWidth() {
      $("#ignore").html("<span id = 'Width'>" + resultantRow.join("") + "</span>");
      widthOfRow = Math.floor($("#Width").width());
    }
    while (widthOfRow <= x_length) {
      resultantRow = maximizeRow(resultantRow,useCorrectWord,useDud,useRandomWord);
      resultantRow = changeToCharacterEntity(resultantRow);
      checkWidth()
    }//<---- Looop ---->
    while (widthOfRow >= x_length + 17) {
      resultantRow = minimizeRow(resultantRow);
      checkWidth()
    }
    resultantRow = addHTML(resultantRow);
    return resultantRow;
  }
  
  for (var j in rows) {
      rows[j] = createRow(rows[j],j);
  }
  for (var b in rows) {
    $(".hacking-screen").append("<p id = 'rows'>" + rows[b].join("") + "</p>");
  } 
    inGameWordsThatAreInActualGame.splice(inGameWordsThatAreInActualGame.indexOf(correct_word),1);
  if ($(".hacking-screen").height() >=310) {
    $(".hacking-screen").html("<h2 class = 'text-center'>An error occured displaying the screen.</h2>")
  }
  if (sayCorrectWord) {
    console.log(correct_word);
  }
}//hacking-interface

function dots(number) {
  var result = "";
  for (var x = 0; x <= number -1;x++) {
    result += " ⬛"; 
  }
  return result;
}
  
function inputWin(word) {
  $(".input-screen").html("<p style = 'order: 3'> &gt; " + word + "</p>")
  $(".input-screen").append("<p style = 'order:2'> &gt; Exact Match!</p>");
  $(".input-screen").append("<p style = 'order :1'> &gt; Please wait while system is accessed.</p>");
  $(".input-screen").append("<p id = 'dotting-win'></p>");
}
  
function getQuoteOrHaiku() {
  var arr = [];
  for (var x in quotes) {
    arr.push(quotes[x])
  }
  return arr[getRandomInt(0,arr.length)];
}
  
function amtOfRightPlaces(word) {
	var resultantAmount = 0;
	var comparisonWord = correct_word.split("");
	word = word.split("");
	for (var x = 0;x<=word.length-1;x++) {
		if (word[x] == comparisonWord[x]) {
			resultantAmount++;
		}
	}
	return resultantAmount;
}
  
function dotsForDud (wordLength) {
  var l = "•";
  var res = "";
  for (var x = 0;x<=wordLength.length -1;x++) {
    res += l + " ";
  }
  return res;
}
  
  var verticalAlign = 1000;
$(".hacking-screen").on("click","#word",function() {
  
  if ($(this).text() == correct_word) { //if the player chose the correct word
    $("#pg")[0].play();
    inputWin($(this).text() );
    var dotts = "•",
        readings = "&gt; ";
    var goToWinScreen = setInterval(function() {
      readings += dotts.charAt(0);
      $("#dotting-win").html(readings);
      if (readings.length >=11) {
        clearInterval(goToWinScreen);
        $(".black-computer-framing").css("display","none");
        $(".win-screen").css("display","block");
        $("#win-quote").html("<p>&quot;" + getQuoteOrHaiku() + "&quot;</p>")
      }
    },500);
    
  }
  else {//otherwise the player must have choosen an incorrect word
    $("#pb")[0].play();
    tries--;
    if (tries !== 0) {
      (function changeTries() {
      $(".title-screen").html("<p class = 'text-center' id = 'title'>ROBO INDSTRUIES (TM) TERMLINK PROTOCOL</p>")//title-reading
      $(".title-screen").append("<p id = 'enter-password'>ENTER PASSWORD :</p>"); //enterpassword
      $(".title-screen").append("<p id = 'password-attempts'>Attempts remaining --> "+tries+ " " + dots(tries) +"</p><br>");  
      })();
      //Attempts remaining --> " + tries + " "+ dots(tries)
      (function inputChances(inputtedWord) {
        $(".input-screen").append("<p style = 'order:" + verticalAlign + "'>&gt; " + inputtedWord + "</p>");
        $(".input-screen").append("<p style = 'order:" + verticalAlign + "'>&gt; Entry Denied.  "+ amtOfRightPlaces( inputtedWord ) +"/"+correct_word.length+ "  correct.</p>");
      })( $(this).text() );
    }
    
    else {
      console.log(correct_word);
      $(".black-computer-framing").css("display","none");
      $(".failed-screen").css("display","block");
    }
    
  }
  verticalAlign--;
})
  
  var falseWords = inGameWordsThatAreInActualGame;
$(".hacking-screen").on("click","#dud",function() {
  verticalAlign--;
  if (Math.random() >=0.2) {
    
    (function deleteARandomWord() {
      var wrd = $(".hacking-screen").find("[data-word = '" + falseWords[getRandomInt(0,falseWords.length-1)] + "']");
      wrd.text(dotsForDud(wrd.text()) );
      inGameWordsThatAreInActualGame.splice(inGameWordsThatAreInActualGame.indexOf(wrd.attr("data-word")),1);
      falseWords.splice(falseWords.indexOf(wrd.attr("data-word")),1)
      wrd.attr("data-word","null");
      
      $(".input-screen").append("<p order = '" + verticalAlign + "'>&gt; Dud removed.</p>")
  })();
    
  }
  else {
    
    (function replenishAttempts() {
      tries = 4;
      $(".title-screen").html("<p class = 'text-center' id = 'title'>ROBO INDSTRUIES (TM) TERMLINK PROTOCOL</p>")//title-reading
      $(".title-screen").append("<p id = 'enter-password'>ENTER PASSWORD :</p>"); //enterpassword
      $(".title-screen").append("<p id = 'password-attempts'>Attempts remaining --> "+tries+ " " + dots(tries) +"</p><br>");
      $(".input-screen").append("<p order = '" + verticalAlign + "'>&gt; Allowance replinshed.</p>");
  })();
    
  }
  $(this).attr("id","dead-dud");
})

$(".hacking-screen").on("mouseover","span",function() {
  var mouseover = $(this).text();
  if ( !(/•/.test(mouseover) ) ) {
    var mouseoverReading = "";
    var int = 0;
    var inputTypingEffect = setInterval(function() {
      $("#"+ audioIDs[getRandomInt(0,audioIDs.length-1)] )[0].play();
      mouseoverReading += mouseover.charAt(int) 
      $(".lower-input-screen").html("<p>&gt; "+mouseoverReading+"</p>")
      int++;
      if (mouseoverReading.length == mouseover.length) {
        clearInterval(inputTypingEffect);
      }
    },50);
  }
  
});

function resetGame () {
  letters = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890[]()<>{}\|/!@#$%^&*";
      tries = 4;
      dudsThatAreInActualGame = [];
      correct_word = "";
      inGameWordsThatAreInActualGame = [];
 }
  var on = false;
  $("#turn").click(function() {
    if (on === false) {
      $(".black-screen").css("display","none");
      $(".black-computer-framing-before").css("display","block");
      $("#po")[0].play();
      on = true;
    }
    else {
      if (allowToPress == true) {
        (function removeAllScreens() {
          $(".black-computer-framing-before").css("display","none");
          $(".help-screen").css("display","none");
          $(".settings-screen").css("display","none");
          $(".black-computer-framing").css("display","none");
          $(".failed-screen").css("display","none");
          $(".win-screen").css("display","none");
          $(".hacking-screen").empty();
          $(".input-screen").empty();
          $(".lower-input-screen").empty();
          $(".black-screen").css("display","block");
        })();
        resetGame();
        $("#pof")[0].play();
        on = false;
      }
        
    }//else
    
  })
 
});