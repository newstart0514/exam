import { deleteUser, getUserById } from "../database/repositories/userRepository"
import { getTokenInfo } from "../database/service/token"

export default defineEventHandler(async (event) => {
  const userId = await readBody<number>(event)
  // 获取token里面的信息
  const useInfo = getTokenInfo(event)
  if(useInfo instanceof createError) {
    return sendError(event, useInfo)
  }
  try {
    const user = await getUserById(userId)
    if(user && user.isAdmin) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: '禁止删除该账号!'
      }))
    }
    const res = await deleteUser(userId)
    return {
      ok: true,
      data: {
        msg: '删除账号成功!'
      }
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '删除账号失败!'
    }))
  }
})
