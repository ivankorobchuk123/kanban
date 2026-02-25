export enum TaskAlias {
    NEW = 'new',
    IN_PROGRESS = 'in-progress',
    DONE = 'done',
}


export interface TaskDto {
    id: number | string
    title: string
    variant: 'primary' | 'secondary' | 'danger' | 'ghost'
    assignee?: {
        name: string
        src: string
    }
}

export interface BoardDto {
    id: string
    alias: string
    title: string
}