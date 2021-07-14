//Defines an undefined vector just to access vec with vec methods.
var Vec3 = new Vector3();

////VECTOR3 OBJECT DECLARATION.
function Vector3(x, y, z){
  ////VECTOR3 DIRECT PROPERTIES.
  this.x = x==undefined?0:x; //Vector x coordinate
  this.y = y==undefined?0:y; //Vector y coordinate.
  this.z = z==undefined?0:z; //Vector z coordinate.

  ////VECTOR3 INDIRECT PROPERTIES.
  //Return the modulo of the current vector.
  this.modulo = function(){
    return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
  }
  //Return the angle of the current vector.
  this.angle = function(planeNormal){
    var num = Math.abs(this.x*planeNormal.x + this.y*planeNormal.y + this.z*planeNormal.z);
    var den = Math.sqrt(planeNormal.x**2 + planeNormal.y**2 + planeNormal.z**2)*Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    return Math.asin(num/den);
  }
  //Return the unit vector of the current vector.
  this.unitVector = function(){
    return Vec3.mulVector3(this, 1/this.modulo());
  }

  ////VECTOR3 OPERATIONS.
  //Adds a vector to the current vector.
  this.add = function(vector1){
    this.x += vector1.x;
    this.y += vector1.y;
    this.z += vector1.z;
  }
  //Subs a vector to the current vector.
  this.sub = function(vector1){
    this.x -= vector1.x;
    this.y -= vector1.y;
    this.z -= vector1.z;
  }
  //Multiplies a number to the current vector.
  this.mul = function(num){
    this.x *= num;
    this.y *= num;
    this.z *= num;
  }
  //Return the vector product between the current vector and another vector.
  this.vectorProduct = function(vector1){
    return Vec3.addVector3(Vec3.addVector3(Vec3.mulVector3(vectorX, vector1.y*this.z - vector1.z*this.y),
                                          Vec3.mulVector3(vectorY, vector1.z*this.x - vector1.x*this.z)),
                                          Vec3.mulVector3(vectorZ, vector1.x*this.y - vector1.y*this.x));
  }
  //Return the dot product between the current vector and another vector.
  this.dotProduct = function(vector1){
    return vector1.x*this.x + vector1.y*this.y + vector1.z*this.z;
  }
  //Returns the vector as a matrix.
  this.toMatrix = function(vertical){
    if(vertical){return new Matrix([[this.x], [this.y], [this.z]]);}
    else{return new Matrix([[this.x, this.y, this.z]]);}
  }

  ////VECTOR3 VALUES VISUALIZATION.
  //Print the current vector in a table form in the console.
  this.print = function(){
    console.table([this.x, this.y, this.z]);
  }

  ////VECTOR3 RELATED FUNCTIONS.
  //Return the addition of two vectors.
  this.addVector3 = function(vector1, vector2){
    return new Vector3(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
  }
  //Return the subtraction of two vectors.
  this.subVector3 = function(vector1, vector2){
    return new Vector3(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
  }
  //Return the multiplication of a vector and a number.
  this.mulVector3 = function(vector1, num){
    return new Vector3(vector1.x * num, vector1.y * num, vector1.z * num);
  }
  //Return the vector product between two vectors.
  this.vectorProductVector3 = function(vector1, vector2){
    return Vec3.addVector3(Vec3.addVector3(Vec3.mulVector3(vectorX, vector1.y*vector2.z - vector1.z*vector2.y),
                                          Vec3.mulVector3(vectorY, vector1.z*vector2.x - vector1.x*vector2.z)),
                                          Vec3.mulVector3(vectorZ, vector1.x*vector2.y - vector1.y*vector2.x));
  }
  //Return the dot product between two vectors.
  this.dotProductVector3 = function(vector1, vector2){
    return vector1.x*vector2.x + vector1.y*vector2.y + vector1.z*vector2.z;
  }
  //Return the mix product between two vectors.
  this.mixProductVector3 = function(vector1, vector2, vector3){
    return Vec3.dotProductVector3(vector1, Vec3.vectorProductVector3(vector2, vector3));
  }
  //Return the modulo of a vector.
  this.moduloVector3 = function(vector1){
    return Math.sqrt(vector1.x**2 + vector1.y**2 + vector1.z**2);
  }
  //Return the angle of a vector relative to a plane.
  this.angleVector3 = function(vector1, planeNormal){
    var num = Math.abs(this.x*planeNormal.x + this.y*planeNormal.y + this.z*planeNormal.z);
    var den = Math.sqrt(planeNormal.x**2 + planeNormal.y**2 + planeNormal.z**2)*Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    return Math.asin(num/den);
  }
  //Return a unit vector given pair of angles.
  this.unitAngleVector3 = function(phi, theta){
    return new Vector3(Math.sin(theta)*Math.cos(phi), Math.sin(theta)*Math.sin(phi), Math.cos(theta));
  }
  //Return a unit vector given a vector.
  this.unitVectorVector3 = function(vector1){
    return Vec3.mulVector3(vector1, 1/vector1.modulo());
  }
  //Return a vector as a matrix.
  this.toMatrixVector3 = function(vector1, vertical){
    if(vertical){return new Matrix([[vector1.x], [vector1.y], [vector1.z]]);}
    else{return new Matrix([[vector1.x, vector1.y, vector1.z]]);}
  }
}

////USEFUL VECTORS.
var vectorX = new Vector3(1, 0, 0); //Vector of the X axis.
var vectorY = new Vector3(0, 1, 0); //Vector of the Y axis.
var vectorZ = new Vector3(0, 0, 1); //Vector of the Z axis.

export {Vector3, vectorX, vectorY, vectorZ, Vec3};
