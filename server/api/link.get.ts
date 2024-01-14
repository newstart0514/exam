import { getQuestionsById } from "../database/repositories/examRepository";
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  // 获取token
  const token = getCookie(event, 'token')
  if(!token) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: '未登录!'
    }))
  }

  try {
    const info = jwt.verify(token, process.env.JSON_SECRET);
    const now = Date.now() / 1000;
    if(info.exp < now) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: 'token过期!'
      }))
    }
  } catch(e) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'token无效!'
    }))
  }

  try {
    const query = getQuery(event)
    const page = query.page ? parseInt(query.page as string) : 1
    const size = query.size ? parseInt(query.size as string) : 10
    let res
    let count
    if(query.id) {
      res = await getQuestionsById(page, size, parseInt(query.id as string))
      count = 1
    }
    return {
      ok: true,
      result: res,
      sums: count
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '获取试卷列表失败'
    }))
  }
})
