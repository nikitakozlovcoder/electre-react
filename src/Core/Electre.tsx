import CriteriaDirection from "../Constants/CriteriaDirection";
import ElectreResult from "../Models/ElectreResult";
import IndexType from "../Constants/IndexType";
const exactMath = require('exact-math');

export default class Electre{
    private readonly problemMatrix: number[][];
    private readonly criteriaDirections: CriteriaDirection[];
    private readonly criteriaWeights: number[];
    constructor(problemMatrix: number[][], criteriaWeights: number[], criteriaDirections: CriteriaDirection[]) {
        this.problemMatrix = problemMatrix;
        this.criteriaWeights = criteriaWeights;
        this.criteriaDirections = criteriaDirections;
    }
    
    private GetParetoOptimal(): number[]{
        const alternativesCount = this.problemMatrix[0].length;
        const paretoExcluded: number[] = [];
        for (let currentAlternative = 0; currentAlternative < alternativesCount; currentAlternative++){
            if (paretoExcluded.some(x=> x == currentAlternative)){
                continue;
            }
            
            for (let alternativeToCompare = 0; alternativeToCompare < alternativesCount; alternativeToCompare++){
                if (currentAlternative != alternativeToCompare && !paretoExcluded.some(x=> x == alternativeToCompare)) {
                    const res = this.CompareAlternativesPareto(currentAlternative, alternativeToCompare);
                    if (res == -1){
                        paretoExcluded.push(alternativeToCompare);
                        continue;
                    }
                    
                    if (res == 1){
                        paretoExcluded.push(currentAlternative);
                    }
                }
            }
        }
        return Array.from({length: alternativesCount}, (_, i) => i).filter(x=> !paretoExcluded.some(exc => exc == x));
    }
    //0 = not comparable, -1 = first better, 1 = second better
    private CompareAlternativesPareto(alternative: number, compare: number) : number {
        const criteriaCount = this.problemMatrix.length;
        let firstBetter = 0;
        let secondBetter = 0;
        let eqlCount = 0;
        for (let i = 0; i < criteriaCount; i++){
            const isMax = this.criteriaDirections[i] == CriteriaDirection.Max;
            const criteria = isMax ? this.problemMatrix[i][alternative] : -this.problemMatrix[i][alternative];
            const compareCriteria = isMax ? this.problemMatrix[i][compare] : -this.problemMatrix[i][compare];
            //TODO CHECK THIS < vs <=
            if (criteria > compareCriteria){
                firstBetter++
            }
            
            else if (criteria < compareCriteria){ 
                secondBetter++;
            }
            else {
                eqlCount++;
            }
            
        }
        if (eqlCount == criteriaCount){
            return 0;
        }
        
        if ((firstBetter + eqlCount) == criteriaCount){
            return  -1;
        }
        
        if ((secondBetter + eqlCount) == criteriaCount){
            return 1;
        }
        
        return 0;
    }

    private TransformMatrix(paretoOptimal: number[]): number[][] {
        const criteriaCount = this.problemMatrix.length;
        const alternativesCount = this.problemMatrix[0].length;
        const result = new Array(criteriaCount).fill(undefined).map(_ => new Array<number>());
        for (let i = 0; i < criteriaCount; i++){
            for (let j = 0; j < alternativesCount; j++){
                if (!paretoOptimal.some(x=> x == j)){
                    continue;
                }
                const isMax = this.criteriaDirections[i] == CriteriaDirection.Max;
                const best = isMax ? Math.max(...this.problemMatrix[i]) : Math.min(...this.problemMatrix[i]);
                const current = isMax ? exactMath.div(this.problemMatrix[i][j], best) : exactMath.div(best, this.problemMatrix[i][j]);
                result[i].push(current);
            }
        }
        return result;
    }
    
    public Solve(minAgreementIndex: number, maxDisagreementIndex: number) : ElectreResult{
        debugger
        const paretoOptimal = this.GetParetoOptimal();
        const transformedMatrix = this.TransformMatrix(paretoOptimal);
        const agreementMatrix = this.CalculateIndexMatrix(transformedMatrix, IndexType.Agreement);
        const disAgreementMatrix = this.CalculateIndexMatrix(transformedMatrix, IndexType.Disagreement);
        const optimalAlternatives = this.GetOptimalAlternatives(
            agreementMatrix, 
            disAgreementMatrix, 
            minAgreementIndex, 
            maxDisagreementIndex,
            paretoOptimal);
        
        return {
            optimalAlternativesIndxs: optimalAlternatives,
            paretoOptimalIndxs: paretoOptimal,
            transformedAlternativesCompareMatrix: transformedMatrix,
            agreementMatrix: agreementMatrix,
            disagreementMatrix: disAgreementMatrix,
        }
    }
    
    private CalculateIndex(first: number, second: number, matrix: number[][], indexType: IndexType): number {
        const criteriaCount = matrix.length;
        let index = indexType == IndexType.Agreement ? 0 : Number.MIN_VALUE;
        for (let i = 0; i < criteriaCount; i++){
            const firstCriterion = matrix[i][first];
            const secondCriterion = matrix[i][second];
            switch (indexType) {
                case IndexType.Agreement:
                    if (firstCriterion >= secondCriterion){
                        index = exactMath.add(index, this.criteriaWeights[i]);
                    }
                    break;
                case IndexType.Disagreement:
                    if (firstCriterion <= secondCriterion){
                        const d =  exactMath.sub(secondCriterion, firstCriterion);
                        index = Math.max(index, d);
                    }
                    break;
                default:
                     throw new RangeError();
            }
        }
        
        return index;
    }
    
    private CalculateIndexMatrix(matrix: number[][], indexType: IndexType): number[][] {
        const alternativesCount = matrix[0].length;
        const result = new Array(alternativesCount).fill(null).map( _ => new Array(alternativesCount));
        for (let i = 0; i <  alternativesCount; i++){
            for (let j = 0; j < alternativesCount; j++){
                result[i][j] = i == j ? null : this.CalculateIndex(i, j, matrix, indexType);
            }
        }
        return result;
    }

    private GetOptimalAlternatives(agreementMatrix: number[][],
                                   disAgreementMatrix: number[][],
                                   minAgreementIndex: number,
                                   maxDisagreementIndex: number,
                                   paretoOptimal: number[]) : number[] {
        const alternativesCount = agreementMatrix.length;
        const core = [];
        for (let i = 0; i < alternativesCount; i++){
            const minAgreement = Math.min(...agreementMatrix[i].filter(x=> x !== null && x !== undefined))
            const maxDisagreement = Math.max(...disAgreementMatrix[i].filter(x=> x !== null && x !== undefined)) 
            if (minAgreement > minAgreementIndex && maxDisagreement < maxDisagreementIndex) {
                core.push(paretoOptimal[i]);
            } 
        }
        
        return core;
    }
}