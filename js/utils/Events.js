import { appScreen, cameraPos, cameraZoom, circuit } from "../Main.js";
import { gridFixed, positionToSpace } from "./Utiles.js";
import { Vec3, Vector3 } from "./Vector3.js";

////EXTERNAL VARIABLES
var mousePos = null;        //Saves the current mouse position.
var clickPos = null;        //Saves the click positions.
var startClickPos = null;   //Saves the starting click position in a drag.
var endClickPos = null;     //Saves the ending click positions in a drag.
var mousePressed = false;   //Saves if the mouse is pressed or not.

////OBJECT DECLARATION.
/*This object is used to allow the app to save custom events in an event handler,
where all the events are saved in an array and you change them or delete them more easily.

@PARAMETERS

none

*/
function EventHandler(){
  this.mousemoveEvents = [];      //Saves an array of mousemove events.
  this.mousedownEvents = [];      //Saves an array of mousedown events.
  this.mouseupEvents = [];        //Saves an array of mouseup events.
  this.mousewheelEvents = [];     //Saves an array of mousewheel events.

  var selfEventHandler = this;
  //Add the mousemove main event in charge of managing the rest of mousemove events.
  circuit.canvasElement.addEventListener("mousemove", function(event){
    //get the mouse position and save needed variables for draging calculations.
    mousePos = new Vector3((event.pageX - appScreen.offsetLeft),
                           (event.pageY - appScreen.offsetTop), 0);
    startClickPos = endClickPos;
    endClickPos = mousePos;
    //Execute all the related events.
    for(var i = 0; i < selfEventHandler.mousemoveEvents.length; i++){
      selfEventHandler.mousemoveEvents[i](event);
    }
  });
  
  //Add the mousedown main event in charge of managing the rest of mousedown events.
  circuit.canvasElement.addEventListener("mousedown", function(event){
    //Get the click position and prepare for draging.
    clickPos = new Vector3((event.pageX - appScreen.offsetLeft),
                           (event.pageY - appScreen.offsetTop), 0);
    startClickPos = mousePos;
    mousePressed = true;
    //Execute all the related events.
    for(var i = 0; i < selfEventHandler.mousedownEvents.length; i++){
      selfEventHandler.mousedownEvents[i](event);
    }
  });
  
  //Add the mouseup main event in charge of managing the rest of mouseup events.
  circuit.canvasElement.addEventListener("mouseup", function(event){
    mousePressed = false;
    //Execute all the related events.
    for(var i = 0; i < selfEventHandler.mouseupEvents.length; i++){
      selfEventHandler.mouseupEvents[i](event);
    }
  });

  //Add the mouseupwheel main event in charge of managing the rest of mouseupwheel events.
  circuit.canvasElement.addEventListener("wheel", function(event){
    //Execute all the related events.
    for(var i = 0; i < selfEventHandler.mousewheelEvents.length; i++){
      selfEventHandler.mousewheelEvents[i](event);
    }
  });
}

export {EventHandler, mousePos, clickPos, mousePressed, startClickPos, endClickPos};
