import { appScreen, cameraPos, cameraZoom } from "../../Main.js";

import { wireParams } from "../parameters/wireParams.js";

import { Vector3, Vec3 } from "../../utils/Vector3.js";
import { binaryFixedSize, getBitsFromBinary } from "../../utils/Utiles.js";

////OBJECT DECLARATION.
/*This object is used as an abstraction of a wire or a net of wire, allowing
the user to make connections between the different elements in the circuit by
just connecting them to a wire, and the wire to another element.

@PARAMETERS

*positions: Refers to the positions of the segments of the wire.
*width: Refers to the positions of the segments of the wire.

*/
function Wire(positions, width){
  ////INTERNAL VARIABLES.
  //Variables for wire geometry.
  this.positions = positions;       //Saves all the positions of the wire.
  this.width = width;               //Saves the width of the bus.

  //Variables for logic.
  this.value = 0;                   //Saves the state of the wire.
  this.connections = [];            //Saves the connections of the wire.

  ////INTERNAL METHODS
  //Drawing method for the wire.
  /*This method is used for drawing the wire.*/
  this.draw = function(context){

    //Change color of the wire depending on its state.
    if(this.value){context.strokeStyle = wireParams.wireActiveColor;}
    else{context.strokeStyle = wireParams.wireNonActiveColor;}
    context.lineWidth = cameraZoom/2;
    
    //For every piece of wire draw every segment.
    for(var e = 0; e < this.positions.length; e++){

      //Set first vertex.
      context.beginPath();
      var positionVertex = new Vector3((this.positions[e][0].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                                       (this.positions[e][0].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2, 0);
      context.moveTo(positionVertex.x, positionVertex.y);

      //Continue with inner segments of every piece.
      for(var i = 1; i < this.positions[e].length - 1; i++){
        //Apply a little bevel around the vertices.
        positionVertex = new Vector3((this.positions[e][i].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                                     (this.positions[e][i].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2, 0)
        var positionVertexplus = new Vector3((this.positions[e][i+1].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                                             (this.positions[e][i+1].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2, 0)
        var positionVertexminus = new Vector3((this.positions[e][i-1].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                                              (this.positions[e][i-1].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2, 0)
        var dir1 = Vec3.subVector3(positionVertex, positionVertexminus).unitVector();
        var dir2 = Vec3.subVector3(positionVertex, positionVertexplus).unitVector();
        context.lineTo(positionVertex.x - dir1.x*wireParams.wireRadius,
                       positionVertex.y - dir1.y*wireParams.wireRadius);
        context.lineTo(positionVertex.x - (dir1.x*wireParams.wireRadius + dir2.x*wireParams.wireRadius)/3,
                       positionVertex.y - (dir1.y*wireParams.wireRadius + dir2.y*wireParams.wireRadius)/3);
        context.lineTo(positionVertex.x - dir2.x*wireParams.wireRadius,
                       positionVertex.y - dir2.y*wireParams.wireRadius);
      }

      //Finish with last vertex.
      positionVertex = new Vector3((this.positions[e][this.positions[e].length - 1].x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                                   (this.positions[e][this.positions[e].length - 1].y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2, 0);
      context.lineTo(positionVertex.x, positionVertex.y);
      context.stroke();

      if(this.width > 1 && this.positions[e].length > 1){
        //Show the width line of the wire.
        context.lineWidth = 1
        var segmentToDrawWidth = Math.round(this.positions[e].length/2);
        var intersectPoint = Vec3.mulVector3(Vec3.addVector3(this.positions[e][segmentToDrawWidth], this.positions[e][segmentToDrawWidth - 1]), 0.5);
        var despHorizontal = this.positions[e][segmentToDrawWidth].x == this.positions[e][segmentToDrawWidth - 1].x ? 10:0;
        var despVertical = this.positions[e][segmentToDrawWidth].y == this.positions[e][segmentToDrawWidth - 1].y ? -10:0;
        positionVertex = new Vector3((intersectPoint.x - cameraPos.x*window.devicePixelRatio) * cameraZoom + appScreen.offsetWidth/2,
                                     (intersectPoint.y - cameraPos.y*window.devicePixelRatio) * cameraZoom + appScreen.offsetHeight/2, 0)
        context.beginPath();
        context.moveTo(positionVertex.x - 2*cameraZoom, positionVertex.y - 2*cameraZoom);
        context.lineTo(positionVertex.x + 2*cameraZoom, positionVertex.y + 2*cameraZoom);
        context.stroke();
  
        //Show the width number of the wire.
        context.fillStyle = wireParams.wireWidthColor;
        context.font = wireParams.wireWidthFont(10);
        context.fillText(this.width,
                         positionVertex.x + despHorizontal,
                         positionVertex.y + despVertical);
      }
    }
    context.lineWidth = 1;
  }

  //Update method for the wire.
  /*This method is used for updating the state of the wire.*/
  this.update = function(){
    var value = 0;
    for(var i = 0; i < this.connections.length; i++){
      value |= this.connections[i].connection.value;    
    }
    this.value = value;
  }

  //Move method for the wire.
  /*This method is used to move the position of the wire.*/
  this.move = function(movementVector){
    this.positions.forEach(positionArrayElem => positionArrayElem
                  .forEach(position => position.add(movementVector)));
  }

  //Parse to bin method for the wire.
  /*This method is used to encode the wire in binary.*/
  this.toBin = function(pins){
    var binary = binaryFixedSize(this.width, 6) + 
                 binaryFixedSize(this.positions.length, 8);
    for(var i = 0; i < this.positions.length; i++){
      binary += binaryFixedSize(this.positions[i].length, 8);
      for(var e = 0; e < this.positions[i].length; e++){
        binary += binaryFixedSize(this.positions[i][e].x + 2**11, 12); 
        binary += binaryFixedSize(this.positions[i][e].y + 2**11, 12); 
      }
    }
    binary += binaryFixedSize(this.connections.length, 12);
    for(var i = 0; i < this.connections.length; i++){
      binary += binaryFixedSize(pins.indexOf(this.connections[i]), 12);
    }
    return binary;
  }

  //Parse bin to object method for the circuit.
  /*This method is used to decode the circuit from binary.*/
  this.binToObject = function(binary, pointer){
    //Parse to binary some properties.
    var width = parseInt(getBitsFromBinary(binary, pointer, 6), 2);
    var positions = [];
    var connections = [];
    
    //Parse to binary the positions of the wire. 
    var positionsLength = parseInt(getBitsFromBinary(binary, pointer, 8), 2);
    for(var i = 0; i < positionsLength; i++){
      var positionLength = parseInt(getBitsFromBinary(binary, pointer, 8), 2);
      var position = [];
      for(var e = 0; e < positionLength; e++){
        position.push(new Vector3(parseInt(getBitsFromBinary(binary, pointer, 12), 2) - 2**11,
                                  parseInt(getBitsFromBinary(binary, pointer, 12), 2) - 2**11))
      }
      positions.push(position);
    }
    
    //Parse to binary the connections of the wire.
    var connectionsLength = parseInt(getBitsFromBinary(binary, pointer, 12), 2);
    for(var i = 0; i < connectionsLength; i++){
      connections.push(parseInt(getBitsFromBinary(binary, pointer, 12), 2));
    }

    //Create the wire and return it.
    var wire = new Wire(positions, width);
    wire.connections = connections;
    
    return wire;
  }

}


export {Wire};