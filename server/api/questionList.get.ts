import jwt from 'jsonwebtoken';
import { getQuestionCount, getQuestionCountByType, getQuestionList, getQuestionListByType, getQuestionsById, getQuestionsByTitle } from "../database/repositories/questionRepository";
import { getExamAnswer } from '../database/repositories/examAnswerRepository';

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

  try {
    const query = getQuery(event)
    const page = query.page ? parseInt(query.page as string) : 1
    const size = query.size ? parseInt(query.size as string) : 10
    let res
    let count
    let answer
    if(query.id) {
      res = await getQuestionsById(parseInt(query.id as string))
      answer = await getExamAnswer(parseInt(query.id as string))
      count = 1
    } else if(query.title) {
      res = await getQuestionsByTitle(query.title as string)
      count = res.length
    } else if(query.type) {
      res = await getQuestionListByType(page, size, query.type as string)
      count = await getQuestionCountByType(query.type as string)
    } else {
      res = await getQuestionList(page, size)
      count = await getQuestionCount()
    }
    return {
      ok: true,
      result: res,
      answer: answer,
      sums: count
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '获取题目集合出错'
    }))
  }
})
