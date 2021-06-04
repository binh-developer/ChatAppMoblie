export function sortAsc(arr) {
  return arr.sort(function (a, b) {
    var keyA = new Date(a.createdAt),
      keyB = new Date(b.createdAt);
    // Compare the 2 dates
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });
}

export function sortDesc(arr) {
  return arr.sort(function (a, b) {
    var keyA = new Date(a.createdAt),
      keyB = new Date(b.createdAt);
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
}
