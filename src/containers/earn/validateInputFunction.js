
const customId = "custom-id-yes";

const toastConfig = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  toastId: customId,
  delay: 0,
};

function validateInput(input) {
  if (input === "") {
    // toast.error("Please fill the input field.", { ...toastConfig });
    return false;
  }

  if (input && input.includes(".")) {
    let afterDecimal = input.split(".")[1];
    let beforeDecimal = input.split(".")[0];

    if (afterDecimal.length > 18) {
      //  toast.error("Digits after decimal should not be greater than 18.", {
      //   ...toastConfig,
      // });
      return false;
    }

    let nonZeroInput = true;
    for (let i = 0; i < afterDecimal.length; i++) {
      if (parseInt(afterDecimal[i]) >= 1 && parseInt(afterDecimal[i]) <= 9) {
        nonZeroInput = false;
      }
    }

    let nonZeroInputBeforDecimal = true;
    for (let i = 0; i < beforeDecimal.length; i++) {
      if (parseInt(beforeDecimal[i]) >= 1 && parseInt(beforeDecimal[i]) <= 9) {
        nonZeroInputBeforDecimal = false;
      }
    }

    if (nonZeroInput && nonZeroInputBeforDecimal) {
      // toast.error("Please enter a valid input.", {
      //   ...toastConfig,
      // });
      return false;
    }
  }

  // if (input.length > 25) {
  //   toast.error("Input length greater than 25 can not be used", {
  //     ...toastConfig,
  //   });
  //   return false;
  // }

  if (input.startsWith(".") || input === "0") {
    // toast.error("Please enter valid input.", {
    //   ...toastConfig,
    // });
    return false;
  }

  if (input.includes(".") && !input.split(".")[1]) {
    // toast.error("Please enter valid input.", {
    //   ...toastConfig,
    // });
    return false;
  }

  let nonZeroInput = true;
  for (let i = 0; i < input.length; i++) {
    if (parseInt(input[i]) >= 1 && parseInt(input[i]) <= 9) {
      nonZeroInput = false;
    }
  }

  if (nonZeroInput) {
    // toast.error("Please enter a valid input.", {
    //   ...toastConfig,
    // });
    return false;
  }

  return true;
}

export default validateInput;
