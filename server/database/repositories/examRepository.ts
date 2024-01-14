import type { TestPaper } from '@prisma/client'
import prisma from '~/server/database/client'

export async function getExamCount(): Promise<number> {
    const res = await prisma.testPaper.count()
    return res;
}
export async function getExamCountByName(paperName: string): Promise<number> {
    const res = await prisma.testPaper.count({
        where: {
            paperName
        }
    })
    return res;
} 

export async function getExamList(page: number = 1, size: number = 10): Promise<TestPaper[] | []> {
    const skipNum = (page - 1) * size
    const result = await prisma.testPaper.findMany({
        orderBy: {
            id: 'desc'
        },
        skip: skipNum,
        take: size
    })
    return result
}
export async function getQuestionsById(page: number = 1, size: number = 10, id: number): Promise<TestPaper | null> {
    const skipNum = (page - 1) * size
    const result = await prisma.testPaper.findFirst({
        where: {
            id
        },
        orderBy: {
            id: 'desc'
        },
        skip: skipNum,
        take: size,
        include: {
            questions: {
                select: {
                    question: true
                }
            }
        }
    })
    return result
}

export async function getExamListByName(paperName: string): Promise<TestPaper[] | []> {
    const result = await prisma.testPaper.findMany({
        where: {
            paperName
        }
    })
    return result
}
export async function getExamById(id: number): Promise<TestPaper | null> {
    const result = await prisma.testPaper.findFirst({
        where: {
            id
        }
    })
    return result
}

export async function createExam(data: TestPaper) {
    const testPaper = await prisma.testPaper.create({data})
    return testPaper
}

export async function updateExam(id: number, data: TestPaper) {
    const testPaper = await prisma.testPaper.update({
        where: {
            id
        },
        data
    })
    return testPaper
}

export async function deleteExam(id: number) {
    const testPaper = await prisma.testPaper.delete({
        where: {
            id
        }
    })
    return testPaper
}