declare global {
  interface Array<T> {
    sortBy(expr: (item: T) => any, direction?: 1 | -1): T[];
  }
}

Array.prototype.sortBy = function(expr, direction = 1) {
  return this.sort((a, b) => {
    const aVal = expr(a);
    const bVal = expr(b);
    if (aVal < bVal) {
      return -direction;
    }
    if (aVal > bVal) {
      return direction;
    }
    return 0;
  });
};
