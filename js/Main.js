import { Manager } from "./components/objects/Manager.js";
import { Circuit } from "./components/objects/Circuit.js";

import { EventHandler } from "./utils/Events.js";
import { keyboard } from "./utils/Keyboard.js";
import { Vector3 } from "./utils/Vector3.js"

//Define the canvas elements and its context.
var canvasb = document.getElementById("CanvasBackground");    //Saves the background canvas.
var cb = canvasb.getContext("2d");                            //Saves the background canvas context.
var canvas = document.getElementById("Canvas");               //Saves the foreground canvas.
var Height = window.innerHeight;                              //saves the height of the window.
var Width = window.innerWidth;                                //Saves the width of the window.

//Set the background and foreground canvas to the window height and width.
canvasb.width = Width;                                        
canvasb.height = Height;
canvas.width = Width;
canvas.height = Height;

//Create new Circuit, EventHandler and Manager.
var circuit = new Circuit(canvas);
var eventHandler = new EventHandler();
var manager = new Manager(circuit);

//Define a camera position in order to be able to move all the circuit at once.
var cameraPos = new Vector3(0, 0, 0);

Init();
//Initialization method.
/*This method executes only once at the init of the app*/
function Init(){

  //Add event to the change options button.
  document.getElementById("changeOptions").addEventListener("click", function(){
    manager.changeToolOptions(document.getElementById('optionsText').value);
    var binary = circuit.toBin();
    circuit.binToObject(binary);
  });

  //Add event to the input mode button.
  document.getElementById("inputModeButton").addEventListener("click", function(){
    manager.changeTool('input');
  });

  //Add event to the add mode button.
  document.getElementById("addModeButton").addEventListener("click", function(){
    manager.changeTool('add');
  });

  //Add event to the delete mode button.
  document.getElementById("deleteModeButton").addEventListener("click", function(){
    manager.changeTool('delete');
  });


  //Draw background.
  cb.fillStyle = "#181818";
  cb.fillRect(0, 0, Width, Height);

  //Draw lines of the background.
  cb.strokeStyle = "#202020";
  for(var x = 0; x < Width; x+=10){
    cb.moveTo(x, 0);
    cb.lineTo(x, Height);
    cb.stroke();
  }

  for(var y = 0; y < Height; y+=10){
    cb.moveTo(0, y);
    cb.lineTo(Width, y);
    cb.stroke();
  }
}

var count = 0;
Loop();
//Loop method.
/*This method executes every once in a while repeating itself many times until termination*/
function Loop(){
  requestAnimationFrame(Loop);

  //Tell the manager to execute its loop.
  manager.loop();
  if(circuit.chips.length == 1 && count == 0){
    console.log(circuit.toBin());
    count++;
  }

  //Reset keyboard events values.
  for(var i = 0; i < keyboard.keyDown.length-1; i++){
    keyboard.keyDown[i] = false;
  }
}

export {circuit, manager, eventHandler, cameraPos};