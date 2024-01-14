import jwt from 'jsonwebtoken';
import { getAnswerOne } from '~/server/database/repositories/answerRepository';
import { getExamAnswer } from '~/server/database/repositories/examAnswerRepository';
import { getExamById, getQuestionsById } from '~/server/database/repositories/examRepository';
import { getUserById } from '~/server/database/repositories/userRepository';

type bodyType = {
    userId: number,
    examId: number
}
export default defineEventHandler(async (event) => {
    const body = await readBody<bodyType>(event)
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
    } catch(e) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'token无效!'
        }))
  }

  // 旧版本
//   let res = {
//     examAnswers: [],
//     testPaper: [],
//     answers: []
//   }
//   try {
//     const exam = await getExamById(body.examId)
//     if(exam && exam.id) {
//         const question = await getQuestionsById(1, 1, body.examId)
//         if(question && question.questions) {
//             const ques = question.questions
//             for(let i = 0; i < ques.length; i++) {
//                 res.testPaper.push(ques[i].question)
//                 const examAnswer = await getExamAnswer(ques[i].question.id)
//                 if(examAnswer) {
//                     const exam = {
//                         qaId: examAnswer.qaId,
//                         answer: examAnswer.answer
//                     }
//                     res.examAnswers.push(exam)
//                 }
//                 const resq = await getAnswerOne(body.userId, ques[i].question.id)
//                 if(resq) {
//                     const ans = {
//                         qaId: resq.qaId,
//                         answer: resq.answer
//                     }
//                     res.answers.push(ans)
//                 }
//             }
//         }
//     }
  // 新版本
  let res = ''
  const chooseStr = ['A', 'B', 'C', 'D', 'E', 'F', 'F', 'G', 'H', 'I', 'J', 'k']
  try {
    const exam = await getExamById(body.examId)
    const question = await getQuestionsById(1, 1, body.examId)
    const userInfo = await getUserById(body.userId)
    if(!userInfo) {
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: '用户不存在!'
        }))
    }
    // 信息模块
    const title = `<center><h2>${exam?.paperName}</h2></center>\r\n\r`
    res = `${res}${title}`
    // 考题模块
    let score = 0
    let sum = 0
    if(exam && exam.id && question && question.questions) {
        const ques = question.questions
        for(let i = 0; i < ques.length; i++) {
            const examAnswer = await getExamAnswer(ques[i].question.id)
            const resq = await getAnswerOne(body.userId, ques[i].question.id)
            let quesStr = `${i+1}.${ques[i].question.qaTitle}`
            let examAnswerStr = '正确答案：'
            let userAnswerStr = '考生答案：'
            if(ques[i].question.qaContent) {
                const strArr = ques[i].question.qaContent.split('\r\n')
                for(let i = 0; i < strArr.length; i++) {
                    strArr[i] = `&nbsp;&nbsp;&nbsp;&nbsp;${chooseStr[i]}.${strArr[i]}`
                }
                const content = strArr.join('\r\n')
                quesStr = `${quesStr}\r\n${content}`
            }
            if(ques[i].question.qaType === 'code') {
                let answerArr
                let code
                if(resq) {
                    answerArr = resq?.answer.split('\r\n&line*\r\n')
                    code = '```'+ answerArr[0] + '\r\n' + answerArr[1] + '\r\n' + '```'
                }
                userAnswerStr = `${userAnswerStr}\r${code ? code : '考生未作答'}`
                examAnswerStr = `${examAnswerStr}\r${examAnswer?.answer ? examAnswer.answer : '无'}`
            } else if(ques[i].question.qaType === 'mind') {
                userAnswerStr = `${userAnswerStr}\r${resq?.answer ? resq.answer : '`考生未作答`'}`
                examAnswerStr = `${examAnswerStr}\r${examAnswer?.answer ? examAnswer.answer : '`无`'}`
            } else {
                userAnswerStr = `${userAnswerStr}${resq?.answer ? '`' + resq.answer + '`' : '`考生未作答`'}`
                examAnswerStr = `${examAnswerStr}${examAnswer?.answer ? '`' + examAnswer.answer + '`' : '`无`'}`
                if(resq?.result) score += parseInt(resq?.result as string)
            }
            sum += ques[i].question.score
            const bottomStr = `${examAnswerStr}\r\n${userAnswerStr}\r\n`
            res = `${res}${quesStr}\r\n${bottomStr}\r`
        }
    }
    return {
        ok: true,
        data: res,
        user: {
            name: userInfo?.name,
            from: userInfo?.from,
            studentId: userInfo?.studentId,
            email: userInfo?.email,
            phone: userInfo?.phone,
            score: `${score}/${sum}`
        }
    }
  } catch(err) {
    return sendError(event, createError({
        statusCode: 500,
        statusMessage: '获取用户试卷失败!'
    }))
  }
})