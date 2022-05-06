import TaskConstraints from "../../Models/TaskConstraints";
import CriteriaDirection from "../../Constants/CriteriaDirection";
import Constants from "../../Constants/Constants";
import React from "react";

export default function CriteriaDirectionsForm({criteries, criteriesCallback}:
        {criteries: CriteriaDirection[], criteriesCallback: (arg: CriteriaDirection[]) => void}){
   
    const handleDirection = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        criteriesCallback(criteries.map((x, i) => i == index ?  Number(e.target.value) as CriteriaDirection : x));
    }
    return (
        <form className="row">
            {criteries.map((x, i)=>
                <div className="form-group text-start">
                    <label className="mt-3 mb-2">Критерий {i+1}</label>
                    <select className="form-control" value={x.valueOf()} onChange={(e) => handleDirection(e, i)} key={i}>
                        <option value={CriteriaDirection.Max.valueOf()}>Max</option>
                        <option value={CriteriaDirection.Min.valueOf()}>Min</option>
                    </select>
                </div> 
            )}
        </form>
    )
}