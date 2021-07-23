import { cameraZoom } from "../../Main.js";

////EXTERNAL VARIABLES.
//Variables related to pin style.
const pinParams = {
  pinRadius: 4,                          //Saves the value of the radius of the pin.
  pinActiveBorderColor: "#2e8ec5",       //Saves the color of the border for an active pin.
  pinNonActiveBorderColor: "#2e8ec5",    //Saves the color of the border for a non active pin.
  pinActiveColor: "#2e8ec5",             //Saves the color of an active pin.
  pinNonActiveColor: "#363636",          //Saves the color of a non active pin.
  pinTagColor: "#2e8ec5",                //Saves the color of the pin tag.
  pinTextFont: function(size){return 'bold ' + size*cameraZoom*window.devicePixelRatio + 'px monospace';}         //Saves the font type of the text in the pin tag.
}

export { pinParams };