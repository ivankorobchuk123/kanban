import type { StatusOption } from '@/app/store/statusOptions';

export interface TaskDto {
    id: number | string
    title: string
    status: StatusOption
    comments?: string
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