import TaskDimensions from "../../Models/TaskDimensions";
import Constants from "../../Constants/Constants";
import React from "react";
import TaskConstraints from "../../Models/TaskConstraints";

export default function TaskConstraintsForm({taskConstraints, constraintsCallback}:
                                                {taskConstraints: TaskConstraints, constraintsCallback: (arg: TaskConstraints) => void}) {
    const handleDisagreement = (e: React.ChangeEvent<HTMLInputElement>) => {
        constraintsCallback({
            maxDisagreementIndex: Number(e.target.value),
            minAgreementIndex: taskConstraints.minAgreementIndex
        });
    }

    const handleAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
        constraintsCallback({
            maxDisagreementIndex: taskConstraints.maxDisagreementIndex,
            minAgreementIndex: Number(e.target.value)
        });
    }
    return (
        <form className="row mt-1">
            <div className="form-group col-3">
                <label>Минимальный идекс согласия</label>
                <input type="number" min={0} max={1} step={0.1} className="form-control" value={taskConstraints.minAgreementIndex} onChange={handleAgreement}/>
            </div>

            <div className="form-group col-3">
                <label>Максимальный индекс несогласия</label>
                <input type="number" min={0} max={1} step={0.1} className="form-control" value={taskConstraints.maxDisagreementIndex} onChange={handleDisagreement}/>
            </div>
        </form>
    )
}