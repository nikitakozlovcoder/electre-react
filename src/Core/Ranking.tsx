const exactMath = require('exact-math');

//класс, представляет матрицу оценок важности критериев экспертами
export default class Ranking{
    private readonly rankingMatrix: number[][];
    constructor(rankingMatrix: number[][]) {
        this.rankingMatrix = rankingMatrix;
    }
    
    //подсчет весов критериев
    public CalculateWeights(): number[] {
        const criteriaCount = this.rankingMatrix[0].length;
        const expertsCount = this.rankingMatrix.length;
        const res = [];
        for (let j = 0; j < criteriaCount; j++){
            let criterion = 0;
            for (let i = 0; i < expertsCount; i++){
                const sum = this.rankingMatrix[i].reduce((accumulator, rank) => accumulator + rank, 0);
                criterion += exactMath.div(this.rankingMatrix[i][j], sum);
            }
            res.push(criterion / expertsCount);
        }
        
        return res;
    }
}