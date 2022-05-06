import CriteriaDirection from "../Constants/CriteriaDirection";
import Constants from "../Constants/Constants";

export default class Electre{
    private readonly problemMatrix: number[][];
    private readonly criteriaDirections: CriteriaDirection[];
    private rankingMatrix: number[][];
    constructor(problemMatrix: number[][], rankingMatrix: number[][], criteriaDirections: CriteriaDirection[]) {
        this.problemMatrix = problemMatrix;
        this.rankingMatrix = rankingMatrix;
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
                    
                    const res = this.CompareAlternatives(currentAlternative, alternativeToCompare);
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
    private CompareAlternatives(alternative: number, compare: number) : number {
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
    
    public Solve(minAgreementIndex: number, maxDisagreementIndex: number){
        
        debugger
        const paretoOptimal = this.GetParetoOptimal();
    }
}