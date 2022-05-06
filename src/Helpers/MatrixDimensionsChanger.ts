export default function ChangeMatrixDimensions<T> (matrix: T[][] | undefined | null,  rows: number, cols: number) : T[][] {
    const newState = new Array(rows);
    for(let i = 0; i < rows; i++){
        newState[i] = new Array(cols);
        for (let j = 0; j <cols; j++){
            if (matrix && matrix[i] && matrix[i][j] != null)
                newState[i][j] = matrix[i][j];
            else
                newState[i][j] = undefined;
        }
    }
    return newState;
}