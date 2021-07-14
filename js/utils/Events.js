import { circuit } from "../Main.js";
import { Vector3 } from "./Vector3.js";

var mousePos = null;
var clickPos = null;
var mousePressed = false;

function EventHandler(){
  this.mousemoveEvents = [];
  this.mousedownEvents = [];
  this.mouseupEvents = [];
  this.dragEvents = [];

  var selfEventHandler = this;
  circuit.canvasElement.addEventListener("mousemove", function(event){
    mousePos = new Vector3(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, 0);
    for(var i = 0; i < selfEventHandler.mousemoveEvents.length; i++){
      selfEventHandler.mousemoveEvents[i](event);
    }
  });
  
  circuit.canvasElement.addEventListener("mousedown", function(event){
    clickPos = new Vector3(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, 0);
    mousePressed = true;
    for(var i = 0; i < selfEventHandler.mousedownEvents.length; i++){
      selfEventHandler.mousedownEvents[i](event);
    }
  });
  
  circuit.canvasElement.addEventListener("mouseup", function(event){
    mousePressed = false;
    for(var i = 0; i < selfEventHandler.mouseupEvents.length; i++){
      selfEventHandler.mouseupEvents[i](event);
    }
  });
}

export {EventHandler, mousePos, clickPos, mousePressed};
