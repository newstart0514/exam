import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { User } from '@prisma/client'
import { getUserByName } from '../database/repositories/userRepository'

export default defineEventHandler(async (e) => {
  const { name, password } = await readBody<User>(e)

  try {
    // 获取用户
    const user = await getUserByName(name);

    if (!user || (!user.isInterviewer && !user.isAdmin)) {
      return sendError(e, createError({
        statusCode: 401,
        statusMessage: '用户错误!',
      }))
    }

    // 校验密码
    // const result = await bcrypt.compare(password, user.password)
    const result = !!(password === user.password)

    if (!result) {
      return sendError(e, createError({
        statusCode: 401,
        statusMessage: '密码错误!',
      }))
    }

    // 写入cookie
    const secret = process.env.JSON_SECRET as string
    const token = jwt.sign(
      { name: user.name, id: user.id, isInterviewer: user.isInterviewer, isAdmin: user.isAdmin },
       secret, { expiresIn: '24h' })
    setCookie(e, 'token', token, { maxAge: 24 * 3600 })

    const res = {
      id: user.id,
      name: user.name,
      from: user.from,
      isInterviewer: user.isInterviewer,
      isAdmin: user.isAdmin
    }

    return { ok: true, data: res }
  }
  catch (error) {
    console.error(error)
    return sendError(e, createError('登录失败!'))
  }
})