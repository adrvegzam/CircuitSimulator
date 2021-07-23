import { Pin } from "./Pin.js";

import { inputParams } from "../parameters/inputParams.js";

import { Vector3, Vec3 } from "../../utils/Vector3.js";
import { smoothContour, binaryFixedSize, binaryFromString, stringFromBinary, getBitsFromBinary } from "../../utils/Utiles.js";
import { appScreen, cameraPos, cameraZoom } from "../../Main.js";

////OBJECT DECLARATION.
/*This object is used to allow the user to make inputs to the circuit
through a kind of button that when pressed switches between the states
ON and OFF.

@PARAMETERS

*position:  Refers to the position of the input.
*value:     Refers to the current state of the input.

*/
function Input(position, width, tag){
  ////INTERNAL VARIABLES.
  //Variables for input geometry.
  this.position = position;       //Saves the position of the pin.
  this.width = width;             //Saves the width of the pin.
  this.tag = tag;                 //Saves the tag of the pin.
  this.contour = [[-5 - this.width*10, -0.5],
                  [-5, -0.5],
                  [-5, 0.5],
                  [-5 - this.width*10, 0.5]];

  if(this.position != undefined){
    this.contour = smoothContour(this.contour, this.position, inputParams.inputRadius, inputParams.inputBorderResolution);
  }

  //Variables for logic.
  this.output = new Pin(new Vector3(0, 0, 0), this.width, 0, undefined, undefined, "out");                 //Saves the state of the input.

  ////INTERNAL METHODS
  //Drawing method for the input.
  /*This method is used for drawing the input.*/
  this.draw = function(context){
    //Change color of the input depending on its state.
    if(this.value){context.fillStyle = inputParams.inputActiveColor; context.strokeStyle = inputParams.inputActiveBorderColor;}
    else{context.fillStyle = inputParams.inputNonActiveColor; context.strokeStyle = inputParams.inputNonActiveBorderColor;}

    //Draw the case of the input.
    context.fillStyle = inputParams.inputCaseColor;
    context.strokeStyle = inputParams.inputCaseBorderColor;
    context.beginPath();
    context.moveTo((this.contour[0].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                   (this.contour[0].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2);

    for(var i = 1; i < this.contour.length; i++){
      context.lineTo((this.contour[i].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                     (this.contour[i].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2);
    }

    context.fill();
    context.stroke();

    //Draw the touchable values.
    for(var i = 1; i <= this.width; i++){
      var bitValue = (this.output.connection.value >> (i-1)) % 2;

      if(bitValue){context.fillStyle = inputParams.inputActiveColor;}
      else{context.fillStyle = inputParams.inputNonActiveColor;}

      context.fillRect((this.position.x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2 -(10*i + 4)*cameraZoom,
                       (this.position.y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2 - 4*cameraZoom, 8*cameraZoom, 8*cameraZoom);

      context.strokeRect((this.position.x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2 - (10*i + 4)*cameraZoom,
                         (this.position.y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2 - 4*cameraZoom, 8*cameraZoom, 8*cameraZoom);
    }

    //Draw the input tag.
    context.fillStyle = inputParams.inputTagColor;
    context.font = inputParams.inputTextFont(10);
    context.fillText(this.tag,
                    (this.position.x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2 - (this.tag.length*5.5 + 10*this.width + 20)*cameraZoom,
                    (this.position.y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2 + 3*cameraZoom);

    //Draw output pin.
    this.output.draw(context, this.position);
  }

  //Update method for the input.
  /*This method is used for updating the state of the input.*/
  this.update = function(clickPos){
    //Invert the value of the input.
    var value = this.output.connection.value;
    var binaryValue = binaryFixedSize(this.output.connection.value, this.width);

    for(var i = 1; i <= this.width; i++){
      var buttonPos = Vec3.subVector3(this.position, new Vector3(i*10, 0, 0));
      if(clickPos.x <= buttonPos.x + 4 && clickPos.x >= buttonPos.x - 4 &&
        clickPos.y <= buttonPos.y + 4 && clickPos.y >= buttonPos.y - 4){
          binaryValue[this.width - i]=="1"?value-=2**(i-1):value+=2**(i-1);
          break;
      }
    }
    this.output.connection.value = value;
  }

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
            binaryFixedSize(pins.indexOf(this.output), 12) +  
            binaryFixedSize(this.tag.length, 5) + 
            binaryFromString(this.tag);
  }

  //Parse bin to object method for the input.
  /*This method is used to decode the input from binary.*/
  this.binToObject = function(binary, pointer){
    //Parse to binary some properties.
    var width = parseInt(getBitsFromBinary(binary, pointer, 6), 2);
    var position = new Vector3(parseInt(getBitsFromBinary(binary, pointer, 12), 2) - 2**11,
                               parseInt(getBitsFromBinary(binary, pointer, 12), 2) - 2**11);
    var inputPin = parseInt(getBitsFromBinary(binary, pointer, 12), 2);
    var tagLength = parseInt(getBitsFromBinary(binary, pointer, 5), 2);
    var tag = stringFromBinary(getBitsFromBinary(binary, pointer, tagLength*8), 2);

    //Create the input and return it.
    var input = new Input(position, width, tag);
    input.output = inputPin;

    return input;
  }

}

export {Input};