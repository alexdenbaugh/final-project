function formatDate(date) {
  const [year, month, day] = date.slice(0, 10).split('-');
  return `${month}/${day}/${year.slice(2)}`;
}

export default formatDate;
