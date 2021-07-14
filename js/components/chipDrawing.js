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
    context.moveTo(this.contour[0].x, this.contour[0].y);
  
    for(var i = 1; i < this.contour.length; i++){
      context.lineTo(this.contour[i].x, this.contour[i].y);
    }
  
    context.fill();
    context.stroke();
  
    ///Draw pins.
    //Draw input pins.
    for(var i = 0; i < this.inputs.length; i++){
      this.inputs[i].draw(context);
    }
    //Draw output pins.
    for(var i = 0; i < this.outputs.length; i++){
      this.outputs[i].draw(context);
    }
  
    //Draw name of chip.
    context.fillStyle = chipParams.chipTextColor;
    context.font = chipParams.chipTextFont;
    context.fillText(this.name,
               this.position.x - this.name.length*8/2,
               this.position.y + 4);
  }
}

export {chipDrawing};