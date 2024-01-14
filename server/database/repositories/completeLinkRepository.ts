import type { CompleteLink } from '@prisma/client'
import prisma from '~/server/database/client'

export async function addLink(data: CompleteLink) {
    const res = await prisma.CompleteLink.create({
        data: {
            testPaper: {
                connect: {
                    id: data.testPaperId, // the id of the test paper you want to add the question to
                },
            },
            user: {
                connect: {
                    id: data.userId, // the id of the question you want to add to the test paper
                },
            }
        }
    })
    return res
}

export async function DeleteLink(questionId: number, testPaperId: number){
    const res = await prisma.CompleteLink.delete({
        where: {
            testPaperId_questionId: {
                userId,
                testPaperId
            }
        }
    })
    return res
}