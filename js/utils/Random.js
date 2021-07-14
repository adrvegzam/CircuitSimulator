////RANDOM RELATED FUNCTIONS.
//Return a random number between a min and a max value.
function random(min, max){
  return Math.random()*(max-min) + min;
}
//Return a random integer between a min and a max value.
function randomInt(min, max){
  return Math.floor(random(min, max + 0.99));
}
