import { Pin } from "./Pin.js";

import { inputParams } from "../parameters/inputParams.js";

import { Vector3, Vec3 } from "../../utils/Vector3.js";
import { smoothContour, binaryFixedSize, binaryFromString } from "../../utils/Utiles.js";

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

  this.contour = smoothContour(this.contour, this.position, inputParams.inputRadius, inputParams.inputBorderResolution);

  //Variables for logic.
  this.output = new Pin(this.position, this.width, 0, undefined, undefined, "out");                 //Saves the state of the input.

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
    context.moveTo(this.contour[0].x, this.contour[0].y);

    for(var i = 1; i < this.contour.length; i++){
      context.lineTo(this.contour[i].x, this.contour[i].y);
    }

    context.fill();
    context.stroke();

    //Draw the touchable values.
    for(var i = 1; i <= this.width; i++){
      var bitValue = (this.output.connection.value >> (i-1)) % 2;

      if(bitValue){context.fillStyle = inputParams.inputActiveColor;}
      else{context.fillStyle = inputParams.inputNonActiveColor;}

      context.fillRect(this.position.x -10*i - 4, this.position.y - 4, 8, 8);
    }

    //Draw the input tag.
    context.fillStyle = inputParams.inputTagColor;
    context.font = inputParams.inputTextFont;
    context.fillText(this.tag,
                     this.position.x - this.tag.length*5.5 - 10*this.width - 20,
                     this.position.y + 3);

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
      if(clickPos.x <= buttonPos.x + 5 && clickPos.x >= buttonPos.x - 5 &&
        clickPos.y <= buttonPos.y + 5 && clickPos.y >= buttonPos.y - 5){
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
            binaryFixedSize(this.position.x, 12) + 
            binaryFixedSize(this.position.y, 12) +
            binaryFixedSize(pins.indexOf(this.output), 12) +  
            binaryFixedSize(this.tag.length, 5) + 
            binaryFromString(this.tag);
  }

}

export {Input};