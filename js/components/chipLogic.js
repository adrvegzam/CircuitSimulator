import { binaryFixedSize } from "../utils/Utiles.js";

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
  },

  //This method applies the Decoder function.
  DEC: function(){
    var index = this.inputs.map(input => input.connection.value)
                           .reduce((acc, val, ind) => acc + val*2**ind);
    this.outputs.forEach((output) => output.connection.value = 0);
    this.outputs[index].connection.value = 1;
  },

  //This method applies the Encoder function.
  ENC: function(){
    var value = 0;
    var numberActivated = 0;
    for(var i = 0; i < this.inputs.length; i++){
      value += this.inputs[i].connection.value == 1?i:0;
      numberActivated += this.inputs[i].connection.value == 1?1:0;
    }
    value = binaryFixedSize(value, this.outputs.length);
    console.log(value);
    if(numberActivated == 1){
      this.outputs.forEach((output, index) => output.connection.value = parseInt(value[this.outputs.length - index - 1]));
    }else{
      this.outputs.forEach((output) => output.connection.value = 0);
    }
  },

  //This method applies the Multiplexer function.
  MUX: function(){
    var muxSize = Math.floor(Math.log2(this.inputs.length)); 
    var index = this.inputs.map(input => input.connection.value)
                           .reduce((acc, val, ind) => {if(ind < muxSize){return acc + val*2**ind}else{return acc}});
    this.outputs[0].connection.value = this.inputs[index + muxSize].connection.value
  },

  //This method applies the Demultiplexer function.
  DEMUX: function(){
    var demuxSize = this.inputs.length - 1; 
    var index = this.inputs.map(input => input.connection.value)
                           .reduce((acc, val, ind) => {if(ind < demuxSize){return acc + val*2**ind}else{return acc}});
    this.outputs.forEach((output) => output.connection.value = 0);
    this.outputs[index].connection.value = this.inputs[this.inputs.length - 1].connection.value;
  },

  //This method applies the RW Register function.
  REGRW: function(){
    if(this.inputs[0].connection.value && this.inputs[3].connection.value){this.q = this.inputs[1].connection.value;}
    if(this.inputs[2].connection.value){
      this.outputs[1].connection.value = this.q;
      this.outputs[0].connection.value = parseInt(binaryFixedSize(this.q, this.outputs[0].width)
                                                        .replaceAll("1", "x")
                                                        .replaceAll("0", "1")
                                                        .replaceAll("x", "0"), 2);
    }else{
      this.outputs[1].connection.value = 0;
      this.outputs[0].connection.value = 0;
    }
  },

  //This method applies the W Register function.
  REGW: function(){
    if(this.inputs[0].connection.value && this.inputs[2].connection.value){this.q = this.inputs[1].connection.value;}
    this.outputs[1].connection.value = this.q;
    this.outputs[0].connection.value = parseInt(binaryFixedSize(this.q, this.outputs[0].width)
                                                      .replaceAll("1", "x")
                                                      .replaceAll("0", "1")
                                                      .replaceAll("x", "0"), 2); 
  },

  //This method applies the D Latch function.
  DLATCH: function(){
    if(this.inputs[0].connection.value){this.q = this.inputs[1].connection.value;}
    this.outputs[1].connection.value = this.q;
    this.outputs[0].connection.value = parseInt(binaryFixedSize(this.q, this.outputs[0].width)
                                                      .replaceAll("1", "x")
                                                      .replaceAll("0", "1")
                                                      .replaceAll("x", "0"), 2); 
  },

  //This method applies the SR Latch function.
  SRLATCH: function(){
    if(this.inputs[0].connection.value && this.inputs[1].connection.value){this.q = 0;}
    else if(this.inputs[0].connection.value && this.inputs[2].connection.value){this.q = 1;}
    this.outputs[1].connection.value = this.q;
    this.outputs[0].connection.value = parseInt(binaryFixedSize(this.q, this.outputs[0].width)
                                                      .replaceAll("1", "x")
                                                      .replaceAll("0", "1")
                                                      .replaceAll("x", "0"), 2); 
  },

  //This method applies the T Latch function.
  TLATCH: function(){
    if(this.inputs[0].connection.value && this.inputs[1].connection.value){this.q = this.q==0?1:0;}
    this.outputs[1].connection.value = this.q;
    this.outputs[0].connection.value = parseInt(binaryFixedSize(this.q, this.outputs[0].width)
                                                      .replaceAll("1", "x")
                                                      .replaceAll("0", "1")
                                                      .replaceAll("x", "0"), 2); 
  },

  //This method applies the JK Latch function.
  JKLATCH: function(){
    if(this.inputs[0].connection.value && this.inputs[1].connection.value && this.inputs[2].connection.value){this.q = this.q==0?1:0;}
    else{
      if(this.inputs[0].connection.value && this.inputs[1].connection.value){this.q = 0;}
      else if(this.inputs[0].connection.value && this.inputs[2].connection.value){this.q = 1;}
    }
    this.outputs[1].connection.value = this.q;
    this.outputs[0].connection.value = parseInt(binaryFixedSize(this.q, this.outputs[0].width)
                                                      .replaceAll("1", "x")
                                                      .replaceAll("0", "1")
                                                      .replaceAll("x", "0"), 2); 
  },

  //This method applies the Splitter function.
  SPLITTER: function(){
    var value = this.inputs[0].connection.value;
    this.outputs.forEach((output, index) => output.connection.value = (value >> index) % 2);
  },

  //This method applies the Joiner function.
  JOINER: function(){
    var value = 0;
    this.inputs.forEach((input, index) => value += (2**index)*input.connection.value);
    this.outputs[0].connection.value = value;
  }
  
}

export {chipLogic};