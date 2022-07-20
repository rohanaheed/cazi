function addComma(n, addDecimalPart = false) {


    if (n === null) {
      return;
    }

  
    let num = n;
    n = n.toString();
    let decimalPart = "";
    if (n.includes(".")) {
      num = n.split(".")[0];
      decimalPart = n.split(".")[1];
    }
    if (num.length <= 3 && addDecimalPart) {
      return n;
    }else if(num.length <=3  && !addDecimalPart){
      return num;
    }
    

    let x = num
      .toString()
      .split("") // transform the string to array with every digit becoming an element in the array
      .reverse() // reverse the array so that we can start process the number from the least digit
      .map((digit, index) =>
        index !== 0 && index % 3 === 0 ? `${digit},` : digit
      )
      .reverse()
      .join("");
  
    if (decimalPart && addDecimalPart) {
      return x + "." + decimalPart;
      // return x;
    }
  //  else if (!decimalPart && addDecimalPart) {
  //     // return x + "." + decimalPart;
  //     return x;
  //   }
    
    else return x;
  }
  export default addComma;
  