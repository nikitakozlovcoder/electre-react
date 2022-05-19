import ElectreResult from "../../Models/ElectreResult";
import {Tab, Tabs} from "react-bootstrap";
import {CreateDefinition, CreateDefinitionFromDefinitor} from "../../Helpers/DataGridDefinitions";
import DataGrid from "../DataGrid/DataGrid";
import React from "react";

interface ProblemOutputProps {
    weights: number[]
    electreResult: ElectreResult
}

export default function ProblemOutput({weights, electreResult} : ProblemOutputProps) {
    
    const coreDefinition = (definition: string[]) => {
        return (
            <ul className="list-group list-group-flush mt-2">
                {definition.map(x => 
                    <li key={x} className="list-group-item text-start">
                        <h5>{x}</h5>
                    </li> 
                )}
            </ul>
        )
    }
    
    return (
        <div className="mb-5 pb-5">
            <Tabs defaultActiveKey="core" className="mt-5">
                <Tab eventKey="core" title="Ядро">
                    {electreResult.optimalAlternativesIndxs.length > 0 ? coreDefinition(CreateDefinitionFromDefinitor(electreResult.optimalAlternativesIndxs, "A")) : "Ядро задачи пустое"}
                </Tab>
                <Tab eventKey="transformed" title="Преобразованная матрица">
                    <DataGrid data={electreResult.transformedAlternativesCompareMatrix} editable={false} columnDefinitions={CreateDefinitionFromDefinitor(electreResult.paretoOptimalIndxs , "A")} rowsDefinitions={CreateDefinition(electreResult.transformedAlternativesCompareMatrix.length, "K")}/>
                </Tab>
                <Tab eventKey="agreement" title="Матрица согласия">
                    <DataGrid data={electreResult.agreementMatrix} editable={false} columnDefinitions={CreateDefinitionFromDefinitor(electreResult.paretoOptimalIndxs , "A")} rowsDefinitions={CreateDefinitionFromDefinitor(electreResult.paretoOptimalIndxs , "A")}/>
                </Tab>
                <Tab eventKey="disagreement" title="Матрица несогласия" >
                    <DataGrid data={electreResult.disagreementMatrix} editable={false} columnDefinitions={CreateDefinitionFromDefinitor(electreResult.paretoOptimalIndxs , "A")} rowsDefinitions={CreateDefinitionFromDefinitor(electreResult.paretoOptimalIndxs , "A")}/>
                </Tab>
                <Tab eventKey="weights" title="Веса критериев" >
                    <DataGrid data={new Array(weights.length).fill(null).map((_, i) => [weights[i]])} editable={false} columnDefinitions={['Вес']} rowsDefinitions={CreateDefinition(weights.length , "W")}/>
                </Tab>
            </Tabs>
        </div>
    )
}