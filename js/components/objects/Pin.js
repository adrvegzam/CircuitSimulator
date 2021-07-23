import { Wire } from "./Wire.js";

import { pinParams } from "../parameters/pinParams.js";

import { binaryFixedSize, getBitsFromBinary, stringFromBinary } from "../../utils/Utiles.js";
import { appScreen, cameraPos, cameraZoom } from "../../Main.js";
import { Vec3, Vector3 } from "../../utils/Vector3.js";

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
  this.draw = function(context, origin){
    //Change color of the pin depending on its state.
    var absolutePosition = Vec3.addVector3(this.position, origin);
    var gradient = context.createRadialGradient((absolutePosition.x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2, 
                                                (absolutePosition.y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2, 1*cameraZoom,
                                                (absolutePosition.x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2, 
                                                (absolutePosition.y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2, 5*cameraZoom);
    gradient.addColorStop(0, pinParams.pinActiveColor);
    gradient.addColorStop(1, pinParams.pinNonActiveColor);
    if(this.connection.value){context.fillStyle = gradient; context.strokeStyle = pinParams.pinActiveBorderColor;}
    else{context.fillStyle = pinParams.pinNonActiveColor; context.strokeStyle = pinParams.pinNonActiveBorderColor;}

    //Draw the pin as a circle with border.
    context.beginPath();
    context.arc((absolutePosition.x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                (absolutePosition.y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2,
                pinParams.pinRadius * cameraZoom, 0, Math.PI*2);
    context.fill();
    context.stroke();

    if(this.tag != undefined && this.tagPosition != undefined){
      //Draw the pin tag.
      var newTag = this.tag + "["+this.width+":0]";
      context.fillStyle = pinParams.pinTagColor;
      context.font = pinParams.pinTextFont(5);
      context.fillText(newTag,
                       (this.tagPosition.x + absolutePosition.x - cameraPos.x*window.devicePixelRatio) * cameraZoom - cameraZoom*newTag.length*2.75/2 + appScreen.offsetWidth/2,
                       (this.tagPosition.y + absolutePosition.y - cameraPos.y*window.devicePixelRatio + 2) * cameraZoom + appScreen.offsetHeight/2);
    }
  }

  //Moving method for the pin.
  /*This method is used to move the position of the pin.*/
  this.move = function(movementVector){
    absolutePosition.add(movementVector);
  }

  //Parse to bin method for the pin.
  /*This method is used to encode the pin in binary.*/
  this.toBin = function(wires){
    console.log(this.position);
    return binaryFixedSize(this.type=="in"?1:0, 1) +
           binaryFixedSize(this.options, 1) + 
           binaryFixedSize(this.connection instanceof Wire?1:0, 1) + 
           binaryFixedSize(this.width, 6) +
           binaryFixedSize(this.connection instanceof Wire?wires.indexOf(this.connection):this.connection.value,
                           this.connection instanceof Wire?12:this.width) + 
           (this.options != 1? "":(
             binaryFixedSize(this.position.x + 2**5, 6) + 
             binaryFixedSize(this.position.y + 2**5, 6) + 
             binaryFixedSize(this.tag.length, 5) + 
             binaryFromString(this.tag) +
             binaryFixedSize(this.tagPosition.x, 3) + 
             binaryFixedSize(this.tagPosition.y, 3)
           ));
  }

  //Parse bin to object method for the pin.
  /*This method is used to decode the pin from binary.*/
  this.binToObject = function(binary, pointer){
    //Parse to binary some properties.
    var type = parseInt(getBitsFromBinary(binary, pointer, 1), 2)?"in":"out";
    var options = parseInt(getBitsFromBinary(binary, pointer, 1), 2);
    var connected = parseInt(getBitsFromBinary(binary, pointer, 1), 2);
    var width = parseInt(getBitsFromBinary(binary, pointer, 6), 2);
    var connection = connected?parseInt(getBitsFromBinary(binary, pointer, 12), 2):
                               {value: parseInt(getBitsFromBinary(binary, pointer, width), 2)};
    
    //Define some properties neccesary in case it has options.
    var position;
    var tagLength;
    var tag;
    var tagPosition;

    //If it has options, parse into binary option dependant properties.
    if(options){
      position = new Vector3(parseInt(getBitsFromBinary(binary, pointer, 6), 2) - 2**5,
                             parseInt(getBitsFromBinary(binary, pointer, 6), 2) - 2**5);
      tagLength = parseInt(getBitsFromBinary(binary, pointer, 5), 2);
      tag = stringFromBinary(getBitsFromBinary(binary, pointer, tagLength*8), 2);
      tagPosition = new Vector3(parseInt(getBitsFromBinary(binary, pointer, 3), 2) - 2**2,
                                parseInt(getBitsFromBinary(binary, pointer, 3), 2) - 2**2);
    }

    //Create the pin and return it.
    var pin = new Pin(position, width, options, tag, tagPosition, type);
    pin.connection = connection;

    return pin;
  }
}


export {Pin};