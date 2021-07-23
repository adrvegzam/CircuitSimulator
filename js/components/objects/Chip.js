import { chipStructure } from "../chipStructure.js";
import { chipDrawing } from "../chipDrawing.js";
import { chipLogic } from "../chipLogic.js";

import { binaryFixedSize, binaryFromString, getBitsFromBinary, stringFromBinary } from "../../utils/Utiles.js";
import { Vector3 } from "../../utils/Vector3.js";

////OBJECT DECLARATION.
/*This object is used as to process the data linked to its input and output
pins in different ways. The ways are defined by the number of functions it 
can execute (NOR, OR, NAND, AND, XOR, XNOR, NOT...). The function executed
will be the same as the name parameter.

@PARAMETERS

*position:    Refers to the position of the chip.
*inputs:      Refers to the array of input pins.
*outputs:     Refers to the array of output pins.
*name:        Refers to the type of the chip.

*/
function Chip(position, inputs, outputs, name, width){
  ////INTERNAL VARIABLES.
  //Variables related to chip geometry.
  this.position = position;           //Saves the position of the chip.
  this.contour = [];                  //Saves the contour of the chip case.
  this.width;                         //Saves the width of the chip.
  this.height;                        //Saves the height of the chip.

  //Variables related to chip logic.
  this.name = name;                   //Saves the type of the chip.
  this.inputs = [];                   //Saves the input pins of the chip.
  this.outputs = [];                  //Saves the output pins of the chip.

  ////INTERNAL METHODS.
  //Drawing method for the chip.
  /*This method is used for drawing the chip.*/
  this.draw = function(context){}

  //Update method for the chip.
  /*This method is used for updating the chip.*/
  this.update = function(){}

  //Construct method for the chip.
  /*This method is used for constructing the chip.*/
  this.construct = function(chip){}

  //Method to move the position of the chip.
  /*This method is used to move the position of the chip.*/
  this.move = function(movementVector){
    this.position.add(movementVector);
    for(var i = 0; i < this.contour.length; i++){
      this.contour[i].add(movementVector);
    }
    for(var i = 0; i < this.inputs.length; i++){
      this.inputs[i].move(movementVector);
    }
    for(var i = 0; i < this.outputs.length; i++){
      this.outputs[i].move(movementVector);
    }
  }

  //Parse to bin method for the chip.
  /*This method is used to encode the chip in binary.*/
  this.toBin = function(pins){
    var binary =  binaryFixedSize(this.name.length, 5) + 
                  binaryFromString(this.name) + 
                  binaryFixedSize(this.position.x + 2**11, 12) + 
                  binaryFixedSize(this.position.y + 2**11, 12);

    binary += binaryFixedSize(this.inputs.length, 4);
    for(var i = 0; i < this.inputs.length; i++){
      binary += binaryFixedSize(pins.indexOf(this.inputs[i]), 12);
    }
    binary += binaryFixedSize(this.outputs.length, 4);
    for(var i = 0; i < this.outputs.length; i++){
      binary += binaryFixedSize(pins.indexOf(this.outputs[i]), 12);
    }
    return binary;
  }

  //Parse bin to object method for the chip.
  /*This method is used to decode the chip from binary.*/
  this.binToObject = function(binary, pointer){
    //Parse to binary some properties.
    var nameLength = parseInt(getBitsFromBinary(binary, pointer, 5), 2);
    var name = stringFromBinary(getBitsFromBinary(binary, pointer, nameLength*8));
    var position = new Vector3(parseInt(getBitsFromBinary(binary, pointer, 12), 2) - 2**11,
                               parseInt(getBitsFromBinary(binary, pointer, 12), 2) - 2**11);
    
    //Parse to binary the inputs.
    var inputs = [];
    var inputsLength = parseInt(getBitsFromBinary(binary, pointer, 4), 2);
    for(var i = 0; i < inputsLength; i++){
      inputs.push(parseInt(getBitsFromBinary(binary, pointer, 12), 2));
    }
    
    //Parse to binary the outputs.
    var outputs = [];
    var outputsLength = parseInt(getBitsFromBinary(binary, pointer, 4), 2);
    for(var i = 0; i < outputsLength; i++){
      outputs.push(parseInt(getBitsFromBinary(binary, pointer, 12), 2));
    }
    
    //Create the chip and return it.
    var chip;
    var width = Math.max(inputs.length, outputs.length);
    if(name == "MUX"){chip = new Chip(position, Math.floor(Math.log2(inputs.length)), outputs.length, name, width);}
    else if(name == "DEMUX"){chip = new Chip(position, inputs.length - 1, outputs.length, name, width);}
    else{chip = new Chip(position, inputs.length, outputs.length, name, width);}
    
    chip.inputs = inputs;
    chip.outputs = outputs;

    return chip;
  }

  ////CONSTRUCTOR CODE.
  //Determine the number of inputs or outputs and the internal function.
  switch (name) {
    //Adapts the internal methods to the NOR gate.
    case "NOR": 
      inputs = inputs; outputs = 1;        
      this.update = eval("chipLogic." + name);             
      this.draw = chipDrawing.drawGenericChip;                 
      this.construct = chipStructure.constructGate;        
      break;
    //Adapts the internal methods to the NAND gate.
    case "NAND": 
      inputs = inputs; outputs = 1;                            
      this.update = eval("chipLogic." + name);                   
      this.draw = chipDrawing.drawGenericChip;                         
      this.construct = chipStructure.constructGate;                   
      break;
    //Adapts the internal methods to the OR gate.
    case "OR": 
      inputs = inputs; outputs = 1;           
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructGate; 
      break;
    //Adapts the internal methods to the AND gate.
    case "AND": 
      inputs = inputs; outputs = 1; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructGate;
      break;
    //Adapts the internal methods to the XOR gate.
    case "XOR": 
      inputs = inputs; outputs = 1; 
      this.update = eval("chipLogic." + name);
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructGate; 
      break;
    //Adapts the internal methods to the XNOR gate.
    case "XNOR": 
      inputs = inputs; outputs = 1; 
      this.update = eval("chipLogic." + name);
      this.draw = chipDrawing.drawGenericChip;
      this.construct = chipStructure.constructGate; 
      break;
    //Adapts the internal methods to the NOT gate.
    case "NOT": 
      inputs = 1; outputs = 1; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructGate; 
      break;
    //Adapts the internal methods to the BUF gate.
    case "BUF": 
      inputs = 1; outputs = 1; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructGate; 
      break;
    //Adapts the internal methods to the HA chip.
    case "HA": 
      inputs = 2; outputs = 2; 
      this.update = eval("chipLogic." + name);
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructHA; 
      break;
    //Adapts the internal methods to the FA chip.
    case "FA": 
      inputs = 3; outputs = 2; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructFA; 
      break;
    //Adapts the internal methods to the DEC chip.
    case "DEC": 
      inputs = inputs; outputs = 2**inputs; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructGate; 
      break;
    //Adapts the internal methods to the MUX chip.
    case "MUX": 
      inputs = inputs + 2**inputs; outputs = 1; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructMUX; 
      break;
    //Adapts the internal methods to the DEMUX chip.
    case "DEMUX": 
      inputs = inputs + 1; outputs = 2**(inputs - 1); 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructDEMUX; 
      break;
    //Adapts the internal methods to the REGRW chip.
    case "REGRW": 
      inputs = 4; outputs = 2; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructREGRW; 
      break;
    //Adapts the internal methods to the REGW chip.
    case "REGW": 
      inputs = 3; outputs = 2; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructREGW; 
      break;
    //Adapts the internal methods to the DLATCH chip.
    case "DLATCH": 
      inputs = 2; outputs = 2; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructDLATCH; 
      break;
    //Adapts the internal methods to the SRLATCH chip.
    case "SRLATCH": 
      inputs = 3; outputs = 2; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawGenericChip; 
      this.construct = chipStructure.constructSRLATCH; 
      break;
    //Adapts the internal methods to the SPLITTER chip.
    case "SPLITTER": 
      inputs = 1; outputs = width; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawBusChip; 
      this.construct = chipStructure.constructSPLITTER; 
      break;
    //Adapts the internal methods to the JOINER chip.
    case "JOINER": 
      inputs = width; outputs = 1; 
      this.update = eval("chipLogic." + name); 
      this.draw = chipDrawing.drawBusChip; 
      this.construct = chipStructure.constructJOINER; 
      break;
    default: break;
  }

  this.construct(inputs, outputs, width);
}

export {Chip};