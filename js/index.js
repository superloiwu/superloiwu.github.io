//List of variables which always looks so ugly.. unlike Pikachu, he's cute
var $pikachu = $(".pikachu");
var $pikachuWalk = $(".pikachu-walking");
var $jacob = $(".jacob");
var $jacobWalk = $(".jacob-walking");
var $road = $(".road");
var $wrapper = $('.wrapper');
var $main = $('.main-wrapper');
var $mainContent = $('.main-container');
var $snowContainer = $('.snow-container');
var $square = $('.square');
var $jingleBells = $('audio')[0];
var $speechbox = $('.speech-box');
var $message = $('.battle-message');
var $packMessage = $('.pack-message');
var $runMessage = $('.run-message');
var $packOption = $('.option.pack');
var $fightOption = $('.option.fight');
var $runOption = $('.option.run');
var $fightMenu = $('.fight-menu');
var $body = $('body');
var $info = $('.info');
var $options = $('.options');
var $presentContainer = $('.present-container');
var $presentTop = $('.present-top-container');
var $presentPixel = $('.present-pixel');
var $wrapper1 = $('.wrapper1');
var $wrapper2 = $('.wrapper2');
var $christmasMessage = $('.christmas-message');
var $dirt = $('.dirt');
var $dirtContainer = $('.road-dirt-container');
var $christmasTree = $('.christmas-tree');

$jingleBells.volume = 0.15;

var $windowHeight = window.innerHeight;
var $windowWidth = window.innerWidth;

document.ontouchmove = function(event) {
  event.preventDefault();
}

/*
// ON LOAD
*/
var pixelTimeline = new TimelineMax();
//Pikachu walking, he has a hat, why is he so cute?! I want one.. no not the hat, the Pikachu.
var pikaTimeline = new TimelineMax({
  repeat: -1,
  delay: 0.5,
  repeatDelay: 0.1
});
pikaTimeline
  .to($pikachu, 0, {
    autoAlpha: 0
  }, '0')
  .to($pikachuWalk, 0, {
    y: 10,
    x: -10,
    autoAlpha: 1
  }, '0')
  .to($pikachuWalk, 0, {
    y: 0,
    x: 0,
    autoAlpha: 0
  }, '0.1')
  .to($pikachu, 0, {
    autoAlpha: 1
  }, '0.1');

//Jacob walking... yep that's me
var jacobTimeline = new TimelineMax({
  repeat: -1,
  delay: 0.6,
  repeatDelay: 0.1
});
jacobTimeline
  .to($jacob, 0, {
    autoAlpha: 0
  }, '0')
  .to($jacobWalk, 0, {
    y: 10,
    autoAlpha: 1
  }, '0')
  .to($jacobWalk, 0, {
    y: 0,
    autoAlpha: 0
  }, '0.1')
  .to($jacob, 0, {
    autoAlpha: 1
  }, '0.1');

var treeTimeline = new TimelineMax({
  repeat: -1
});
treeTimeline
  .set($christmasTree, {
    autoAlpha: 1
  })
  .fromTo($christmasTree, 30, {
    css: {
      left: '-50%'
    }
  }, {
    css: {
      left: '100%'
    },
    ease: Linear.easeNone
  });

for (var i = 0; i < $dirt.length; i++) {
  var dirtTimeline = new TimelineMax({
    repeat: -1
  });
  var delay = randomNumber(25, 1)
  dirtTimeline
    .to($dirt[i], 20, {
      css: {
        left: '100%'
      },
      ease: Linear.easeNone
    }, delay);
};

//Snow falling down at random times because it makes it so christmassy.. and cute!
var $snowElement = $('.snow');
var $snow = $('.snow.normal');
var $snowSmall = $('.snow.small');
var $snowLarge = $('.snow.large');

for (var i = 0; i < $snowElement.length; i++) {
  var randomNo = randomNumber(90, -10);
  TweenMax.set($snowElement[i], {
    css: {
      left: randomNo + '%'
    }
  });
};

snowing($snow, 45, 35, 30, 0, 600);
snowing($snowSmall, 80, 45, 30, 0, 800);
snowing($snowLarge, 35, 25, 30, 0, 400);

function snowing(snowVar, time1, time2, delay1, delay2, xDist) {
  for (var i = 0; i < snowVar.length; i++) {
    var snowTimeline = new TimelineMax({
      repeat: -1
    });
    var time = randomNumber(time1, time2);
    var delay = randomNumber(delay1, delay2);
    snowTimeline
      .fromTo(snowVar[i], time, {
        y: 0,
        x: 0
      }, {
        y: $windowHeight,
        x: xDist,
        ease: Power1.easeOut
      }, delay)
      .fromTo(snowVar[i], 2, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      }, delay);
  };
}

