import type { Answer } from '@prisma/client'
import prisma from '~/server/database/client'

export async function getAnswerByUserId(userId: number): Promise<Answer[] | []> {
    const res = await prisma.answer.findMany({
        where: {
            userId
        }
    })
    return res
}

export async function getAnswerOne(userId: number, qaId: number): Promise<Answer | null> {
    const res = await prisma.answer.findFirst({
        where: {
            userId,
            qaId
        }
    })
    return res
}

export async function createAnswer(data: Answer) {
    const res = await prisma.answer.create({data})
    return res
}

export async function deleteAnswer(id: number) {
    const res = await prisma.answer.delete({
        where: {
            id
        }
    })
    return res
}

export async function updateAnswer(id: number, data: Answer): Promise<Answer | null> {
    const res = await prisma.answer.update({
        where: {
            id
        },
        data
    })
    return res
}