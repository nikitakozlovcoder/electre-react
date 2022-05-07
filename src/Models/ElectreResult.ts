export default interface ElectreResult {
    optimalAlternativesIndxs : number[]
    paretoOptimalIndxs: number[]
    transformedAlternativesCompareMatrix: number[][]
    agreementMatrix: number[][]
    disagreementMatrix: number[][]
}