/*
// CLICK METHODS
*/
//Start the epicness of battling...... a present!
var battle = false;
var $overlay = $('.overlay');
var $pixel = $('.main-container .pixel');
var smallScreen = $windowWidth <= 768;
var medScreen = $windowWidth > 768 && $windowWidth <= 1024;
//For some reason body click wouldn't work on iPad so I had to make an overlay.. stupid freakin iPads
$overlay.on('click', function() {
  if (battle === false) {
    setTimeout(function() {
      $jingleBells.pause();
      pikaTimeline.pause();
      jacobTimeline.pause();

    }, 1000);
    var battleTimeline = new TimelineMax({
      delay: 1
    });
    battleTimeline
      .set($overlay, {
        css: {
          display: 'none'
        }
      })
      .set($square, {
        css: {
          display: 'block'
        }
      })
      .set($wrapper, {
        css: {
          display: 'block'
        }
      })
      .set($speechbox, {
        css: {
          display: 'block'
        }
      })
      .to($wrapper, 0.2, {
        autoAlpha: 0.7
      }, 0)
      .to($wrapper, 0.2, {
        autoAlpha: 0.2
      })
      .to($wrapper, 0.2, {
        autoAlpha: 0.7
      })
      .to($wrapper, 0.2, {
        autoAlpha: 0.2,
        onComplete: battleBlackScreen
      })
      .to($snowContainer, 1, {
        autoAlpha: 0
      })
      .to($info, 1, {
        autoAlpha: 0
      }, '-=2')
      .to($christmasTree, 1, {
        autoAlpha: 0,
        onComplete: pauseTree
      }, '-=2')
      .to($dirtContainer, 1, {
        autoAlpha: 0
      }, '-=2')
      .set($mainContent, {
        autoAlpha: 0
      }, '+=1')
      .set($square, {
        css: {
          backgroundColor: 'white'
        }
      })
      .set($speechbox, {
        css: {
          zIndex: 10
        }
      })
      .set($presentContainer, {
        autoAlpha: 1
      });
    if (smallScreen) {
      battleTimeline.fromTo($presentContainer, 2, {
        css: {
          right: '135%'
        }
      }, {
        css: {
          right: '13%'
        },
        ease: Linear.easeNone
      }, '+=0.5')
    } else {
      battleTimeline.fromTo($presentContainer, 2, {
        css: {
          right: '135%'
        }
      }, {
        css: {
          right: '20%'
        },
        ease: Linear.easeNone
      }, '+=0.5')
    }
    battleTimeline
      .set($speechbox, {
        autoAlpha: 1
      })
      .set($options, {
        autoAlpha: 1
      }, '+=2')
      .set($message, {
        autoAlpha: 0
      });

  } else if (battle === true && !$body.hasClass('is-animating')) {
    pikaTimeline.pause();
    jacobTimeline.pause();
    var explodeTL = new TimelineMax();
    explodeTL.set($body, {
      className: '+=is-animating'
    });
    for (var i = 0; i < $pixel.length; i++) {
      var randomNumberX = generateNum(1, 5);
      var randomNumberY = generateNum(1, 8);
      explodeTL.to($pixel[i], 3, {
        y: randomNumberY,
        x: randomNumberX,
        ease: Power2.easeOut
      }, 0);
    };
    explodeTL
      .to($pixel, 3, {
        y: 0,
        x: 0,
        ease: Power2.easeIn,
        onComplete: unPauseTimeline
      })
      .set($body, {
        className: '-=is-animating'
      });
  };
});

var $open = $('.attack.open');
var $shake = $('.attack.shake');
var $notEffective = $('.not-effective');
var $superEffective = $('.super-effective');

$fightOption.on('click', function() {
  var fightTL = new TimelineMax();

  fightTL
    .set($options, {
      autoAlpha: 0
    })
    .set($fightMenu, {
      autoAlpha: 1
    });

});

