import { cameraZoom } from "../../Main.js";

////EXTERNAL VARIABLES.
//Variables related to input style.
const inputParams = {
  inputRadius: 4,                          //Saves the value of the radius of the input.
  inputActiveBorderColor: "#2e8ec5",       //Saves the color of the border for an active input.
  inputNonActiveBorderColor: "#2e8ec5",    //Saves the color of the border for a non active input.
  inputActiveColor: "#2e8ec5",             //Saves the color for an active input.
  inputNonActiveColor: "#363636",          //Saves the color for a non active input.
  inputCaseBorderColor: "#2e8ec5",         //Saves the border color of the input case.
  inputCaseColor: "#23242c",               //Saves the color of the input case.
  inputTagColor: "#2e8ec5",                //Saves the color of the input tag.
  inputTextFont: function(size){return 'bold ' + size*cameraZoom*window.devicePixelRatio + 'px monospace';},    //Saves the font type of the text in the input tag.
  inputRadius: 5,                          //Saves the radius of the input case.
  inputBorderResolution: 3                 //Saves the resolution of the border of the input case.
}

export {inputParams};