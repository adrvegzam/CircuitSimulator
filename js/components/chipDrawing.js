import { appScreen, cameraPos, cameraZoom } from "../Main.js";
import { Vec3 } from "../utils/Vector3.js";
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
    context.moveTo((this.contour[0].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                   (this.contour[0].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2);
  
    for(var i = this.contour.length - 1; i >= 0; i--){
      context.lineTo((this.contour[i].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                     (this.contour[i].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2);
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
    context.fillText(this.name,
                    (this.position.x - cameraPos.x*window.devicePixelRatio) * cameraZoom - cameraZoom*this.name.length*5.5/2 + appScreen.offsetWidth/2,
                    (this.position.y - cameraPos.y*window.devicePixelRatio) * cameraZoom + 3.5*cameraZoom + appScreen.offsetHeight/2);
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
      context.moveTo((this.lines[e][0].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                     (this.lines[e][0].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2);
    
      for(var i = 1; i < this.lines[e].length; i++){
        context.lineTo((this.lines[e][i].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                       (this.lines[e][i].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2);
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