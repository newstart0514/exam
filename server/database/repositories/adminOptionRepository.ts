import type { AdminOption } from "@prisma/client";
import prisma from '~/server/database/client'

export async function getAdminOptionByName(name: string): Promise<AdminOption | null> {
    const res = await prisma.AdminOption.findFirst({
        where: {
            name
        }
    })
    return res
}

export async function createAdminOption(data: AdminOption) {
    const res = await prisma.AdminOption.create({data})
    return res
}

export async function updateAdminOption(id: number, data: AdminOption) {
    const res = await prisma.AdminOption.update({
        where: {
            id
        },
        data
    })
    return res
}

export async function deleteAdminOption(id: number) {
    const res = await prisma.AdminOption.delete({
        where: {
            id
        },
    })
    return res
}