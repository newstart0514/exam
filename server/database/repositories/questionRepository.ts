import type { Question } from '@prisma/client'
import prisma from '~/server/database/client'

export async function getQuestionCount(): Promise<number> {
    const res = await prisma.question.count()
    return res
}
export async function getQuestionCountByType(qaType: string): Promise<number> {
    const res = await prisma.question.count({
        where: {
            qaType
        }
    })
    return res
}

export async function getQuestionList(page: number = 1, size: number = 10): Promise<Question[] | []> {
    const skipNum = (page - 1) * size
    const res = await prisma.question.findMany({
        orderBy: {
            id: 'desc'
        },
        skip: skipNum,
        take: size
    })
    return res
}
export async function getQuestionListByType(page: number = 1, size: number = 10, qaType: string): Promise<Question[] | []> {
    const skipNum = (page - 1) * size
    const res = await prisma.question.findMany({
        where: {
            qaType
        },
        orderBy: {
            id: 'desc'
        },
        skip: skipNum,
        take: size
    })
    return res
}

export async function getQuestionsById(id: number): Promise<Question | null> {
    const res = await prisma.question.findFirst({
        where: {
            id
        }
    })
    return res
}
export async function getQuestionsByTitle(qaTitle: string): Promise<Question[] | []> {
    const res = await prisma.question.findMany({
        where: {
            qaTitle
        }
    })
    return res
}

export async function createQuestion(data: Question) {
    const question = await prisma.question.create({data})
    return question
}

export async function updateQuestion(id: number, data: Question) {
    const question = await prisma.question.update({
        where: {
            id
        },
        data
    })
    return question
}

export async function deleteQuestion(id: number) {
    const question = await prisma.question.delete({
        where: {
            id
        }
    })
    return question
} 