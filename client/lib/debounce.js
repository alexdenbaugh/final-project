export default function debounce(callback, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      try {
        callback.apply(this, args);
      } catch (err) {
        console.error('Debounced function error:', err);
      }
    }, delay);
  };
}
