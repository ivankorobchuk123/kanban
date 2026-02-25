export enum TaskAlias {
    NEW = 'new',
    IN_PROGRESS = 'in-progress',
    DONE = 'done',
}


export interface TaskDto {
    id: string
    title: string
    variant: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export interface BoardDto {
    id: string
    alias: string
    title: string
}