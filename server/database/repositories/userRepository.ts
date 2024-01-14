import type { User } from '@prisma/client'
import prisma from '~/server/database/client'

export async function getUserCount(): Promise<number> {
  const res = await prisma.user.count({
    where: {
      isInterviewer: true,
      isAdmin: false
    }
  })
  return res
}

export async function getUserList(page: number = 1, size: number = 10): Promise<User[] | []> {
  const skipNum = (page - 1) * size
  const result = await prisma.user.findMany({
    where: {
      isInterviewer: true,
      isAdmin: false
    },
    orderBy: {
      id: 'desc'
    },
    skip: skipNum,
    take: size
  })
  return result
}

export async function getUserByName(name: string): Promise<User | null> {
  const result = await prisma.user.findFirst({
    where: {
      name,
    },
  })
  return result
}

export async function getUserByStudentId(studentId: string): Promise<User | null> {
    const result = await prisma.user.findFirst({
      where: {
        studentId,
      },
    })
    return result
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await prisma.user.findFirst({
    where: {
      id,
    },
  })
  return result
}

export async function createUser(data: User) {
  const user = await prisma.user.create({ data })
  return user
}

export async function updateUser(id: number, data: Partial<User>) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  })
  return user
}

export async function deleteUser(id: number) {
  const user = await prisma.user.delete({
    where: {
      id,
    }
  })
  return user
}