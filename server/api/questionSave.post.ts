import type { Question } from '@prisma/client'
import { getTokenInfo } from "../database/service/token"
import { createQuestion, updateQuestion } from '../database/repositories/questionRepository'
import { updateAnswer } from '../database/repositories/answerRepository'
import { createExamAnswer, getExamAnswer, updateExamAnswer } from '../database/repositories/examAnswerRepository'

type questionAndAnswer = Question & {
  answer: string
}

export default defineEventHandler(async (event) => {
  const {answer, ...questionInfo} = await readBody<questionAndAnswer>(event)
  let answerData = {
    answer: answer,
    createAt: new Date()
  }
  // 获取token里面的信息
  const useInfo = getTokenInfo(event)
  if(useInfo instanceof createError) {
    return sendError(event, useInfo)
  }
  try {
    let res
    let answerRes
    let examAnswer
    if(!questionInfo.qaTitle || !questionInfo.qaType || !questionInfo.score) {
      return sendError(event, createError('保存失败！'))
    }
    if(questionInfo.id) {
      res = await updateQuestion(questionInfo.id, questionInfo)
      examAnswer = await getExamAnswer(questionInfo.id)
    } else {
      res = await createQuestion(questionInfo)
    }
    if(examAnswer) {
      answerData.qaId = questionInfo.id
      answerData.id = examAnswer!.id
      answerRes = await updateExamAnswer(examAnswer!.id, answerData)
    } else {
      answerData.qaId = res.id
      answerRes = await createExamAnswer(answerData)
    }
    return {
      ok: true,
      data: {
        id: res!.id
      }
    }
  } catch(err) {
    console.error(err)
    return sendError(event, createError('保存失败!'))
  }
})
