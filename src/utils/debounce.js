/**
 * Debounce function - it will delay the execution of the function until the user stops typing
 * @param {Function} func - function to be executed
 * @param {number} delay - delay in ms
 * @returns {Function} - debounced function
 */
const debounce = (func, delay) => {
  if (typeof func !== "function") {
    throw new Error("First argument must be a function");
  }
  if (typeof delay !== "number") {
    throw new Error("Second argument must be a number");
  }

  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export default debounce;
