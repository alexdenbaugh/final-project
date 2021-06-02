function debounce(functionToRun, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(functionToRun, delay);
  };
}

export default debounce;
