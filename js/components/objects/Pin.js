import { pinParams } from "../parameters/pinParams.js";

import { binaryFixedSize } from "../../utils/Utiles.js";

////OBJECT DECLARATION.
/*This object is used as an intermediary between the inputs and outputs of a chip
and the elements connected to them, so that they have a real object in the space
associated with the connection. In that way you don't have to check the connection
with the chip position and using complex calculations to determine the position of
those inputs and outputs.

@PARAMETERS

*position:    Refers to the position of the pin.
*width:       Refers to the width of the pin.
*options:     Refers if the pin is modified.
*tag:         Refers to tag to display. 
*tagPosition: Refers to the position of the tag to be displayed. 

*/
function Pin(position, width, options, tag, tagPosition, type){
  ////INTERNAL VARIABLES.
  //Variables related to pin geometry.
  this.position = position;       //Saves the position of the pin.
  this.width = width;             //Saves the width of the pin.
  this.options = options;         //Saves if the pin has options.
  this.type = type                //Saves the type of the pin.
  this.tag = tag;                 //Saves the tag of the pin.
  this.tagPosition = tagPosition; //Saves the relative position of the tag of the pin.

  //Variables related to pin logic.
  this.connection = {value:0};    //Saves the connection of the pin.

  ////INTERNAL METHODS
  //Drawing method for the pin.
  /*This method is used for drawing the pin.*/
  this.draw = function(context){
    //Change color of the pin depending on its state.
    if(this.connection.value){context.fillStyle = pinParams.pinActiveColor; context.strokeStyle = pinParams.pinActiveBorderColor;}
    else{context.fillStyle = pinParams.pinNonActiveColor; context.strokeStyle = pinParams.pinNonActiveBorderColor;}

    //Draw the pin as a circle with border.
    context.beginPath();
    context.arc(this.position.x,
                this.position.y,
                pinParams.pinRadius, 0, Math.PI*2);
    context.fill();
    context.stroke();

    if(this.tag != undefined && this.tagPosition != undefined){
      //Draw the pin tag.
      context.fillStyle = pinParams.pinTagColor;
      context.font = pinParams.pinTextFont;
      context.fillText(this.tag,
                       this.tagPosition.x + this.position.x - this.tag.length*5.5/2 - 2.5,
                       this.tagPosition.y + this.position.y + 4);
    }
  }

  //Moving method for the pin.
  /*This method is used to move the position of the pin.*/
  this.move = function(movementVector){
    this.position.add(movementVector);
    this.tagPosition.add(movementVector);
  }

  //Parse to bin method for the pin.
  /*This method is used to encode the pin in binary.*/
  this.toBin = function(wires){
    return binaryFixedSize(this.type=="in"?1:0, 1) +
           binaryFixedSize(this.options, 1) + 
           binaryFixedSize(this.width, 6) +
           binaryFixedSize(this.type=="in"?wires.indexOf(this.connection):this.connection.value,
                           this.type=="in"?12:this.width) + 
           (this.options != 1? "":(
             binaryFixedSize(this.position.x, 6) + 
             binaryFixedSize(this.position.y, 6) + 
             binaryFixedSize(this.tag.length, 5) + 
             binaryFromString(this.tag) +
             binaryFixedSize(this.tagPosition.x, 3) + 
             binaryFixedSize(this.tagPosition.y, 3)
           ));
  }
}


export {Pin};