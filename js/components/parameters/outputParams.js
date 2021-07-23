import { cameraZoom } from "../../Main.js";

////EXTERNAL VARIABLES.
//Variables related to input style.
const outputParams = {
  outputRadius: 4,                          //Saves the value of the radius of the output.
  outputActiveBorderColor: "#2e8ec5",       //Saves the color of the border for an active output.
  outputNonActiveBorderColor: "#2e8ec5",    //Saves the color of the border for a non active output.
  outputActiveColor: "#2e8ec5",             //Saves the color for an active output.
  outputNonActiveColor: "#363636",          //Saves the color for a non active output.
  outputCaseBorderColor: "#2e8ec5",         //Saves the border color of the output case.
  outputCaseColor: "#23242c",               //Saves the color of the output case.
  outputTagColor: "#2e8ec5",                //Saves the color of the output tag.
  outputTextFont: function(size){return 'bold ' + size*cameraZoom + 'px monospace';},    //Saves the font type of the text in the output tag.
  outputRadius: 5,                          //Saves the radius of the output case.
  outputBorderResolution: 3                 //Saves the resolution of the border of the output case.
}

export {outputParams};