import React, {useState} from 'react';
import './App.css';
import TaskDimensions from "./Models/TaskDimensions";
import TaskDimensionsForm from "./Components/TaskDimensions/TaskDimensionsForm";
import DataGrid from "./Components/DataGrid/DataGrid";
import TaskConstraintsForm from "./Components/TaskConstraints/TaskConstraintsForm";
import TaskConstraints from "./Models/TaskConstraints";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import ChangeMatrixDimensions from "./Helpers/MatrixDimensionsChanger";
import CriteriaDirectionsForm from "./Components/CriteriaDirections/CriteriaDirectionsForm";
import CriteriaDirection from "./Constants/CriteriaDirection";
import ChangeArrayLength from "./Helpers/ChangeArrayLength";
import Electre from "./Core/Electre";
import Ranking from "./Core/Ranking";
import {CreateDefinition} from "./Helpers/DataGridDefinitions";
import ElectreResult from "./Models/ElectreResult";
import ProblemOutput from "./Components/ProblemOutput/ProblemOutput";


function App() {
  const [taskDimensions, setTaskDimensions] = useState<TaskDimensions>({
    alternativesCount: 2,
    criteriesCount: 1,
    expertsCount: 1,
  });

  const [taskConstraints, setTaskConstraints] = useState<TaskConstraints>({
    minAgreementIndex: 0,
    maxDisagreementIndex: 0
  });
  const [electreResult, setElectreResult] = useState<ElectreResult>();
  const [criteriaWeights, setCriteriaWeights] = useState<number[]>();
  const [taskMatrix, setTaskMatrix] = useState<number[][]>(new Array(taskDimensions.criteriesCount).fill(null).map(()=> new Array(taskDimensions.alternativesCount).fill(undefined)));
  const [rankMatrix, setRankMatrix] = useState<number[][]>(new Array(taskDimensions.expertsCount).fill(null).map(()=> new Array(taskDimensions.criteriesCount).fill(undefined)));
  const [criteriaDirections, setCriteriaDirections] = useState<CriteriaDirection[]>(new Array(taskDimensions.criteriesCount).fill(CriteriaDirection.Max));  
  const dimensionsCallback = (dimensions: TaskDimensions) => {
    setTaskDimensions({
      alternativesCount: dimensions.alternativesCount,
      criteriesCount: dimensions.criteriesCount,
      expertsCount: dimensions.expertsCount
    });
    setTaskMatrix(x => ChangeMatrixDimensions(x, dimensions.criteriesCount, dimensions.alternativesCount));
    setRankMatrix(x => ChangeMatrixDimensions(x, dimensions.expertsCount, dimensions.criteriesCount));
    setCriteriaDirections(x => ChangeArrayLength(x, dimensions.criteriesCount, CriteriaDirection.Max));
  }

  const constraintsCallback = (constraints: TaskConstraints) => {
    setTaskConstraints({
      minAgreementIndex: constraints.minAgreementIndex,
      maxDisagreementIndex: constraints.maxDisagreementIndex  
    });
  }
  
  const handleTaskMatrix = (matrix: number[][]) => {
    setTaskMatrix(matrix);
  }
  
  const handleRankMatrix = (matrix: number[][]) => {
    setRankMatrix(matrix);
  }
  
  const solveProblem = () => {
    if (!taskMatrix || taskMatrix.some(x=> x.some(y => y == undefined))){
      toast.error("Заполните таблицу альтернатив");
      return;
    }

    if (!rankMatrix || rankMatrix.some(x=> x.some(y => y == undefined))){
      toast.error("Заполните таблицу рангов");
      return;
    }
    
    const ranking = new Ranking(rankMatrix);
    const weights = ranking.CalculateWeights();
    const electreSolver = new Electre(taskMatrix, weights, criteriaDirections);
    setCriteriaWeights(weights);
    setElectreResult(electreSolver.Solve(taskConstraints.minAgreementIndex, taskConstraints.maxDisagreementIndex))
    
  }
  const handleCriteriesDirection = (directions: CriteriaDirection[]) =>{
    setCriteriaDirections(directions);
  } 
    
  return (
      <>
        <ToastContainer />
        <div className="App container mb-5">
          <TaskDimensionsForm taskDimensions={taskDimensions} dimensionsCallback={dimensionsCallback}/>
          <TaskConstraintsForm taskConstraints={taskConstraints} constraintsCallback={constraintsCallback}/>
          <h4 className="mt-5 text-start">Направления критериев</h4>
          <CriteriaDirectionsForm criteries={criteriaDirections} criteriesCallback={handleCriteriesDirection}/>
          <h4 className="mt-5 text-start">Сравнение альтернатив</h4>
          <DataGrid data={taskMatrix} editable={true} handler={handleTaskMatrix} columnDefinitions={CreateDefinition(taskMatrix[0].length , "A")} rowsDefinitions={CreateDefinition(taskMatrix.length, "K")}/>
          <h4 className="mt-5 text-start">Ранги</h4>
          <DataGrid data={rankMatrix} editable={true} handler={handleRankMatrix} min={1}  columnDefinitions={CreateDefinition(rankMatrix[0].length, "K")} rowsDefinitions={CreateDefinition(rankMatrix.length, "E")}/>
          <button type="submit" className="btn btn-primary w-100" onClick={solveProblem}>Решить</button>
          {criteriaWeights && electreResult ? <ProblemOutput electreResult={electreResult} weights={criteriaWeights}/> : null}
        </div>
      </>
  );
}

export default App;
