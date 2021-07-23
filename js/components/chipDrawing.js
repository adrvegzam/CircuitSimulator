import { appScreen, cameraPos, cameraZoom } from "../Main.js";
import { positionToSpace, spaceToPosition } from "../utils/Utiles.js";
import { Vec3, Vector3 } from "../utils/Vector3.js";
import { chipParams } from "./parameters/chipParams.js";

////EXTERNAL DRAWING METHODS
const chipDrawing = {
  //Drawing method for a gate used in AND, NAND, OR, NOR, XOR, NXOR, BUF, NOT, HA, FA.
  /*This method draws a gate*/
  drawGenericChip: function(context){
    
    //Draw outer case.
    context.fillStyle = chipParams.chipCaseColor;
    context.strokeStyle = chipParams.chipCaseBorderColor;
    context.beginPath();
    var positionParsed = spaceToPosition(this.contour[0]);
    context.moveTo(positionParsed.x,
                   positionParsed.y);
  
    for(var i = this.contour.length - 1; i >= 0; i--){
      positionParsed = spaceToPosition(this.contour[i]);
      context.lineTo(positionParsed.x,
                     positionParsed.y);
    }
  
    context.fill();
    context.stroke();
  
    ///Draw pins.
    //Draw input pins.
    for(var i = 0; i < this.inputs.length; i++){
      this.inputs[i].draw(context, this.position);
    }
    //Draw output pins.
    for(var i = 0; i < this.outputs.length; i++){
      this.outputs[i].draw(context, this.position);
    }
  
    //Draw name of chip.
    context.fillStyle = chipParams.chipTextColor;
    context.font = chipParams.chipTextFont(10);
    var positionParsed = spaceToPosition(new Vector3(this.position.x - this.name.length*5.5/2,
                                                     this.position.y + 3.5));
    context.fillText(this.name,
                    positionParsed.x,
                    positionParsed.y);
  },

  //Drawing method for a chip used in SPLITTER and JOINER.
  /*This method draws a chip*/
  drawBusChip: function(context){
    
    //Draw outer case.
    for(var e = 0; e < this.lines.length; e++){

      if(e == 0){
        var value = 0;
        this.inputs.forEach((input, index) => value += (2**index)*input.connection.value);
        if(value == 0){context.strokeStyle = chipParams.chipWireNonActiveColor;}
        else{context.strokeStyle = chipParams.chipWireActiveColor;}
      }else{
        var value = 0;
        if(this.name == "SPLITTER"){value = this.inputs[0].connection.value;}
        else if(this.name == "JOINER"){this.inputs.forEach((input, index) => value += (2**index)*input.connection.value);}
        if((value >> (e-1)) % 2 == 0){context.strokeStyle = chipParams.chipWireNonActiveColor;}
        else{context.strokeStyle = chipParams.chipWireActiveColor;}
      }

      context.lineWidth = cameraZoom/2;
      context.beginPath();
      var positionParsed = spaceToPosition(this.lines[e][0]);
      context.moveTo(positionParsed.x,
                     positionParsed.y);
    
      for(var i = 1; i < this.lines[e].length; i++){
        positionParsed = spaceToPosition(this.lines[e][i]);
        context.lineTo(positionParsed.x,
                       positionParsed.y);
      }
      context.stroke();
    }
    context.lineWidth = 1;

    ///Draw pins.
    //Draw input pins.
    for(var i = 0; i < this.inputs.length; i++){
      this.inputs[i].draw(context, this.position);
    }
    //Draw output pins.
    for(var i = 0; i < this.outputs.length; i++){
      this.outputs[i].draw(context, this.position);
    }
  }
}

export {chipDrawing};