var flashvars = {
  mp3: "/mp3/betty.mp3",
  javascript: "on",
  showtime:false,
  nopointer:true
};
/**
var params = {
  wmode: "transparent"
};*/
var attributes = {
  id: "dewplayer"
};
swfobject.embedSWF("/swf/dewplayer.swf", "dewplayer_content", "200", "20", "9.0.0", false, flashvars, {}, attributes);