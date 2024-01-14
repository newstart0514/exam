import jwt from 'jsonwebtoken';
import { getQuestionsById } from '../../database/repositories/questionRepository';
import { getAnswerOne } from '~/server/database/repositories/answerRepository';

export default defineEventHandler(async (event) => {
  let userId
  let tokenInfo = getCookie(event, 'stu_token')
  if(!tokenInfo) return {ok: false}
  try {
    const info = jwt.verify(tokenInfo, process.env.JSON_SECRET);
    userId = info.id
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
    let userAnswer
    const query = getQuery(event)
    const res = await getQuestionsById(parseInt(query.id as string))
    const count = 1
    const answer = await getAnswerOne(userId, parseInt(query.id as string))
    if(answer) {
      userAnswer = answer.answer
    }
    return {
      ok: true,
      results: res,
      answer: userAnswer,
      sums: count
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '获取题目失败!'
    }))
  }
})
