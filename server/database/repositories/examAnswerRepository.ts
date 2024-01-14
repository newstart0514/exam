import type { ExamAnswer } from '@prisma/client'
import prisma from '~/server/database/client'

export async function getExamAnswer(qaId: number): Promise<ExamAnswer | null> {
    const res = await prisma.examAnswer.findFirst({
        where: {
            qaId
        }
    })
    return res
}

export async function createExamAnswer(data: ExamAnswer) {
    const examAnswer = await prisma.examAnswer.create({data})
    return examAnswer
}

export async function updateExamAnswer(id: number, data: ExamAnswer) {
    const examAnswer = await prisma.examAnswer.update({
        where: {
            id
        },
        data
    })
    return examAnswer
}

export async function deleteExamAnswer(id: number) {
    const examAnswer = await prisma.examAnswer.delete({
        where: {
            id
        }
    })
    return examAnswer
}