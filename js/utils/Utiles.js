import { Vector3, Vec3 } from "./Vector3.js";

////VECTOR OPERATIONS
//This method calculates the grided position of an input position.
function gridFixed(position){
  return new Vector3(Math.round(position.x/5)*5,
                     Math.round(position.y/5)*5,
                     0);
}

//This method returns the distance from a point to a segment.
function distanceToSegment(P, A, B) {
  var AP = Vec3.subVector3(P, A);
  var AB = Vec3.subVector3(B, A);
  var h = Math.min(1, Math.max(0, Vec3.dotProductVector3(AP, AB)/Vec3.dotProductVector3(AB, AB)));
  return Vec3.subVector3(AP, Vec3.mulVector3(AB, h)).modulo();
}

////COMPONENT GENERATION
//This method smooths out a contour given it, its origin, its radius and resolution.
function smoothContour(vertices, position, radius, resolution){
  var contour = [];
  var angle = Math.PI;
  for(var i = 0; i < 4; i++){
    for(var e = 0; e < resolution; e++){
      contour.push(new Vector3(vertices[i][0]+Math.cos(angle)*radius + position.x,
                               vertices[i][1]+Math.sin(angle)*radius + position.y,  
                               0));

      angle += Math.PI/(2*resolution-2);
    }
    angle -= Math.PI/(2*resolution-2);
  }
  return contour;
}

////BINARY MANIPULATION
//This method creates a binary string from a number and a string size.
function binaryFixedSize(numberToBinary, binarySize){
  if(numberToBinary == false){numberToBinary = 0;}
  if(numberToBinary == true){numberToBinary = 1;}
  var binary = numberToBinary.toString(2);
  console.log(binary, binarySize);
  var binaryFixed = binary.length==binarySize?binary:"0".repeat(binarySize-binary.length) + binary;
  return binaryFixed;
}

//This method creates a binary string from a string.
function binaryFromString(stringToBinary){
  var binary = "";
  for(var i = 0; i < stringToBinary.length; i++){
    binary += binaryFixedSize(stringToBinary.charCodeAt(i), 8);
  }
  return binary;
}

//This method creates a string from a binary string.
function stringFromBinary(binaryToString){
  var text = "";
  for(var i = 0; i < binaryToString.length/8; i++){
    text += String.fromCharCode(parseInt(binaryToString.substr(i*8, 8), 2));
  }
  return text;
}

//This method gets certain bits from a binary string.
function getBitsFromBinary(binary, pointer, numberOfBitsToGet){
  var subBinary = binary.substr(pointer.value, numberOfBitsToGet);
  pointer.value += numberOfBitsToGet;
  return subBinary;
}

export {gridFixed, distanceToSegment, smoothContour, binaryFixedSize,
         binaryFromString, getBitsFromBinary, stringFromBinary}