export function showActualValue(data, decimalValue, returnType) {
    let value = data.toString();
    let val;
    if (parseFloat(value) > 0) {
      if (!value.includes(".")) {
        value = value + ".0";
      }
      let split = value.split(".");
  
      val = split[0] + "." + split[1].slice(0, decimalValue);
    } else {
      val = parseFloat(value).toFixed(decimalValue);
    }
  
    if (returnType === "string") {
      return val.toString();
    } else if (returnType === "number") {
      console.log(parseFloat(val));
      return parseFloat(val);
    }
  }
  