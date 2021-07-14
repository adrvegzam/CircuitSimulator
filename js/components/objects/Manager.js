import { eventHandler } from "../../Main.js";

import { mousePos, clickPos, mousePressed } from "../../utils/Events.js";
import { keyboard } from "../../utils/Keyboard.js";
import { Vec3, Vector3 } from "../../utils/Vector3.js";
import { distanceToSegment, gridFixed } from "../../utils/Utiles.js";

import { Chip } from "./Chip.js";
import { Wire } from "./Wire.js";
import { Pin } from "./Pin.js";
import { Output } from "./Output.js";
import { Input } from "./Input.js";

////OBJECT DECLARATION.
/*This object is used as wrapper for all the circuits in a proyect, managind all the needs of
it while being able to respond to the user events.

@PARAMETERS

*circuit:   Refers to the circuit of the proyect.

*/
function Manager(circuit){
  ////INTERNAL VARIABLES
  //Variables for the logic.
  this.circuit = circuit;   //Saves the circuit of the manager.
  this.tool = "add";        //Saves the actual tool in use of the manager.
  this.toolOptions = "component: chip; inputs: 3; outputs: 3; name: AND; value: 0; width: 4; tagName: Input1;";     //Saves the options for the tools.
  
  var newChip = null;       //Saves an auxiliary chip.
  var newInput = null;      //saves an auxiliary input.
  var newOutput = null;     //saves an auxiliary output.
  var newWire = null;       //Saves an auxiliary wire.
  
  //////INTERNAL METHODS
  ////USEFUL METHODS
  //Method to connect a wire to a pin.
  /*This method takes as input a wire and a pin, and makes a connection between them*/
  this.connectWireToPin = function(wire, pin){
    if(pin.type == "out"){
      wire.connections.push(pin);
    }else if(pin.type == "in"){
      pin.connection = wire;
    }
  }

  //Method to connect a wire to an input.
  /*This method takes as input a wire and an input, and makes a connection between them*/
  this.connectWireToInput = function(wire, input){
    wire.connections.push(input);
  }

  //Method to connect a wire to another wire.
  /*This method takes as input a wire and another wire, and makes a connection between them*/
  this.connectWireToWire = function(wire, targetWire){
    targetWire.positions[targetWire.positions.length] = wire.positions[0]; 
    wire = targetWire;
  }

  //Method to get the closest chip given a position.
  /*This method takes as input a position and returns the closest chip if exists*/
  this.getClosestChip = function(clickPos){
    if(this.circuit.chips.length == 0){return [undefined, undefined];}
    return this.circuit.chips.map((chip) => [chip, Vec3.subVector3(clickPos, chip.position).modulo()])
                             .sort((a, b) => a[1] - b[1])[0];
  }

  //Method to get the closest input given a position.
  /*This method takes as input a position and returns the closest input if exists*/
  this.getClosestInput = function(clickPos){
    if(this.circuit.inputs.length == 0){return [undefined, undefined];}
    return this.circuit.inputs.map((input) => [input, (Math.abs(input.position.y-clickPos.y) <= 5 && 
                                                      Math.abs(input.position.x-clickPos.x-input.width*5-5) <= input.width*5)?
                                                      1:Infinity])
                              .sort((a, b) => a[1] - b[1])[0];
  }

  //Method to get the closest wire given a position.
  /*This method takes as input a position and returns the closest wire if exists*/
  this.getClosestWire = function(clickPos, whitelist){
    if(this.circuit.wires.length == 0){return [undefined, undefined];}
    return this.circuit.wires.map((wire) => [wire, wire.positions
                             .map((position) => position
                             .map((vec, idx) => idx!=0?distanceToSegment(clickPos, position[idx-1], position[idx]):Infinity)
                             .reduce((acc, val) => Math.min(acc, val)))
                             .reduce((acc, val) => Math.min(acc, val))])
                             .sort((a, b) => a[1] - b[1])
                             .filter(x => x[0] != whitelist)[0];
  }

  //Method to get the closest pin given a position.
  /*This method takes as input a position and returns the closest pin if exists*/
  this.getClosestPin = function(clickPos){
    if(this.circuit.pins.length == 0){return [undefined, undefined];}
    return this.circuit.pins.map((pin) => [pin, Vec3.subVector3(pin.position, clickPos).modulo()])
                            .sort((a, b) => a[1] - b[1])[0];
  }

  //Method to get a certian option from the tool options.
  /*This methos takes as input the name of one tool parameter and returns its value*/
  this.getOptionValue = function(optionName){
    var indexOption = this.toolOptions.search(optionName);
    var indexEnd = this.toolOptions.indexOf(";", indexOption);
    return this.toolOptions.substring(indexOption + optionName.length + 1, indexEnd).trim();
  }

  //Method to chnage the current tool selected.
  /*This method takes as input the name of the new tool to be selected and changes it*/
  this.changeTool = function(newTool){
    this.tool = newTool;
  }

  //Method to chnage the current tool options selected.
  /*This method takes as input the new tool options and changes them*/
  this.changeToolOptions = function(newToolOptions){
    this.toolOptions = newToolOptions;
  } 

  ////MAIN METHODS
  //Method in charge of the main loop of the manager, drawing and updating everything.
  /*This method just tells the circuit when to draw and update everything*/
  this.loop = function(){
    for(var i = 0; i < 10; i++){
      this.circuit.update();
    }
    this.circuit.draw();

    if(newWire != null && keyboard.keyDown[69]){newWire = null;}
    if(newChip != null){newChip.draw(this.circuit.canvasContext);}
    if(newInput != null){newInput.draw(this.circuit.canvasContext);}
    if(newOutput != null){newOutput.draw(this.circuit.canvasContext);}
  }

  //Method in charge of the handling the click interactions with the circuit.
  /*This method gets as input a click position and depending on the tool and options resolves the interaction*/
  this.interactCircuit = function(clickPos){

    //Do something depending on the tool selected.
    switch(this.tool){
      //Check if the tool is the element addition.
      case "add":

        //Add the element depending on its type.
        switch(this.getOptionValue("component")){
          //Add element when it is a chip.
          case "chip":

            //Get parameters for the chip.
            var inputs = this.getOptionValue("inputs");               //Saves the number of inputs of the chip.
            var outputs = this.getOptionValue("outputs");             //Saves the number of outputs of the chip.
            var name = this.getOptionValue("name");                   //Saves the name of the chip.
            
            //Add the chip to the circuit.
            newChip = new Chip(clickPos, inputs, outputs, name);
            this.circuit.addElement(newChip);
            newChip = null;
            break;

          //Add element when it is an input.
          case "input":

            //Get parameters for the input.
            var tag = this.getOptionValue("tagName");                   //Saves the tag of the input.
            var inputWidth = parseInt(this.getOptionValue("width"));    //Saves the width of the input.

            //add the input to the circuit.
            newInput = new Input(clickPos, inputWidth, tag);
            this.circuit.addElement(newInput);
            newInput = null;
            break;
          
          //Add element when it is an output.
          case "output":

            //Get parameters for the output.
            var tag = this.getOptionValue("tagName");                     //Saves the tag of the output.
            var outputWidth = parseInt(this.getOptionValue("width"));     //Saves the width of the output.

            //add the output to the circuit.
            newOutput = new Output(clickPos, outputWidth, tag);
            this.circuit.addElement(newOutput);
            newOutput = null;
            break;

          //Add element when it is a wire.
          case "wire":

            var wireErrors = [];    //Saves all the errors that happen during creation.
            //If the auxiliar wire is null (its the first click) create the wire or connect it.
            if(newWire == null){
              
              //Get parameter for the wire
              var wireWidth = parseInt(this.getOptionValue("width"));     //Saves the width of the wire.
              var connectedToWire = 0;          //Saves true if the wire is connected to another wire.
              
              //Creates new auxiliar wire.
              newWire = new Wire([[clickPos]], wireWidth);
              newWireLength = newWire.positions[newWire.positions.length - 1].length;

              //Checks for a connection between the wire and the closest pin.
              var closestPin;
              closestPin = this.getClosestPin(clickPos);
              if(closestPin[1] < 5){
                //Check compatibility of bus size.
                if(closestPin[0].width != newWire.width){
                  wireErrors.push("Error de width.");
                  newWire = null;
                }
                else{
                  this.connectWireToPin(newWire, closestPin[0]);
                }
              }
             

              //Checks for a connection between the wire and the closest wire.
              var closestWire;
              if(this.circuit.wires.length != 0){
                closestWire = this.getClosestWire(clickPos, newWire);
                if(closestWire[1] < 5){
                  //Check compatibility of bus size.
                  if(closestWire[0].width == wireWidth){
                    this.connectWireToWire(newWire, closestWire[0]);
                    connectedToWire = 1;
                  }else{
                    wireErrors.push("Error de width.");
                    newWire = null;
                  }
                }
              }

              //If the wire creation has no errors and it has not connected to another wire, add it to the circuit.
              if(!connectedToWire && wireErrors.length == 0){
                this.circuit.addElement(newWire);
              }
            //If the auxiliar wire is not null (its not the first click) expand the wire or connect it.
            }else{

              //Adjust the length of the wire.
              newWireLength = newWire.positions[newWire.positions.length - 1].length;

              //Get the closest pin and connect to it if compatible.
              var closestPin;
              closestPin = this.getClosestPin(clickPos);
              if(closestPin[1] < 5 && closestPin[0].width == newWire.width){
                this.connectWireToPin(newWire, closestPin[0]); newWire = null;
              }
              
              //Get the closest input and connect to it if compatible.
              var closestInput;
              closestInput = this.getClosestInput(clickPos);
              if(closestInput[1] < 5 && closestPin[0].width == newWire.width){
                this.connectWireToInput(newWire, closestInput[0]); newWire = null;
              }

              //Get the closest wire and connect to it if compatible.
              var closestWire;
              closestWire = this.getClosestWire(clickPos, newWire);
              if(this.circuit.wires.length > 1){
                if(closestWire[1] < 5){
                  closestWire = closestWire[0];
                  closestWire.positions = closestWire.positions.concat(newWire.positions); 
                  closestWire.connections = closestWire.connections.concat(newWire.connections); 
                  this.circuit.replaceElement(newWire, closestWire);
                  this.circuit.deleteElement(newWire);
                  newWire = null;
                }
              }
              
            }
            break;
        }
        break;

      //Check if the tool is the element deletion.
      case "delete":
        //Get closest element and tell the circuit to delete it.
        var closestElements = [this.getClosestChip(clickPos),
                               this.getClosestInput(clickPos),
                               this.getClosestWire(clickPos)];
        var closestElement = closestElements.filter(x => x[0])
                                            .sort((a, b) => a[1] - b[1])[0];
        console.log(closestElements, closestElement);
        if(closestElement[1] < 10){this.circuit.deleteElement(closestElement[0]);}
        break;

      //Check if the tool is the input tool.
      case "input":
        //Get the closest input and update it.
        var closestInput = this.getClosestInput(clickPos);
        if(closestInput[0] != undefined){closestInput[0].update(clickPos);}
        break;

      //Default case.
      default:
        break;
    }
  }

  ////EVENTS
  var newWireLength;        //Saves the length of the new wire.
  var selfManager = this;   //Saves the manager instance, to be accessed in the events.
  //Add mouse move event to the circuit.
  eventHandler.mousemoveEvents.push(function(event){
    
    var mousePosGrid = gridFixed(mousePos);     //saves the grided mouse position.
    //If the tool selected is the addition tool.
    if(selfManager.tool == "add"){

      //Execute an event depending on the component to add.
      switch(selfManager.getOptionValue("component")){
        //If the compononent is a wire, update the last segment to the mouse position.
        case "wire":
          //Do this whenever the new wire is present.
          if(newWire != null){
            var lastPos = newWire.positions[newWire.positions.length - 1][newWireLength-1];
            var wireVector = Vec3.subVector3(lastPos, mousePosGrid)
            if(Math.abs(wireVector.x) > Math.abs(wireVector.y)){
              newWire.positions[newWire.positions.length - 1][newWireLength] = new Vector3(mousePosGrid.x, lastPos.y, 0);
            }else{
              newWire.positions[newWire.positions.length - 1][newWireLength] = new Vector3(lastPos.x, mousePosGrid.y, 0);
            }
          }
          break;
        //If the compononent is a chip, create a new one every time with its position being the mouse position.
        case "chip":
          //Get parameters for the chip.
          var inputs = selfManager.getOptionValue("inputs");        //Save the number of inputs.
          var outputs = selfManager.getOptionValue("outputs");      //Save the number of outputs.
          var name = selfManager.getOptionValue("name");            //Save the name of the chip.
            
          newChip = new Chip(mousePosGrid, inputs, outputs, name);
          break;
        //If the compononent is an input, create a new one every time with its position being the mouse position.
        case "input":
          //Get parameters for the input.
          var tag = selfManager.getOptionValue("tagName");          //Save the tag of the input.
          var inputWidth = selfManager.getOptionValue("width");     //Save the width of the input.

          newInput = new Input(mousePosGrid, inputWidth, tag);
          break;
        //If the compononent is an output, create a new one every time with its position being the mouse position.
        case "output":
          //Get parameters for the output.
          var tag = selfManager.getOptionValue("tagName");            //Save the tag of the output.
          var outputWidth = selfManager.getOptionValue("width");      //Save the width of the output.

          newOutput = new Output(mousePosGrid, outputWidth, tag);
          break;
      }
    }

    //If the tool is not the adding tool, reset the auxiliar components.
    if(selfManager.tool != "add"){
      if(newWire != null){newWire = null;}
      if(newChip != null){newChip = null;}
      if(newInput != null){newInput = null;}
      if(newOutput != null){newOutput = null;}
    //If not, reset only the components not selected.
    }else{
      if(newWire != null && selfManager.getOptionValue("component") != "wire"){newWire = null;}
      if(newChip != null && selfManager.getOptionValue("component") != "chip"){newChip = null;}
      if(newInput != null && selfManager.getOptionValue("component") != "input"){newInput = null;}
      if(newOutput != null && selfManager.getOptionValue("component") != "output"){newOutput = null;}
    }
  });

  //Add mouse down event to the circuit.
  eventHandler.mousedownEvents.push(function(event){
    //Parse the position into a grid and call the interact method.
    var clickPosGrid = gridFixed(clickPos);           //Saves the grided position of the click.
    selfManager.interactCircuit(clickPosGrid);
  });
}

export {Manager};

