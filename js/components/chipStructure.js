import { Pin } from "./objects/Pin.js";

import { pinParams } from "./parameters/pinParams.js";
import { chipParams } from "./parameters/chipParams.js";

import { Vec3, Vector3 } from "../utils/Vector3.js";
import { smoothContour } from "../utils/Utiles.js";


////AUXILIAR METHODS
const chipAuxStructure = {
  
  //Method to calculate the height of the chip from its inputs and outputs.
  calcHeight: function(inputs, outputs){
    if(inputs > outputs){return 2 + (pinParams.pinRadius + chipParams.chipPinsSpacing)*inputs;}
    else{return 2 + (pinParams.pinRadius + chipParams.chipPinsSpacing)*outputs;}
  },
  //Method to generate procedurally the inputs of the chip, given the number an the chip itself.
  generateInputPins: function(chip, inputs){
    var inputsList = [];
    for(var i = 0; i < parseInt(inputs); i++){
      var relativePinPos = new Vector3(-chip.width, -i*(pinParams.pinRadius + chipParams.chipPinsSpacing)*2 + 
                                    (inputs-1)*(pinParams.pinRadius + chipParams.chipPinsSpacing), 0);
      var relativeTagPos = new Vector3(15, -1, 0); 
      inputsList.push(new Pin(relativePinPos, 1, 0, "I" + (i + 1), relativeTagPos, "in"));
    }
    return inputsList;
  },
  //Method to generate procedurally the outputs of the chip, given the number an the chip itself.
  generateOutputPins: function(chip, outputs){
    var outputsList = [];
    for(var i = 0; i < parseInt(outputs); i++){
      var relativePinPos = new Vector3(chip.width, -i*(pinParams.pinRadius + chipParams.chipPinsSpacing)*2 + 
                                    (outputs-1)*(pinParams.pinRadius + chipParams.chipPinsSpacing), 0);
      var relativeTagPos = new Vector3(-15, -1, 0); 
      outputsList.push(new Pin(relativePinPos, 1, 0, "O" + (i + 1), relativeTagPos, "out"));
    }
    return outputsList;
  },
  //Method to generate procedurally the contour of the chip.
  generateContour: function(chip){
    var vertices = [[-chip.width+chipParams.chipRadius, -chip.height+chipParams.chipRadius],
                    [chip.width-chipParams.chipRadius,  -chip.height+chipParams.chipRadius],
                    [chip.width-chipParams.chipRadius,   chip.height-chipParams.chipRadius],
                    [-chip.width+chipParams.chipRadius,  chip.height-chipParams.chipRadius]];
    return smoothContour(vertices, chip.position, chipParams.chipRadius, chipParams.chipBorderResolution);
  },
  //Method to generate procedurally the lines of the chip.
  generateLines: function(chip, type){
    if(type == "splitter"){
      var lines = [[Vec3.addVector3(chip.inputs[0].position, chip.position), chip.position]];
      for(var i = 0; i < chip.outputs.length; i++){
        var despHorizontal = Math.round(Math.abs(chip.outputs.length/2 - i - 0.5));
        despHorizontal = chip.outputs.length % 2 == 0?despHorizontal-1:despHorizontal;
        var movedChipPosition = Vec3.subVector3(chip.position, new Vector3(despHorizontal*5, 0, 0));
        lines.push([movedChipPosition, new Vector3(movedChipPosition.x, chip.outputs[i].position.y + movedChipPosition.y),
                    Vec3.addVector3(chip.outputs[i].position, chip.position)]);
      }
      return lines;
    }else if(type == "joiner"){
      var lines = [[Vec3.addVector3(chip.outputs[0].position, chip.position), chip.position]];
      for(var i = 0; i < chip.inputs.length; i++){
        var despHorizontal = Math.round(Math.abs(chip.inputs.length/2 - i - 0.5)) - 1;
        despHorizontal = chip.inputs.length % 2 == 0?despHorizontal:despHorizontal+1;
        var movedChipPosition = Vec3.subVector3(chip.position, new Vector3(-despHorizontal*5, 0, 0));
        lines.push([movedChipPosition, new Vector3(movedChipPosition.x, chip.inputs[i].position.y + movedChipPosition.y),
                    Vec3.addVector3(chip.inputs[i].position, chip.position)]);
      }
      return lines;
    }
  },
  //Method to create the generic base of the chip.
  generateGenericChip: function(chip, inputs, outputs){
    //Procedurally generating width and height of chip.
    chip.width = 40;
    chip.height = chipAuxStructure.calcHeight(inputs, outputs);
  
    ///Generate the necessary input and output pins.
    //Generate the input pins.
    chip.inputs = chipAuxStructure.generateInputPins(chip, inputs);
    //Generate the output pins.
    chip.outputs = chipAuxStructure.generateOutputPins(chip, outputs);

    //Procedurally generating chip case contour.
    chip.contour = chipAuxStructure.generateContour(chip);
  },
  //Method to create a splitter structure of the chip.
  generateSplitter: function(chip, inputs, outputs){
    //Procedurally generating width and height of splitter.
    chip.width = 30;
    chip.height = chipAuxStructure.calcHeight(inputs, outputs);

    ///Generate the necessary input and output pins.
    //Generate the input pins.
    chip.inputs = chipAuxStructure.generateInputPins(chip, inputs);
    //Generate the output pins.
    chip.outputs = chipAuxStructure.generateOutputPins(chip, outputs);

    //Procedurally generating splitter lines.
    chip.lines = chipAuxStructure.generateLines(chip, "splitter");
  },
  //Method to create a joiner structure of the chip.
  generateJoiner: function(chip, inputs, outputs){
    //Procedurally generating width and height of joiner.
    chip.width = 30;
    chip.height = chipAuxStructure.calcHeight(inputs, outputs);

    ///Generate the necessary input and output pins.
    //Generate the input pins.
    chip.inputs = chipAuxStructure.generateInputPins(chip, inputs);
    //Generate the output pins.
    chip.outputs = chipAuxStructure.generateOutputPins(chip, outputs);

    //Procedurally generating splitter lines.
    chip.lines = chipAuxStructure.generateLines(chip, "joiner");
  }
}

