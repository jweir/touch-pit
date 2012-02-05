(function(){

  var log = [], current, lastTime;

  function Pit(){
    this.events         = [];
    this.timestamps     = [];
    this.changedTouches = [];
    this.startTime      = new Date();
  }

  Pit.prototype.add = function(event){
    this.changedTouches.push(_.map(event.changedTouches, function(t){ return _.clone(t);}));
    this.events.push(event);
    this.timestamps.push(this.time());
  };

  Pit.prototype.time = function(){
    return new Date() - this.startTime;
  };

  Pit.prototype.replay = function(){
    var self = this;
    _.each(this.timestamps, function(t, i){
      setTimeout(function(){self.drawFrame(i);}, t);
    });
  };

  Pit.prototype.drawFrame = function(frame){
    _.each(this.changedTouches[frame], this.drawTouch);
  };

  Pit.prototype.drawTouch = function(touch){
    var el = $("<div/>").addClass("touch");
    el.css({left: touch.clientX, top: touch.clientY });
    $("body").append(el);
  };

  function start(event){
    current = new Pit();
    $("body").addClass("started");
    current.add(event);
  }

  function capture(event){
    current.add(event);
  }

  function stop(event){
    current.add(event);
    $("body").removeClass("started");
    lastTime = null;
    if(current.events.length === 0){ return true;
    } else {
      log.push(current);
      drawLink(current);
      return true;
    }
  }

  function drawLink(pit){
    var link = $("<div/>"), tc = touchCount(pit);

    link.html("<b>"+pit.events.length+"</b> "+Math.min.apply(null, tc)+" "+Math.max.apply(null, tc));
    $("#logs").append(link);
    link.on("mousedown", click).attr("data-log", log.length-1);
  }

  function touchCount(pit){
    return _.pluck(pit.changedTouches, "length");
  }

  function click(event){
    var index = $(this).attr("data-log");
    log[index].replay();
    $(".touch").remove();
    return true;
  }

  function init(){
    document.addEventListener("touchstart", start);
    document.addEventListener("touchmove", capture);
    document.addEventListener("touchend", stop);
    document.addEventListener("touchcancel", stop);
  }

  init();
}());
