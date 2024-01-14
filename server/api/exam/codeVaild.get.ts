import { getExamById } from "../../database/repositories/examRepository"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    if(!query.code || !query.examId) {
      return createError({
        statusCode: 400,
        statusMessage: '客户端参数错误!'
      })
    }
    const exam = await getExamById(parseInt(query.examId as string))
    let res
    if(exam?.paperCode !== query.code) {
      res = 1
    } else {
      res = 0
    }
    return {
      ok: true,
      data: {
        isValid: res
      }
    }
  } catch(err) {
    return createError({
      statusCode: 500,
      statusMessage: '服务端发生错误!'
    })
  }
})
