import { Chip } from "./Chip.js";
import { Wire } from "./Wire.js";
import { Output } from "./Output.js";
import { Input } from "./Input.js";
import { Circuit } from "./Circuit.js";

import { eventHandler, circuit, manager, cameraZoom, cameraPos, setCameraPos, setCameraZoom } from "../../Main.js";

import { mousePos, clickPos, mousePressed, endClickPos, startClickPos } from "../../utils/Events.js";
import { keyboard } from "../../utils/Keyboard.js";
import { Vec3, Vector3 } from "../../utils/Vector3.js";
import { distanceToSegment, gridFixed } from "../../utils/Utiles.js";


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
  this.toolOptions = "component: chip; inputs: 2; outputs: 1; name: AND; value: 0; width: 1; inTag: I1; outTag: O1;";     //Saves the options for the tools.
  
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
    return targetWire;
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

  //Method to get the closest output given a position.
  /*This method takes as output a position and returns the closest output if exists*/
  this.getClosestOutput = function(clickPos){
    if(this.circuit.outputs.length == 0){return [undefined, undefined];}
    return this.circuit.outputs.map((output) => [output, (Math.abs(output.position.y-clickPos.y) <= 5 && 
                                                          Math.abs(output.position.x-clickPos.x+output.width*5+5) <= output.width*5)?
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
    var pins = [];
    this.circuit.chips.forEach(chip => chip.inputs.forEach(input => pins.push([input, Vec3.addVector3(input.position, chip.position)])));
    this.circuit.chips.forEach(chip => chip.outputs.forEach(output => pins.push([output, Vec3.addVector3(output.position, chip.position)])));
    this.circuit.inputs.forEach(input => pins.push([input.output, Vec3.addVector3(input.output.position, input.position)]));
    this.circuit.outputs.forEach(output => pins.push([output.input, Vec3.addVector3(output.input.position, output.position)]));
    console.log(pins);
    if(pins.length == 0){return [undefined, undefined];}
    return pins.map((pin) => [pin[0], Vec3.subVector3(pin[1], clickPos).modulo()])
               .sort((a, b) => a[1] - b[1])[0];
  }

  //Method to get a certian option from the tool options.
  /*This methos takes as input the name of one tool parameter and returns its value*/
  this.getOptionValue = function(optionName){
    var indexOption = this.toolOptions.search(optionName);
    var indexEnd = this.toolOptions.indexOf(";", indexOption);
    return this.toolOptions.substring(indexOption + optionName.length + 1, indexEnd).trim();
  }

  //Method to change a certian option from the tool options.
  /*This methos takes as input the name of one tool parameter and its value to change*/
  this.setOptionValue = function(optionName, value){
    var indexOption = this.toolOptions.search(optionName);
    var indexEnd = this.toolOptions.indexOf(";", indexOption);
    this.toolOptions = this.toolOptions.substring(0, indexOption + optionName.length + 1).trim() + value +
                       this.toolOptions.substring(indexEnd, this.toolOptions.length).trim();
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

  ////CIRCUIT SAVING AND LOADING
  //Method to load a circuit from a binary.
  /*This method will receive a binary and will load the circuit and replace the actual with it*/
  this.loadCircuit = function(event){
    var fileToLoad = event.target.files;    //Saves the file to be loaded.  
    var fileReader = new FileReader();      //Saves the file reader.

    fileReader.onload = function() {
      var binaryData = this.result;         //Saves the content of the file.
      var newCircuit = (new Circuit()).binToObject(binaryData);
      newCircuit.canvasElement = manager.circuit.canvasElement;
      newCircuit.canvasContext = manager.circuit.canvasContext;
      manager.circuit = newCircuit;
      circuit = newCircuit;
    }

    fileReader.readAsText(fileToLoad[0]);
  }

  //Method to download a circuit.
  /*This method will download the circuit in a file*/
  this.downloadCircuit = function(){
    //Get the circuit parsed as binary.
    var binaryData = this.circuit.toBin();
    var fileToSave;                           //Saves the file object to download.
    var dataToSave = [binaryData];            //saves the data that goes into the file
    var filename = document.getElementById("textCircuitName").value + ".txt";  //Saves the name of the file to be saved.
    console.log(filename);

    //Add the data and properties to the file.
    var propertiesOfFile = {type: 'text/plain'}; 
    try{ fileToSave = new File(dataToSave, filename, propertiesOfFile); } 
    catch(e){ fileToSave = new Blob(dataToSave, propertiesOfFile); }

    //Create url to download the file.
    var url = URL.createObjectURL(fileToSave);
    document.getElementById('saveFileOffline').download = filename;
    document.getElementById('saveFileOffline').href = url;
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

    var clickPosGrid = gridFixed(clickPos);           //Saves the grided position of the click.
    //Do something depending on the tool selected.
    switch(this.tool){
      //Check if the tool is the element addition.
      case "add":

        //Add the element depending on its type.
        switch(this.getOptionValue("component")){
          //Add element when it is a chip.
          case "chip":

            //Get parameters for the chip.
            var inputs = parseInt(this.getOptionValue("inputs"));               //Saves the number of inputs of the chip.
            var outputs = parseInt(this.getOptionValue("outputs"));             //Saves the number of outputs of the chip.
            var name = this.getOptionValue("name");                   //Saves the name of the chip.
            var width = parseInt(this.getOptionValue("width"));                 //Saves the width of the chip.
            
            //Add the chip to the circuit.
            newChip = new Chip(clickPosGrid, inputs, outputs, name, width);
            this.circuit.addElement(newChip);
            newChip = null;
            break;

          //Add element when it is an input.
          case "input":

            //Get parameters for the input.
            var tag = this.getOptionValue("inTag");                   //Saves the tag of the input.
            var inputWidth = parseInt(this.getOptionValue("width"));    //Saves the width of the input.

            //add the input to the circuit.
            newInput = new Input(clickPosGrid, inputWidth, tag);
            this.circuit.addElement(newInput);
            newInput = null;
            break;
          
          //Add element when it is an output.
          case "output":

            //Get parameters for the output.
            var tag = this.getOptionValue("outTag");                     //Saves the tag of the output.
            var outputWidth = parseInt(this.getOptionValue("width"));     //Saves the width of the output.
            console.log(this.toolOptions, tag);

            //add the output to the circuit.
            newOutput = new Output(clickPosGrid, outputWidth, tag);
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
              newWire = new Wire([[clickPosGrid]], wireWidth);
              newWireLength = newWire.positions[newWire.positions.length - 1].length;

              //Checks for a connection between the wire and the closest pin.
              var closestPin;
              closestPin = this.getClosestPin(clickPosGrid);
              console.log(closestPin);
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
                closestWire = this.getClosestWire(clickPosGrid, newWire);
                if(closestWire[1] < 5){
                  //Check compatibility of bus size.
                  if(closestWire[0].width == wireWidth){
                    newWire = this.connectWireToWire(newWire, closestWire[0]);
                    connectedToWire = 1;
                    console.log(connectedToWire)
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
              closestPin = this.getClosestPin(clickPosGrid);
              if(closestPin[1] < 5 && closestPin[0].width == newWire.width){
                this.connectWireToPin(newWire, closestPin[0]); newWire = null;
              }
              
              //Get the closest input and connect to it if compatible.
              var closestInput;
              closestInput = this.getClosestInput(clickPosGrid);
              if(closestInput[1] < 5 && closestPin[0].width == newWire.width){
                this.connectWireToInput(newWire, closestInput[0]); newWire = null;
              }

              //Get the closest wire and connect to it if compatible.
              var closestWire;
              closestWire = this.getClosestWire(clickPosGrid, newWire);
              console.log(closestWire, newWire);
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
                               this.getClosestOutput(clickPos),
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
          var inputs = parseInt(selfManager.getOptionValue("inputs"));        //Save the number of inputs.
          var outputs = parseInt(selfManager.getOptionValue("outputs"));      //Save the number of outputs.
          var name = selfManager.getOptionValue("name");            //Save the name of the chip.
          var width = parseInt(selfManager.getOptionValue("width"));                 //Saves the width of the chip.
            
          newChip = new Chip(mousePosGrid, inputs, outputs, name, width);

          break;
        //If the compononent is an input, create a new one every time with its position being the mouse position.
        case "input":
          //Get parameters for the input.
          var tag = selfManager.getOptionValue("inTag");          //Save the tag of the input.
          var inputWidth = selfManager.getOptionValue("width");     //Save the width of the input.

          newInput = new Input(mousePosGrid, inputWidth, tag);
          break;
        //If the compononent is an output, create a new one every time with its position being the mouse position.
        case "output":
          //Get parameters for the output.
          var tag = selfManager.getOptionValue("outTag");            //Save the tag of the output.
          var outputWidth = selfManager.getOptionValue("width");      //Save the width of the output.

          newOutput = new Output(mousePosGrid, outputWidth, tag);
          break;
      }
    }else if(selfManager.tool == "move"){
      if(mousePressed){
        var draggingVector = Vec3.subVector3(endClickPos, startClickPos);
        setCameraPos(Vec3.subVector3(cameraPos, draggingVector));
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
    selfManager.interactCircuit(clickPos);
  });

  //Add mouse wheel event to the circuit.
  eventHandler.mousewheelEvents.push(function(event){
    //Calculate zoom variation according to wheel scroll.
    var zoomVariation = event.deltaY<0?1.1:1/1.1;
    setCameraZoom(cameraZoom*zoomVariation);
    setCameraPos(Vec3.mulVector3(cameraPos, 1/zoomVariation));
  });
}

export {Manager};

