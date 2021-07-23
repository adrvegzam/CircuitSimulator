import { cameraZoom } from "../../Main.js";

////EXTERNAL VARIABLES.
const chipParams = {
  chipPinsSpacing: 1,                    //Saves the spacing between pins.
  chipRadius: 5,                         //Saves the radius of the chip corners.
  chipBorderResolution: 3,               //Saves the number of vertices in the chip corners.
  chipCaseBorderColor: "#2e8ec5",        //Saves the border color of the chip case.
  chipCaseColor: "#23242c",              //Saves the color of the chip case.
  chipTextColor: "#2e8ec5",              //Saves the color of the text in the chip case.
  chipWireNonActiveColor: "#605e68",     //Saves the color of the non active chip wire.
  chipWireActiveColor: "#2e8ec5",        //Saves the color of the active chip wire.
  chipTextFont: function(size){return 'bold ' + size*cameraZoom + 'px monospace';}         //Saves the font type of the text in the chip case.
}

export {chipParams};