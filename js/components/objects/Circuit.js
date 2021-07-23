import { Wire } from "../objects/Wire.js";
import { Pin } from "../objects/Pin.js";
import { Chip } from "../objects/Chip.js";
import { Input } from "../objects/Input.js";
import { Output } from "../objects/Output.js";

import { binaryFixedSize, getBitsFromBinary } from "../../utils/Utiles.js";

////OBJECT DECLARATION.
/*This object is used as wrapper for all the components in a circuit, being
able to update and manage all the content.

@PARAMETERS

*canvasElement:   Refers to the canvas for drawing the circuit.

*/
function Circuit(canvasElement){
  ////INTERNAL VARIABLES.
  //Content variables.
  this.wires = [];      //Saves the list of wires of the circuit.
  this.inputs = [];     //Saves the list of inputs of the circuit.
  this.outputs = [];     //Saves the list of outputs of the circuit.
  this.pins = [];       //Saves the list of pins of the circuit.
  this.chips = [];      //Saves the list of chips of the circuit.

  //Drawing variables.
  this.canvasElement = canvasElement;         //Saves the canvas element.
  this.canvasContext;                         //Saves the context of the canvas.
  
  
  if(this.canvasElement != undefined){ 
    this.canvasContext = this.canvasElement.getContext("2d"); 
    this.canvasContext.imageSmoothingEnabled= false;            //Set front canvas context aliasing to false.
  }  

  ////INTERNAL METHODS.
  //Method to delete elements from the circuit.
  /*This method is used for deleting elements from the circuit.*/
  this.deleteElement = function(element){
    switch(Object.getPrototypeOf(element).constructor){
      //Check if the element to delete is a wire.
      case Wire:
        var index;      //Saves the index of the element found.
        
        //Delete the wire from input pins connections if it is an input.
        for(var i = 0; i < this.pins.length; i++){
          if(this.pins[i].connection == element){
            this.pins[i].connection = {value:0};
          }
        }

        //Delete the wire from the wires array.
        index = this.wires.indexOf(element);
        this.wires.splice(index, index != -1);

        break;

      //Check if the element to delete is an input.
      case Input:
        var index;      //Saves the index of the element found.

        //Delete the output pin.
        this.deleteElement(element.output);

        //Delete the input from the inputs array.
        index = this.inputs.indexOf(element);
        this.inputs.splice(index, index != -1);

        break;

      //Check if the element to delete is an output.
      case Output:
        var index;      //Saves the index of the element found.
    
        //Delete the input pin.
        this.deleteElement(element.input);

        //Delete the output from the outputs array.
        index = this.outputs.indexOf(element);
        this.outputs.splice(index, index != -1);

        break;
      
      //Check if the element to delete is a pin.
      case Pin:
        var index;      //Saves the index of the element found.
    
        //Delete the pin from wire connections if it is an output.
        if(element.type == "out"){
          for(var i = 0; i < this.wires.length; i++){
            index = this.wires[i].connections.indexOf(element);
            this.wires[i].connections.splice(index, index != -1);
          }
        }

        //Delete the pin from the pins array.
        index = this.pins.indexOf(element);
        this.pins.splice(index, index != -1);
    
        break;

      //Check if the element to delete is a chip.
      case Chip:
        //Delete the input pins.
        for(var i = 0; i < element.inputs.length; i++){
          this.deleteElement(element.inputs[i]);
        }
        //Delete the output pins.
        for(var i = 0; i < element.outputs.length; i++){
          this.deleteElement(element.outputs[i]);
        }
        var index;      //Saves the index of the element found.
        
        //Delete the chip from the chips array.
        index = this.chips.indexOf(element);
        this.chips.splice(index, index != -1);
        break;
    }
  }

  //Method to add elements to the circuit.
  /*This method is used for adding new elements to the circuit.*/
  this.addElement = function(element){
    switch(Object.getPrototypeOf(element).constructor){
      //Check if the element to add is a wire.
      case Wire: 
        this.wires.push(element); 
        break;
      //Check if the element to add is an input.
      case Input: 
        this.inputs.push(element); 
        this.pins.push(element.output);
        break;
      //Check if the element to add is a output.
      case Output: 
        this.outputs.push(element); 
        this.pins.push(element.input);
        break;
      //Check if the element to add is a pin.
      case Pin: 
        this.pins.push(element); 
        break;
      //Check if the element to add is a chip.
      case Chip: 
        this.chips.push(element);
        for(var i = 0; i < element.inputs.length; i++){
          this.addElement(element.inputs[i]);
        }
        for(var i = 0; i < element.outputs.length; i++){
          this.addElement(element.outputs[i]);
        }
        break;
    }
  }

  //Method to replace elements to the circuit.
  /*This method is used for replacing new elements into the circuit.*/
  this.replaceElement = function(element, newElement){
    switch(Object.getPrototypeOf(element).constructor){
      //Check if the element to replace is a wire.
      case Wire: 
        for(var i = 0; i < this.pins.length; i++){
          if(this.pins[i].connection == element){
            this.pins[i].connection = newElement;
          }
        }
        break;
    }
  }

  //Drawing method for the circuit.
  /*This method is used for drawing the circuit.*/
  this.draw = function(){
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    for(var wire of this.wires){wire.draw(this.canvasContext);}         //Draw all the wires.
    for(var input of this.inputs){input.draw(this.canvasContext);}      //Draw all the inputs.
    for(var output of this.outputs){output.draw(this.canvasContext);}   //Draw all the outputs.
    for(var chip of this.chips){chip.draw(this.canvasContext);}         //Draw all the chips.
  }

  //Update method for the circuit.
  /*This method is used for updating the state of the circuit.*/
  this.update = function(){
    this.wires.map((val) => val.update());        //Update all the wires.
    // this.inputs.map((val) => val.update());    //Updated by the user.
    this.chips.map((val) => val.update());        //Update all the chips.
  }

  //Method to move the position of the circuit.
  /*This method is used to move the position of the circuit.*/
  this.move = function(movementVector){
    for(var wire of this.wires){wire.move(movementVector);}         //Move all the wires.
    for(var input of this.inputs){input.move(movementVector);}      //Move all the inputs.
    for(var output of this.outputs){output.move(movementVector);}   //Move all the outputs.
    for(var chip of this.chips){chip.move(movementVector);}         //Move all the chips.
  }

  //Parse to bin method for the circuit.
  /*This method is used to encode the circuit in binary.*/
  this.toBin = function(){
    ///Parse to binary all the elements of the circuit.
    //Parse to binary all the wires.
    var binary = binaryFixedSize(this.wires.length, 12);
    for(var i = 0; i < this.wires.length; i++){
      binary += this.wires[i].toBin(this.pins);
    }
    
    //Parse to binary all the pins.
    binary += binaryFixedSize(this.pins.length, 12);
    for(var i = 0; i < this.pins.length; i++){
      binary += this.pins[i].toBin(this.wires);
    }

    //Parse to binary all the inputs.
    binary += binaryFixedSize(this.inputs.length, 12);
    for(var i = 0; i < this.inputs.length; i++){
      binary += this.inputs[i].toBin(this.pins);
    }

    //Parse to binary all the outputs.
    binary += binaryFixedSize(this.outputs.length, 12);
    for(var i = 0; i < this.outputs.length; i++){
      binary += this.outputs[i].toBin(this.pins);
    }

    //Parse to binary all the chips.
    binary += binaryFixedSize(this.chips.length, 12);
    for(var i = 0; i < this.chips.length; i++){
      binary += this.chips[i].toBin(this.pins);
    }

    return binary;
  }

  //Parse bin to object method for the circuit.
  /*This method is used to decode the circuit from binary.*/
  this.binToObject = function(binary){

    var wires = [];             //Saves the wires of the circuit.
    var pins = [];              //Saves the pins of the circuit.
    var inputs = [];            //Saves the inputs of the circuit.  
    var outputs = [];           //Saves the outputs of the circuit.
    var chips = [];             //Saves the chips of the circuit.

    var pointer = {value: 0};   //Saves a pointer to the binary.

    ///Decode all the elements of the circuit from the binary.
    //Decodes the wires of the circuit from the binary.
    var wiresLength = parseInt(getBitsFromBinary(binary, pointer, 12), 2);
    for(var i = 0; i < wiresLength; i++){
      wires.push((new Wire()).binToObject(binary, pointer));
    }
    
    //Decodes the pins of the circuit from the binary.
    var pinsLength = parseInt(getBitsFromBinary(binary, pointer, 12), 2);
    for(var i = 0; i < pinsLength; i++){
      pins.push((new Pin()).binToObject(binary, pointer));
    }
    
    //Decodes the inputs of the circuit from the binary.
    var inputsLength = parseInt(getBitsFromBinary(binary, pointer, 12), 2);
    for(var i = 0; i < inputsLength; i++){
      inputs.push((new Input()).binToObject(binary, pointer));
    }
    
    //Decodes the outputs of the circuit from the binary.
    var outputsLength = parseInt(getBitsFromBinary(binary, pointer, 12), 2);
    for(var i = 0; i < outputsLength; i++){
      outputs.push((new Output()).binToObject(binary, pointer));
    }
    
    //Decodes the chips of the circuit from the binary.
    var chipsLength = parseInt(getBitsFromBinary(binary, pointer, 12), 2);
    for(var i = 0; i < chipsLength; i++){
      chips.push((new Chip()).binToObject(binary, pointer));
    }
    
    //Creates the new circuit.
    var circuit = new Circuit();
    circuit.wires = wires;
    circuit.pins = pins;
    circuit.inputs = inputs;
    circuit.outputs = outputs;
    circuit.chips = chips;

    ///Loop through all the components of the circuit to adjust the references.
    //Loop through all the wires and adjust references.
    for(var i = 0; i < circuit.wires.length; i++){
      for(var e = 0; e < circuit.wires[i].connections.length; e++){
        circuit.wires[i].connections[e] = circuit.pins[circuit.wires[i].connections[e]];
      }
    }

    //Loop through all the input pins and adjust references.
    for(var i = 0; i < circuit.pins.length; i++){
      if(circuit.pins[i].connection.value == undefined){
        circuit.pins[i].connection = circuit.wires[circuit.pins[i].connection];
      }
    }

    //Loop through all the inputs and adjust references.
    for(var i = 0; i < circuit.inputs.length; i++){
      var input = new Input(circuit.inputs[i].position, circuit.inputs[i].width, circuit.inputs[i].tag);
      circuit.inputs[i].output = circuit.pins[circuit.inputs[i].output];
      circuit.inputs[i].output.position = input.output.position;
    }

    //Loop through all the outputs and adjust references.
    for(var i = 0; i < circuit.outputs.length; i++){
      var output = new Output(circuit.outputs[i].position, circuit.outputs[i].width, circuit.outputs[i].tag);
      circuit.outputs[i].input = circuit.pins[circuit.outputs[i].input];
      circuit.outputs[i].input.position = output.input.position;
    }

    //Loop through all the chips and adjust references.
    for(var i = 0; i < circuit.chips.length; i++){
      var chip;
      var width = Math.max(circuit.chips[i].inputs.length, circuit.chips[i].outputs.length);
      if(circuit.chips[i].name == "MUX"){
        chip = new Chip(circuit.chips[i].position, Math.floor(Math.log2(circuit.chips[i].inputs.length)), 
                      circuit.chips[i].outputs.length, circuit.chips[i].name, width);
      }else if(circuit.chips[i].name == "DEMUX"){
        chip = new Chip(circuit.chips[i].position, circuit.chips[i].inputs.length - 1, 
                      circuit.chips[i].outputs.length, circuit.chips[i].name, width);
      }else{
        chip = new Chip(circuit.chips[i].position, circuit.chips[i].inputs.length, 
                      circuit.chips[i].outputs.length, circuit.chips[i].name, width);
      }
      circuit.chips[i].inputs = circuit.chips[i].inputs.map((el) => circuit.pins[el]);
      circuit.chips[i].outputs = circuit.chips[i].outputs.map((el) => circuit.pins[el]);
      circuit.chips[i].inputs.forEach((el, index) => {el.position = chip.inputs[index].position;
                                                      el.tag = chip.inputs[index].tag;
                                                      el.tagPosition = chip.inputs[index].tagPosition;});
      circuit.chips[i].outputs.forEach((el, index) => {el.position = chip.outputs[index].position;
                                                       el.tag = chip.outputs[index].tag;
                                                       el.tagPosition = chip.outputs[index].tagPosition;});
      }

    return circuit;
  }
}

export {Circuit};