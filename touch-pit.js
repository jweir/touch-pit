(function(){

  var log = [], current, lastTime;

  function time(){
    var now = new Date(), diff;
    lastTime = lastTime || now;
    diff = now - lastTime;
    lastTime = now;
    return diff;
  }

  function start(event){
    current = [];
    $("body").addClass("started");
    capture(event);
  }

  function capture(event){
    var changedTouches = _.map(event.changedTouches, function(t){ return _.clone(t);});
    current.push([time(), changedTouches]);
  }

  function stop(event){
    capture(event);
    $("body").removeClass("started");
    lastTime = null;
    if(current.length === 0){ return true;
    } else {
      log.push(current);
      drawLink(current);
      return true;
    }
  }

  function drawLink(collection){
    var link = $("<div/>");

    link.html("<b>"+current.length+"</b> "+Math.min.apply(null, touchCount(collection))+" "+Math.max.apply(null, touchCount(collection)));
    $("#logs").append(link);
    link.on("mousedown", click).attr("data-log", log.length-1);
  }

  function touchCount(collection){
    var touches = _(collection).map(function(i){ return i[1];});
    return _.pluck(touches, "length");
  }

  function click(event){
    animate(_.clone(log[this.getAttribute("data-log")]));
    $(".touch").remove();
    return true;
  }

  function animate(remaining){
    var frame = remaining.shift();
    if(frame){
      setTimeout(function(){drawFrame(frame[1], remaining);}, frame[0]);
    } else {
      console.log("done");
    }
  }

  function drawFrame(frame, remaining){
    _.each(frame || [], drawTouch);
    animate(remaining);
  }

  function drawTouch(touch){
    var el = $("<div/>").addClass("touch");
    el.css({left: touch.clientX, top: touch.clientY });
    $("body").append(el);
  }


  function init(){
    document.addEventListener("touchstart", start);
    document.addEventListener("touchmove", capture);
    document.addEventListener("touchend", stop);
    document.addEventListener("touchcancel", stop);
  }

  init();
}());
