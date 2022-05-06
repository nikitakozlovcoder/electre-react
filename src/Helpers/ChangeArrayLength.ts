export default function ChangeArrayLength<T> (arr: T[] | undefined | null,  len: number, filler: T ) : T[] {
    const newState = new Array(len);
    for (let i = 0; i < len; i++){
       if (arr && arr[i] && arr[i] != undefined){
           newState[i] = arr[i];
       }
       else {
           newState[i] = filler;
       }
    }
    return newState;
}