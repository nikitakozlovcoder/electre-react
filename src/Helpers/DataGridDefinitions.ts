export function CreateDefinition(len: number, prefix: string): string[]{
    return Array.from({length: len}, (_, i) => `${prefix}${i+1}`);
}

export function CreateDefinitionFromDefinitor(definitor: number[], prefix: string,): string[]{
    return definitor.map(x=> `${prefix}${x+1}`);
}