import React, {useState} from "react";
import TaskDimensions from "../../Models/TaskDimensions";
import Constants from "../../Constants/Constants";

export default function TaskDimensionsForm({taskDimensions, dimensionsCallback}: 
{taskDimensions: TaskDimensions, dimensionsCallback: (arg: TaskDimensions) => void}){
    const handleExperts = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dimensionsCallback({
                alternativesCount: taskDimensions.alternativesCount,
                expertsCount: Number(e.target.value),
                criteriesCount: taskDimensions.criteriesCount
            });
    }

    const handleAlternatives = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dimensionsCallback({
                alternativesCount: Number(e.target.value),
                expertsCount: taskDimensions.expertsCount,
                criteriesCount: taskDimensions.criteriesCount
            });
    }

    const handleCriteries = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dimensionsCallback({
                alternativesCount: taskDimensions.alternativesCount,
                expertsCount: taskDimensions.expertsCount,
                criteriesCount: Number(e.target.value)
            });
    }
    
    return (
        <form className="row mt-5">
            <div className="form-group col-3">
                <label>Количество экспертов</label>
                <select className="form-control" value={taskDimensions.expertsCount} onChange={handleExperts}>
                    {Array.from({length: Constants.maxDimension}, (_, i) => i + 1).map(x=> <option key={x}>{x}</option>)}
                </select>
            </div>
            
            <div className="form-group col-3">
                <label>Количество альтернатив</label>
                <select className="form-control" value={taskDimensions.alternativesCount} onChange={handleAlternatives}>
                    {Array.from({length: Constants.maxDimension-1}, (_, i) => i + 2).map(x=> <option key={x}>{x}</option>)}
                </select>
            </div>
            
            <div className="form-check col-3">
                <label>Количество критериев</label>
                <select className="form-control" value={taskDimensions.criteriesCount} onChange={handleCriteries}>
                    {Array.from({length: Constants.maxDimension}, (_, i) => i + 1).map(x=> <option key={x}>{x}</option>)}
                </select>
            </div>
        </form>
    )
    
}