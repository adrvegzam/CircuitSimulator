import { Pin } from "./Pin.js";

import { outputParams } from "../parameters/outputParams.js";

import { Vector3, Vec3 } from "../../utils/Vector3.js";
import { smoothContour, binaryFixedSize, binaryFromString, getBitsFromBinary, stringFromBinary, spaceToPosition } from "../../utils/Utiles.js";
import { appScreen, cameraPos, cameraZoom } from "../../Main.js";

////OBJECT DECLARATION.
/*This object is used to allow the user to make outputs to the circuit
through a kind of button that when a wired switches between the states
ON and OFF, the output changes its state.

@PARAMETERS

*position:  Refers to the position of the output.
*value:     Refers to the current state of the output.

*/
function Output(position, width, tag){
  ////INTERNAL VARIABLES.
  //Variables for output geometry.
  this.position = position;       //Saves the position of the pin.
  this.width = width;             //Saves the width of the pin.
  this.tag = tag;                 //Saves the tag of the pin.
  this.contour = [[5, -0.5],
                  [5 + this.width*10, -0.5],
                  [5 + this.width*10, 0.5],
                  [5, 0.5]];

  if(this.position != undefined){
    this.contour = smoothContour(this.contour, this.position, outputParams.outputRadius, outputParams.outputBorderResolution);
  }

  //Variables for logic.
  this.input = new Pin(new Vector3(0, 0, 0), this.width, 0, undefined, undefined, "in");                 //Saves the state of the output.

  ////INTERNAL METHODS
  //Drawing method for the output.
  /*This method is used for drawing the output.*/
  this.draw = function(context){
    //Change color of the output depending on its state.
    if(this.value){context.fillStyle = outputParams.outputActiveColor; context.strokeStyle = outputParams.outputActiveBorderColor;}
    else{context.fillStyle = outputParams.outputNonActiveColor; context.strokeStyle = outputParams.outputNonActiveBorderColor;}

    //Draw the case of the output.
    context.fillStyle = outputParams.outputCaseColor;
    context.strokeStyle = outputParams.outputCaseBorderColor;
    context.beginPath();
    var positionParsed = spaceToPosition(this.contour[0]);
    context.moveTo(positionParsed.x,
                   positionParsed.y);

    for(var i = 1; i < this.contour.length; i++){
      positionParsed = spaceToPosition(this.contour[i]);
      context.lineTo(positionParsed.x,
                     positionParsed.y);
    }

    context.fill();
    context.stroke();

    //Draw the touchable values.
    for(var i = 0; i < this.width; i++){
      var bitValue = (this.input.connection.value >> (this.width - i - 1)) % 2;

      if(bitValue){context.fillStyle = outputParams.outputActiveColor;}
      else{context.fillStyle = outputParams.outputNonActiveColor;}

      positionParsed = spaceToPosition(new Vector3(this.position.x + (10*(i+1) - 4), this.position.y - 4))
      context.fillRect(positionParsed.x,
                       positionParsed.y, 
                       8*cameraZoom*window.devicePixelRatio, 
                       8*cameraZoom*window.devicePixelRatio);

      context.strokeRect(positionParsed.x,
                         positionParsed.y, 
                         8*cameraZoom*window.devicePixelRatio, 
                         8*cameraZoom*window.devicePixelRatio);
    }

    //Draw the output tag.
    context.fillStyle = outputParams.outputTagColor;
    context.font = outputParams.outputTextFont(10);
    var tagPositionParsed = spaceToPosition(new Vector3(this.position.x + 10*this.width + 20,
                                                        this.position.y + 3));
    context.fillText(this.tag,
                     tagPositionParsed.x,
                     tagPositionParsed.y);

    //Draw output pin.
    this.input.draw(context, this.position);
  }

  //Update method for the output.
  /*This method is used for updating the state of the output.*/
  // this.update = function(clickPos){}

  //Method to move the position of the input.
  /*This method is used to move the position of the input.*/
  this.move = function(movementVector){
    this.position.add(movementVector);
  }

  //Parse to bin method for the input.
  /*This method is used to encode the input in binary.*/
  this.toBin = function(pins){
    return binaryFixedSize(this.width, 6) + 
            binaryFixedSize(this.position.x + 2**11, 12) + 
            binaryFixedSize(this.position.y + 2**11, 12) +
            binaryFixedSize(pins.indexOf(this.input), 12) + 
            binaryFixedSize(this.tag.length, 5) + 
            binaryFromString(this.tag);
  }

  //Parse bin to object method for the output.
  /*This method is used to decode the output from binary.*/
  this.binToObject = function(binary, pointer){
    //Parse to binary some properties.
    var width = parseInt(getBitsFromBinary(binary, pointer, 6), 2);
    var position = new Vector3(parseInt(getBitsFromBinary(binary, pointer, 12), 2) - 2**11,
                               parseInt(getBitsFromBinary(binary, pointer, 12), 2) - 2**11);
    var outputPin = parseInt(getBitsFromBinary(binary, pointer, 12), 2);
    var tagLength = parseInt(getBitsFromBinary(binary, pointer, 5), 2);
    var tag = stringFromBinary(getBitsFromBinary(binary, pointer, tagLength*8), 2);

    //Create the output and return it.
    var output = new Output(position, width, tag);
    output.input = outputPin;

    return output;
  }

}

export {Output};