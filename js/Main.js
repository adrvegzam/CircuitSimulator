import { Manager } from "./components/objects/Manager.js";
import { Circuit } from "./components/objects/Circuit.js";

import { EventHandler } from "./utils/Events.js";
import { keyboard } from "./utils/Keyboard.js";
import { Vector3 } from "./utils/Vector3.js"

//Define the canvas elements and its context.
var canvasb = document.getElementById("CanvasBackground");    //Saves the background canvas.
var cb = canvasb.getContext("2d");                            //Saves the background canvas context.
cb.imageSmoothingEnabled= false;                              //Set background canvas context aliasing to false.
var canvas = document.getElementById("Canvas");               //Saves the foreground canvas.
var Height = canvas.offsetHeight * window.devicePixelRatio;                             //saves the height of the window.
var Width = canvas.offsetWidth * window.devicePixelRatio;                               //Saves the width of the window.
var appScreen = document.getElementById("app-view");

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
var cameraZoom = 2;

Init();
//Initialization method.
/*This method executes only once at the init of the app*/
function Init(){

  document.querySelectorAll(".properties-list-element > input, select").forEach(x => x.onchange = setToolOptions);

  ///TOOLS EVENTS
  //Add event to the select tool button.
  document.getElementById("selectTool").addEventListener("click", function(){
    manager.changeTool('select');

  });

  //Add event to the interact tool button.
  document.getElementById("interactTool").addEventListener("click", function(){
    manager.changeTool('input');
  });

  //Add event to the move tool button.
  document.getElementById("moveTool").addEventListener("click", function(){
    manager.changeTool('move');
  });

  //Add event to the interact tool button.
  document.getElementById("connectTool").addEventListener("click", function(){
    manager.changeTool('add');
    manager.setOptionValue('component', 'wire');
  });

  //Add event to the add chip tool button.
  document.getElementById("chipTool").addEventListener("click", function(){
    manager.changeTool('add');
    manager.setOptionValue('component', 'chip');
  });

  //Add event to the add input tool button.
  document.getElementById("inputTool").addEventListener("click", function(){
    manager.changeTool('add');
    manager.setOptionValue('component', 'input');
    console.log(manager.toolOptions);
  });

  //Add event to the add output tool button.
  document.getElementById("outputTool").addEventListener("click", function(){
    manager.changeTool('add');
    manager.setOptionValue('component', 'output');
  });

  //Add event to the delete mode button.
  document.getElementById("deleteTool").addEventListener("click", function(){
    console.log(manager.circuit);
    manager.changeTool('delete');
  });

  //Add event to the download button.
  document.getElementById('saveFileOffline').addEventListener("click", function(event){
    // event.preventDefault();
    manager.downloadCircuit();
  })

  //Add event to the load button.
  document.getElementById('loadFileOffline').addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById('loadFile').click();
  })

  //Add event to the file loader.
  document.getElementById('loadFile').addEventListener('change', manager.loadCircuit);



  //Draw background.
  cb.fillStyle = "#18191d";
  cb.fillRect(0, 0, Width, Height);

  //Draw lines of the background.
  cb.strokeStyle = "#23242c";
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

Loop();
//Loop method.
/*This method executes every once in a while repeating itself many times until termination*/
function Loop(){
  requestAnimationFrame(Loop);

  //Tell the manager to execute its loop.
  manager.loop();

  //Reset keyboard events values.
  for(var i = 0; i < keyboard.keyDown.length-1; i++){
    keyboard.keyDown[i] = false;
  }
}

function setToolOptions(){
  var toolOptions = [];
  toolOptions.push("component:" + manager.getOptionValue("component"));
  toolOptions.push("inputs:" + document.getElementById("numberInputs").value); 
  toolOptions.push("outputs:" + document.getElementById("numberOutputs").value); 
  toolOptions.push("name:" + document.getElementById("textName").value);
  toolOptions.push("value:0");
  toolOptions.push("width:" + document.getElementById("numberWidth").value); 
  toolOptions.push("inTag:" + document.getElementById("textInTag").value);
  toolOptions.push("outTag:" + document.getElementById("textOutTag").value);
  
  console.log(toolOptions.join(";") + ";");
  manager.toolOptions = toolOptions.join(";") + ";";
}

function setCameraPos(newCameraPos){
  cameraPos = newCameraPos;
}

function setCameraZoom(newCameraZoom){
  cameraZoom = newCameraZoom;
}

export {circuit, manager, eventHandler, cameraPos,
        cameraZoom, appScreen, setCameraPos, setCameraZoom};