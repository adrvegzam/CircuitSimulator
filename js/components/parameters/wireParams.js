import { cameraZoom } from "../../Main.js";

////EXTERNAL VARIABLES.
//Variables related to wire style.
const wireParams = {
  wireRadius: 3,                   //Saves the value of the radius at corners.
  wireActiveColor: "#2e8ec5",      //Saves the color of the active wire.
  wireNonActiveColor: "#605e68",   //Saves the color of the non active wire.
  wireWidthColor: "#605e68",       //Saves the color of the text that displays the width;
  wireWidthFont: function(size){return 'bold ' + size*cameraZoom + 'px monospace';} //Saves the font type of the text in the width of the wire.
}
  
export {wireParams};