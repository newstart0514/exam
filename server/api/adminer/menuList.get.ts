import jwt from 'jsonwebtoken';

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
    let route: string[][] = []
    if(info.isAdmin) {
      route = [
        ['/', '首页', 'icon-quanbuguanli'],
        ['/exam', '考试管理', 'icon-kaoshixinxi'],
        ['/paper', '试卷管理', 'icon-piyueguanli'],
        ['/question', '试题管理', 'icon-tiqiatiku'],
        ['/manger', '招聘方账号管理', 'icon-jiaoshiguanli']
      ]
    } else if(info.isInterviewer) {
      route = [
        ['/', '首页', 'icon-quanbuguanli'],
        ['/exam', '考试管理', 'icon-kaoshixinxi'],
        ['/paper', '试卷管理', 'icon-piyueguanli'],
        ['/question', '试题管理', 'icon-tiqiatiku']
      ]
    }
    return {
      ok: true,
      data: route
    }
  } catch(e) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'token无效!'
    }))
  }
})
