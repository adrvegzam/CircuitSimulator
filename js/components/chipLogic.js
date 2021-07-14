////EXTERNAL METHODS.
const chipLogic = {
  //This method applies the NOR function.
  NOR: function(){
    this.outputs[0].connection.value = !this.inputs.map((val) => val.connection.value)
                                                   .reduce((acc, val) => acc | val);
  },
  
  //This method applies the NAND function.
  NAND: function(){
    this.outputs[0].connection.value = !this.inputs.map((val) => val.connection.value)
                                                   .reduce((acc, val) => acc & val);
  },
  
  //This method applies the OR function.
  OR: function(){
    this.outputs[0].connection.value = this.inputs.map((val) => val.connection.value)
                                                  .reduce((acc, val) => acc | val);
  },
  
  //This method applies the AND function.
  AND: function(){
    this.outputs[0].connection.value = this.inputs.map((val) => val.connection.value)
                                                  .reduce((acc, val) => acc & val);
  },
  
  //This method applies the XOR function.
  XOR: function(){
    this.outputs[0].connection.value = 1 == this.inputs.map((val) => val.connection.value)
                                                       .reduce((acc, val) => acc + val);
  },
  
  //This method applies the XNOR function.
  XNOR: function(){
    this.outputs[0].connection.value = 1 != this.inputs.map((val) => val.connection.value)
                                                       .reduce((acc, val) => acc + val);
  },
  
  //This method applies the NOT function.
  NOT: function(){
    this.outputs[0].connection.value = !this.inputs[0].connection.value;
  },
  
  //This method applies the BUF function.
  BUF: function(){
    this.outputs[0].connection.value = this.inputs[0].connection.value;
  },
  
  //This method applies the Half Adder function.
  HA: function(){
    var A = this.inputs[0].connection.value;
    var B = this.inputs[1].connection.value;
    this.outputs[0].connection.value = A^B;
    this.outputs[1].connection.value = A&B;
  },
  
  //This method applies the Full Adder function.
  FA: function(){
    var A = this.inputs[0].connection.value;
    var B = this.inputs[1].connection.value;
    var Cin = this.inputs[2].connection.value
    this.outputs[0].connection.value = A^B^Cin;
    this.outputs[1].connection.value = A&B | Cin&(A^B);
  }
}

export {chipLogic};