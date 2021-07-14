import { Vector3, Vec3 } from "./Vector3.js";

function gridFixed(position){
  return new Vector3(Math.round(position.x/5)*5,
                     Math.round(position.y/5)*5,
                     0);
}

function distanceToSegment(P, A, B) {
  var AP = Vec3.subVector3(P, A);
  var AB = Vec3.subVector3(B, A);
  var h = Math.min(1, Math.max(0, Vec3.dotProductVector3(AP, AB)/Vec3.dotProductVector3(AB, AB)));
  return Vec3.subVector3(AP, Vec3.mulVector3(AB, h)).modulo();
}

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

function binaryFixedSize(numberToBinary, binarySize){
  var binary = numberToBinary.toString(2);
  var binaryFixed = binary.length==binarySize?binary:"0".repeat(binarySize-binary.length) + binary;
  return binaryFixed;
}

function binaryFromString(stringToBinary){
  var binary = "";
  for(var i = 0; i < stringToBinary.length; i++){
    binary += binaryFixedSize(stringToBinary.charCodeAt(i), 8);
  }
  return binary;
}

function getBitsFromBinary(binary, pointer, numberOfBitsToGet){
  var subBinary = binary.substr(pointer.value, numberOfBitsToGet);
  pointer.value += numberOfBitsToGet;
  return subBinary;
}

export {gridFixed, distanceToSegment, smoothContour, binaryFixedSize, binaryFromString, getBitsFromBinary}