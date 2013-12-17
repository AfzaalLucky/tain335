function play() {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) dewp.dewplay();
}
function stop() {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) dewp.dewstop();
}
function pause() {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) dewp.dewpause();
}
function next() {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) dewp.dewnext();
}
function prev() {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) dewp.dewprev();
}
function set(file) {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) {
	dewp.dewset(file);
  }
}
function go(index) {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) {
	dewp.dewgo(index);
  }
}
function setpos(ms) {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) {
	dewp.dewsetpos(ms);
  }
}
function getpos() {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) {
	alert(dewp.dewgetpos());
  }
}
function volume(val) {
  var dewp = document.getElementById("dewplayer");
  if(dewp!=null) {
	alert(dewp.dewvolume(val));
  }
}