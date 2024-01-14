import type { User } from '@prisma/client'
import { getTokenInfo } from "../database/service/token"
import { createUser, getUserByName, updateUser } from '../database/repositories/userRepository'

export default defineEventHandler(async (event) => {
  const info = await readBody<User>(event)
  // 获取token里面的信息
  const useInfo = getTokenInfo(event)
  if(useInfo instanceof createError) {
    return sendError(event, useInfo)
  }
  try {
    // 参数是否齐全
    if(!info.name) {
      return createError({
        statusCode: 400,
        statusMessage: '参数错误'
      })
    }
    // 禁止设置管理员和面试官标识字段  密码
    if(info.isAdmin || !info.isInterviewer || (!info.id && !info.password)) {
      return createError({
        statusCode: 400,
        statusMessage: '参数错误'
      })
    }
    // 判断是否存在相同账号
    const result = await getUserByName(info.name)
    if(result && !info.id) {
      return createError({
        statusCode: 400,
        statusMessage: '账号已存在'
      })
    }
    let res
    if(info.id) {
      res = await updateUser(info.id, info)
    } else {
      res = await createUser(info)
    }
    return {
      ok: true,
      data: {
        msg: '招聘方信息保存成功!'
      }
    }
  } catch(err) {
    console.error(err)
    return sendError(event, createError('招聘方信息保存失败!'))
  }
})
