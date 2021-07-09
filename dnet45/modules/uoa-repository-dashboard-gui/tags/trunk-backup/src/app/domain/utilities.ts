
export function sortAlpgabetically (array: any[]) {
  array.sort(function(a,b){
    if(a < b ){
      return -1;
    } else if(a > b ){
      return 1;
    } else {
      return 0;
    }
  });
}
