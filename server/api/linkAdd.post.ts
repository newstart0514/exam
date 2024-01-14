import type { Link } from '@prisma/client'
import { getTokenInfo } from "../database/service/token"
import { addLink } from '../database/repositories/linkRepository'

export default defineEventHandler(async (event) => {
  const linkInfo = await readBody<Link>(event)
  // 获取token里面的信息
  const useInfo = getTokenInfo(event)
  if(useInfo instanceof createError) {
    return sendError(event, useInfo)
  }
  try {
    if(!linkInfo.questionId || !linkInfo.testPaperId) {
      return sendError(event, createError('保存失败!'))
    }
    const res = await addLink(linkInfo)
    return {
      ok: true,
      data: res
    }
  } catch(err) {
    console.error(err)
    return sendError(event, createError('保存失败!'))
  }
})