////EXTERNAL CONSTRUCTORS
const chipStructure = {
  //Constructor method for a gate used in AND, NAND, OR, NOR, XOR, NXOR, BUF, NOT.
  /*This method constructs a gate*/
  constructGate: function(inputs, outputs){
    //Procedurally generating the whole chip.
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
  }, 

  //Constructor method for a gate used in HA.
  /*This method constructs a HA*/ 
  constructHA: function(inputs, outputs){

    //Procedurally generating the whole chip.
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
    //Rename inputs.
    this.inputs[0].tag = "A";
    this.inputs[1].tag = "B";
    //Rename outputs.
    this.outputs[0].tag = "S";
    this.outputs[1].tag = "Cout";

  },

  //Constructor method for a gate used in FA.
  /*This method constructs a FA*/ 
  constructFA: function(inputs, outputs){

    //Procedurally generating the whole chip.
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
    //Rename inputs.
    this.inputs[0].tag = "A";
    this.inputs[1].tag = "B";
    this.inputs[2].tag = "Cin";
    //Rename outputs.
    this.outputs[0].tag = "S";
    this.outputs[1].tag = "Cout";

  },

  //Constructor method for a gate used in SPLITTER.
  /*This method constructs a SPLITTER*/ 
  constructSPLITTER: function(inputs, outputs, width){

    //Procedurally generating the whole chip.
    chipAuxStructure.generateSplitter(this, inputs, outputs);
    //Change width of the input.
    this.inputs[0].width = width;
  },

  //Constructor method for a gate used in SPLITTER.
  /*This method constructs a SPLITTER*/ 
  constructJOINER: function(inputs, outputs, width){

    //Procedurally generating the whole chip.
    chipAuxStructure.generateJoiner(this, inputs, outputs);
    //Change width of the input.
    this.outputs[0].width = width;
    
  },

  //Constructor method for a gate used in MUX.
  /*This method constructs a MUX*/ 
  constructMUX: function(inputs, outputs, width){

    var muxSize = Math.floor(Math.log2(inputs)); 
    //Procedurally generating the whole chip.
    console.log(muxSize, inputs);
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
    //Rename inputs.
    for(var i = 0; i < muxSize; i++){this.inputs[i].tag = "S" + i;}
    for(var i = muxSize; i < inputs; i++){this.inputs[i].tag = "I" + (i - muxSize);}
    //Change width of the input.
    for(var i = muxSize; i < inputs; i++){this.inputs[i].width = width;}
    //Change width of the output.
    this.outputs[0].width = width;
    
  },

  //Constructor method for a gate used in MUX.
  /*This method constructs a MUX*/ 
  constructDEMUX: function(inputs, outputs, width){

    var demuxSize = inputs - 1; 
    //Procedurally generating the whole chip.
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
    //Rename inputs.
    for(var i = 0; i < demuxSize; i++){this.inputs[i].tag = "S" + i;}
    for(var i = demuxSize; i < inputs; i++){this.inputs[i].tag = "I" + (i - demuxSize);}
    //Change width of the input.
    for(var i = demuxSize; i < inputs; i++){this.inputs[i].width = width;}
    //Change width of the output.
    for(var i = 0; i < outputs; i++){this.outputs[i].width = width;}
    
  },

  //Constructor method for a gate used in REGRW.
  /*This method constructs a REGRW*/ 
  constructREGRW: function(inputs, outputs, width){

    //Add properties.
    this.q = 0;
    //Procedurally generating the whole chip.
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
    //Rename inputs.
    this.inputs[0].tag = "Clk";
    this.inputs[1].tag = "DAT";
    this.inputs[2].tag = "R";
    this.inputs[3].tag = "W";
    //Rename outputs.
    this.outputs[0].tag = "~Q";
    this.outputs[1].tag = "Q";
    //Change width of the input.
    this.inputs[1].width = width;
    //Change width of the output.
    this.outputs[0].width = width;
    this.outputs[1].width = width;

  },

  //Constructor method for a gate used in REGW.
  /*This method constructs a REGW*/ 
  constructREGW: function(inputs, outputs, width){

    //Add properties.
    this.q = 0;
    //Procedurally generating the whole chip.
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
    //Rename inputs.
    this.inputs[0].tag = "Clk";
    this.inputs[1].tag = "DAT";
    this.inputs[2].tag = "W";
    //Rename outputs.
    this.outputs[0].tag = "~Q";
    this.outputs[1].tag = "Q";
    //Change width of the input.
    this.inputs[1].width = width;
    //Change width of the output.
    this.outputs[0].width = width;
    this.outputs[1].width = width;
    
  },
  
  //Constructor method for a gate used in DLATCH.
  /*This method constructs a DLATCH*/ 
  constructDLATCH: function(inputs, outputs){

    //Add properties.
    this.q = 0;
    //Procedurally generating the whole chip.
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
    //Rename inputs.
    this.inputs[0].tag = "Clk";
    this.inputs[1].tag = "DAT";
    //Rename outputs.
    this.outputs[0].tag = "~Q";
    this.outputs[1].tag = "Q";
    
  },

  //Constructor method for a gate used in SRLATCH.
  /*This method constructs a SRLATCH*/ 
  constructSRLATCH: function(inputs, outputs){

    //Add properties.
    this.q = 0;
    //Procedurally generating the whole chip.
    chipAuxStructure.generateGenericChip(this, inputs, outputs);
    //Rename inputs.
    this.inputs[0].tag = "Clk";
    this.inputs[1].tag = "R";
    this.inputs[2].tag = "S";
    //Rename outputs.
    this.outputs[0].tag = "~Q";
    this.outputs[1].tag = "Q";
    
  }
 
}

export {chipStructure};