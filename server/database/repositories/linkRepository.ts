import type { Link } from '@prisma/client'
import prisma from '~/server/database/client'

// export async function getLinkByPaperId(paperId: number): Promise<Link[] | []> {
//     const res = await prisma.Link.findMany({
//         where: {
//             paperId
//         }
//     })
//     return res
// }

export async function addLink(data: Link) {
    const res = await prisma.Link.create({
        data: {
            testPaper: {
                connect: {
                    id: data.testPaperId, // the id of the test paper you want to add the question to
                },
            },
            question: {
                connect: {
                    id: data.questionId, // the id of the question you want to add to the test paper
                },
            }
        }
    })
    return res
}

export async function DeleteLink(questionId: number, testPaperId: number){
    const res = await prisma.Link.delete({
        where: {
            testPaperId_questionId: {
                questionId,
                testPaperId
            }
        }
    })
    return res
}