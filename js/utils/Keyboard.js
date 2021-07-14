var keyboard = new Keyboard();

function Keyboard(){
  this.keyDown = [];

  
}

document.addEventListener("keydown", function(event){
  for(var i = 0; i <= 231; i++){
    keyboard.keyDown[i] = event.key.charCodeAt(0) == i;
  }
});

export {keyboard};