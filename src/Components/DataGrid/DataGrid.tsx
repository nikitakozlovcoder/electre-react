import React, {useEffect, useRef, useState} from "react";

export  interface DataGridProps {
    data: number[][]
    editable: boolean,
    handler?: (arg: number[][]) => void, 
}

export default function DataGrid({data, editable, handler} : DataGridProps){
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
        if (handler) {
            handler(data.map((x, i) => x.map((y, j) => i == row && j == col ? Number(e.target.value) : y)));
        }
    }
    
    return (
        <div className="table-responsive mt-3">
            <table className="table table table-striped table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th className="table__column-min" scope="col">#</th>
                    {Array.from({length: data[0].length}, (_, i) => i).map(x=> 
                        <>
                        <th key={`head-${x}`} scope="col">{x+1}</th>
                        </>
                    )}
                </tr>
                </thead>
                <tbody>
                {Array.from({length: data.length}, (_, i) => i).map( row =>
                    <tr>
                        <th className="table__column-min" scope="row">{row+1}</th>
                        {Array.from({length: data[row].length}, (_, i) => i).map( col => 
                            <>
                            <td className="data-grid__cell" key={`${col}-${row}`}>
                                {editable ? <input value={data[row][col]} onChange={(e) => handleInput(e, row, col)} className="data-grid__cell__input" type="number"/> : "some data"}
                            </td>
                            </>
                        )}
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}