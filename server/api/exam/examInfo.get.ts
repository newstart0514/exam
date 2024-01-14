import { getQuestionsById } from "../../database/repositories/examRepository";
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  let tokenInfo = getCookie(event, 'stu_token')
  if(!tokenInfo) return {ok: false}
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
    let qaInfo = {
      'single': 0,
      'multiple': 0,
      'blank': 0,
      'mind': 0,
      'code': 0
    }
    let scores = {
      'single': 0,
      'multiple': 0,
      'blank': 0,
      'mind': 0,
      'code': 0
    }
    let ids = {
      'single': [],
      'multiple': [],
      'blank': [],
      'mind': [],
      'code': []
    }
    if(query.id) {
      res = await getQuestionsById(page, size, parseInt(query.id as string))
      const qa = res!.questions
      for(let i = 0; i < qa.length; i++) {
        qaInfo[qa[i].question.qaType]++
        scores[qa[i].question.qaType] += qa[i].question.score
        ids[qa[i].question.qaType].push(qa[i].question.id)
      }
    }
    return {
      ok: true,
      results: scores,
      sums: qaInfo,
      ids: ids
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '获取试卷列表失败'
    }))
  }
})