$open.on('click', function() {
  var openTL = new TimelineMax();

  if (smallScreen) {
    TweenMax.to($presentContainer, 1, {
      css: {
        right: '33%'
      }
    });
  } else if (medScreen) {
    TweenMax.to($presentContainer, 1, {
      css: {
        right: '37%'
      }
    });
  } else {
    TweenMax.to($presentContainer, 1, {
      css: {
        right: '42%'
      }
    });
  }
  openTL
    .set($fightMenu, {
      autoAlpha: 0
    })
    .set($superEffective, {
      css: {
        display: 'block'
      }
    })
    .to($presentTop, 0.6, {
      y: -300
    }, '+=2')
    .to($wrapper1, 1, {
      css: {
        width: 0
      }
    })
    .to($wrapper2, 1, {
      css: {
        height: 0
      },
      onComplete: presentExplode
    }, '-=1')
    .to($speechbox, 1, {
      autoAlpha: 0,
      onComplete: playSong
    }, '-=1')
    .set($square, {
      css: {
        display: 'none'
      }
    })
    .set($wrapper, {
      autoAlpha: 1
    })
    .to($wrapper, 1, {
      css: {
        backgroundColor: '#2B2E39'
      }
    })
    .fromTo($christmasMessage, 1, {
      scale: 0
    }, {
      css: {
        display: 'block',
        scale: 1
      }
    }, '-=1')
    .to($christmasMessage, 2, {
      scale: 0,
      ease: Power2.easeIn
    }, '+=3')
    .to($presentPixel, 2, {
      y: 0,
      x: 0,
      ease: Power2.easeIn
    }, '-=2')
    .to($presentPixel, 1, {
      autoAlpha: 0
    }, '-=1')
    .to($wrapper, 1, {
      autoAlpha: 0
    })
    .set($mainContent, {
      css: {
        display: 'block'
      }
    }, '-=1')
    .to($dirtContainer, 1, {
      autoAlpha: 1
    }, '-=1')
    .to($christmasTree, 1, {
      autoAlpha: 1
    }, '-=1')
    .to($snowContainer, 1, {
      autoAlpha: 1,
      onComplete: playAnimation
    }, '-=1')
    .fromTo($mainContent, 1, {
      autoAlpha: 0
    }, {
      autoAlpha: 1
    }, '-=1')
    .to($info, 1, {
      autoAlpha: 1
    }, '-=1')
    .set($overlay, {
      css: {
        display: 'block'
      }
    });

  setTimeout(function() {
    battle = true;
  }, 3000);

  function playAnimation() {
    pikaTimeline.play();
    jacobTimeline.play();
    treeTimeline.play();
  }

  function playSong() {
    $jingleBells.play();
  }
});

$shake.on('click', function() {
  var shakeTL = new TimelineMax();
  shakeTL
    .set($fightMenu, {
      autoAlpha: 0
    })
    .fromTo($presentContainer, 0.25, {
      y: 0
    }, {
      y: 40,
      ease: Linear.easeNone
    }, '+=1')
    .fromTo($presentContainer, 0.25, {
      y: 40
    }, {
      y: -40,
      ease: Linear.easeNone
    })
    .fromTo($presentContainer, 0.25, {
      y: -40
    }, {
      y: 40,
      ease: Linear.easeNone
    })
    .fromTo($presentContainer, 0.25, {
      y: 40
    }, {
      y: -40,
      ease: Linear.easeNone
    })
    .fromTo($presentContainer, 0.25, {
      y: -40
    }, {
      y: 0,
      ease: Linear.easeNone
    })
    .to($presentContainer, 1, {
      rotation: 360,
      ease: Linear.easeNone
    })
    .set($presentContainer, {
      rotation: 0
    })
    .set($notEffective, {
      css: {
        display: 'block'
      }
    }, '+=1')
    .set($notEffective, {
      css: {
        display: 'none'
      }
    }, '+=1.5')
    .set($options, {
      autoAlpha: 1
    });
});

$runOption.on('click', function() {
  var runTL = new TimelineMax();
  runTL
    .set($options, {
      autoAlpha: 0
    })
    .set($runMessage, {
      css: {
        display: 'block'
      }
    })
    .set($runMessage, {
      css: {
        display: 'none'
      }
    }, '3')
    .set($options, {
      autoAlpha: 1
    });
});

$packOption.on('click', function() {
  var packTL = new TimelineMax();
  packTL
    .set($options, {
      autoAlpha: 0
    })
    .set($packMessage, {
      css: {
        display: 'block'
      }
    })
    .set($packMessage, {
      css: {
        display: 'none'
      }
    }, '3')
    .set($options, {
      autoAlpha: 1
    });
});

/*
// FUNCTIONS
*/
//Making the sequence random also makes it easier.
function battleBlackScreen() {
  var blackBattle = new TimelineMax();
  var $shuffledArray = Shuffle($square);
  for (var i = 0; i < $square.length; i++) {

    blackBattle.to($shuffledArray[i], 0.03, {
      autoAlpha: 1
    });
  };
};

function pauseTree(){
  treeTimeline.pause();
}
function unPauseTimeline() {
  pikaTimeline.play();
  jacobTimeline.play();
};
//Shuffle array function/technique by Chris Coyier at: https://css-tricks.com/snippets/javascript/shuffle-array/
function Shuffle(o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

function randomNumber(num1, num2) {
  var time = Math.floor((Math.random() * num1) + num2);
  return time;
};

function presentExplode() {
  for (var i = 0; i < $presentPixel.length; i++) {
    var randomNumberX = generateNum(1, 5);
    var randomNumberY = generateNum(1, 8);
    TweenMax.to($presentPixel[i], 3, {
      y: randomNumberY,
      x: randomNumberX,
      ease: Power2.easeOut
    }, 0);
  }
  $('.present-pixel.black-pixel').addClass('green-class');
};

function generateNum(num, greaterThanNum) {
  var minusOrPlus = Math.floor((Math.random() * 10) + 1);

  var randomNo = Math.floor((Math.random() * $windowHeight) + num);

  if (minusOrPlus > greaterThanNum) {
    randomNo = -randomNo;
  }

  return randomNo;
};