import jwt from 'jsonwebtoken';
import { getUserCount, getUserList } from '../database/repositories/userRepository';

export default defineEventHandler(async (event) => {
  const tokenInfo = getCookie(event, 'token')
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
    const res = await getUserList(page, size)
    const count = await getUserCount()
    const handleRes = res.map(obj => {
      return {
        id: obj.id,
        name: obj.name,
        from: obj.from,
        studentId: obj.studentId,
        email: obj.email,
        phone: obj.phone
      }
    })
    return {
      ok: true,
      result: handleRes,
      sums: count
    }
  } catch(err) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: '获取招聘方列表错误'
    }))
  }
})
