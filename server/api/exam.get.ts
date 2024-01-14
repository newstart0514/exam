import { getExamById } from "../database/repositories/examRepository"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    if(!query.id) {
      return createError({
        statusCode: 400,
        statusMessage: '试卷不存在!'
      })
    }
    const { createAt ,...res} = await getExamById(parseInt(query.id as string))
    return res    
  } catch(err) {
    return createError({
      statusCode: 500,
      statusMessage: '获取试卷错误'
    })
  }
})
