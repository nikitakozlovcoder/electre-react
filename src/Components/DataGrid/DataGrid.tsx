import React, {useEffect, useRef, useState} from "react";

export  interface DataGridProps {
    data: number[][],
    columnDefinitions: string[],
    rowsDefinitions: string[],
    editable: boolean,
    handler?: (arg: number[][]) => void, 
    min?: number,
    max?: number
}

export default function DataGrid({data, columnDefinitions, rowsDefinitions, editable, handler, min, max} : DataGridProps){
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
        if (handler) {
            if (min != null &&  Number(e.target.value) < min){
                return;
            }
            
            if (max != null &&  Number(e.target.value) > max){
                return;
            }
            handler(data.map((x, i) => x.map((y, j) => i == row && j == col ? Number(e.target.value) : y)));
        }
    }
    
    return (
        <div className="table-responsive mt-3">
            <table className="table table table-striped table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th className="table__column-min" scope="col">#</th>
                    {columnDefinitions.map(x=> 
                        <>
                        <th key={`head-${x}`} scope="col">{x}</th>
                        </>
                    )}
                </tr>
                </thead>
                <tbody>
                {Array.from({length: data.length}, (_, i) => i).map( row =>
                    <tr>
                        <th className="table__column-min" scope="row">{rowsDefinitions[row]}</th>
                        {Array.from({length: data[row].length}, (_, i) => i).map( col =>
                            <td className="data-grid__cell" key={`${col}-${row}`}>
                                {editable ? <input value={data[row][col]} min={min} max={max} onChange={(e) => handleInput(e, row, col)} className="data-grid__cell__input" type="number"/> : data[row][col] == null ? "-" : data[row][col]}
                            </td>
                        )}
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}