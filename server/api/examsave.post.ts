import type { TestPaper } from "@prisma/client"
import { createExam, updateExam } from "../database/repositories/examRepository";
import { getTokenInfo } from "../database/service/token";

export default defineEventHandler(async (event) => {
  const examInfo = await readBody<TestPaper>(event)
  // 获取token里面的信息
  const useInfo = getTokenInfo(event)
  if(useInfo instanceof createError) {
    return sendError(event, useInfo)
  }
  try {
    let res
    if(!examInfo.paperName || !examInfo.paperCode || !examInfo.startTime || !examInfo.endTime) {
      return sendError(event, createError('保存失败!'))
    }
    examInfo.createAt = new Date()
    if(examInfo.id) {
      res = await updateExam(examInfo.id, examInfo)
    } else {
      res = await createExam(examInfo)
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