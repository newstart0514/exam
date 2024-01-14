import jwt from 'jsonwebtoken';
import type { Answer } from '@prisma/client'
import { createAnswer, getAnswerOne, updateAnswer } from '~/server/database/repositories/answerRepository';
import { getExamAnswer } from '~/server/database/repositories/examAnswerRepository';
import { getQuestionsById } from '~/server/database/repositories/questionRepository';

type submit = {
  qaId: number,
  answer: string
}

export default defineEventHandler(async (event) => {
  let tokenInfo = getCookie(event, 'stu_token')
  const body = await readBody<submit>(event)
  let answer = <Answer>{
    answer: body.answer,
    result: '0',
    qaId: body.qaId,
    createAt: new Date()
  }
  if(!tokenInfo) return {ok: false}
  try {
    const info = jwt.verify(tokenInfo, process.env.JSON_SECRET);
    answer.userId = info.id
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
    const examAnswer = await getExamAnswer(body.qaId)
    const questionInfo = await getQuestionsById(body.qaId)
    const preAnswer = await getAnswerOne(answer.userId, answer.qaId)
    if(preAnswer) answer.id = preAnswer.id
    if(questionInfo && (questionInfo.qaType === 'single' || questionInfo.qaType === 'multiple' || questionInfo.qaType === 'blank')) {
      if(examAnswer && examAnswer.answer === answer.answer) {
        answer.result = `${questionInfo.score}`
      }
    }
    let res
    if(answer.id) {
      res = await updateAnswer(answer.id, answer)
    } else {
      res = await createAnswer(answer)
    }
    return {
      ok: true,
      data: {
        msg: '创建答案成功!'
      }
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '创建答案失败'
    }))
  }
})
