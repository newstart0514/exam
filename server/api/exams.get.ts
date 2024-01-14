import { getExamCount, getExamList } from "../database/repositories/examRepository"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = query.page ? parseInt(query.page as string) : 1
    const size = query.size ? parseInt(query.size as string) : 10
    const res = await getExamList(page, size)
    const arr =  res.map(item => {
      return {
        id: item.id,
        paperName: item.paperName,
        desc: item.desc,
        startTime: item.startTime,
        endTime: item.endTime
      }
    })
    const count = await getExamCount()
    return {
      result: arr,
      sums: count
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '获取试卷列表失败'
    }))
  }
})
