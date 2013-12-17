function story(){
	console.log(this.value);
}
story.value = 5;
story();