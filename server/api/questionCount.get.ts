import jwt from 'jsonwebtoken';
import { getQuestionCount, getQuestionCountByType } from "../database/repositories/questionRepository";

export default defineEventHandler(async (event) => {
  const stu_token = getCookie(event, 'stu_token')
  const token = getCookie(event, 'token')
  if(!token && !stu_token) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: '获取用户信息失败!'
    }))
  }

  let tokenInfo
  if(token) {
    tokenInfo = token
  } else {
    tokenInfo = stu_token
  }
  try {
    const info = jwt.verify(tokenInfo, process.env.JSON_SECRET);
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

  const questionNameArr = ['single', 'multiple','blank','mind','code']
  try {
    const query = getQuery(event)
    let res
    questionNameArr.map(async item => {
        const resq = await getQuestionCountByType(item)
        res.push(resq)
    })
    return {
      ok: true,
      result: res,
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '获取题目集合出错'
    }))
  }
})
