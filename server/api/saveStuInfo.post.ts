import type { User } from "@prisma/client"
import { createUser, getUserByStudentId, updateUser } from "../database/repositories/userRepository"
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const info = await readBody<User>(event)

  try {
    // 参数是否齐全
    if(!info.name || !info.from || !info.email || !info.phone || !info.studentId) {
      return createError({
        statusCode: 400,
        statusMessage: '参数错误'
      })
    }

    // 禁止设置管理员和面试官标识字段  密码
    if(info.isAdmin || info.isInterviewer || info.password) {
      return createError({
        statusCode: 400,
        statusMessage: '参数错误'
      })
    }

    // 验证学号是否存在
    const result = await getUserByStudentId(info.studentId)
    if(result?.isAdmin || result?.isInterviewer) {
      return createError({
        statusCode: 500,
        statusMessage: '用户信息有误！'
      })
    }
    let res
    if(result === null) {
      // 不存在，创建账号
      res = await createUser(info);
    } else {
      // 存在，更新账号
      res = await updateUser(result.id, info)
    }
    const obj = {
      id: res.id,
      name: res.name,
      studentId: res.studentId
    }
    const secret = process.env.JSON_SECRET as string
    const token = jwt.sign(obj, secret, { expiresIn: '24h' })
    setCookie(event, 'stu_token', token, { maxAge: 24 * 3600 })
    return {
      ok: true,
      data: token
    }
  } catch(err) {
    return createError({
      statusCode: 500,
      statusMessage: '保存个人信息错误'
    })
  }
})
