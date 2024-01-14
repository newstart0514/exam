import jwt from 'jsonwebtoken';
import { getExamCount } from '~/server/database/repositories/examRepository';
import { getQuestionCount } from '~/server/database/repositories/questionRepository';
import { getUserCount } from '~/server/database/repositories/userRepository';

export default defineEventHandler(async (event) => {
  let tokenInfo = getCookie(event, 'token')
  if(!tokenInfo) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: '未登录!'
    }))
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

  let res = {
    testPaper: 0,
    question: 0,
    user: 0
  }
  try {
    const exam = await getExamCount()
    const question = await getQuestionCount()
    const user = await getUserCount()
    res.testPaper = exam
    res.question = question
    res.user = user
    return {
        ok: true,
        data: res
    }
  } catch(err) {
    return sendError(event, createError({
        statusCode: 500,
        statusMessage: '获取信息失败!'
    }))
  }
})