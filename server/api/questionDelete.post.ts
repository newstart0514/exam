import { deleteQuestion } from "../database/repositories/questionRepository"
import { getTokenInfo } from "../database/service/token"

export default defineEventHandler(async (event) => {
    const questionId = await readBody<number>(event)
    // 获取token里面的信息
    const useInfo = getTokenInfo(event)
    if(useInfo instanceof createError) {
        return sendError(event, useInfo)
    }
    try {
        const res = await deleteQuestion(questionId)
        return {
            ok: true,
            data: {
                id: questionId
            }
        }
    } catch(err) {
        console.error(err)
        return sendError(event, createError('删除失败!'))
    }
})