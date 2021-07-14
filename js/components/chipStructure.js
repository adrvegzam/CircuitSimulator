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
      var relativeTagPos = new Vector3(15, 0, 0); 
      inputsList.push(new Pin(Vec3.addVector3(relativePinPos, chip.position), 1, 0, "I" + (i + 1), relativeTagPos, "in"));
    }
    return inputsList;
  },
  //Method to generate procedurally the outputs of the chip, given the number an the chip itself.
  generateOutputPins: function(chip, outputs){
    var outputsList = [];
    for(var i = 0; i < parseInt(outputs); i++){
      var relativePinPos = new Vector3(chip.width, -i*(pinParams.pinRadius + chipParams.chipPinsSpacing)*2 + 
                                    (outputs-1)*(pinParams.pinRadius + chipParams.chipPinsSpacing), 0);
      var relativeTagPos = new Vector3(-15, 0, 0); 
      outputsList.push(new Pin(Vec3.addVector3(relativePinPos, chip.position), 1, 0, "O" + (i + 1), relativeTagPos, "out"));
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

  }
 
}

export {chipStructure};