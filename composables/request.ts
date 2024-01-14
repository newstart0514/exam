import { merge } from 'lodash'

type FetchType = typeof $fetch
type ReqType = Parameters<FetchType>[0]
type FetchOptions = Parameters<FetchType>[1]
import { Message } from '@arco-design/web-vue';

export function httpRequest<T = unknown>(
  method: any,
  url: ReqType,
  bodyOrParams?: any,
  opts?: FetchOptions,
) {
  const token = useCookie('token')
  const router = useRouter()
  const route = useRoute()

  const defaultOpts = {
    method,
    // baseURL: '/api',
    headers: { token: token.value } as any,
    onRequestError() {
      Message.error('请求出错，请重试！')
    },
    onResponseError({ response }) {
      switch (response.status) {
        case 400:
          Message.error('参数错误')
          break
        case 401:
          Message.error('没有访问权限')
          router.push(`/login?callback=${route.path}`)
          break
        case 402:
          Message.error('考试信息错误')
          router.push('/examList')
        case 403:
          Message.error('服务器拒绝访问')
          break
        case 404:
          Message.error('请求地址错误')
          break
        case 500:
          Message.error('服务器故障')
          break
        default:
          Message.error('网络连接故障')
          break
      }
    },
  } as FetchOptions
  if (defaultOpts) {
    if (method === 'post')
      defaultOpts.body = bodyOrParams
    else
      defaultOpts.params = bodyOrParams
  }
  return $fetch<T>(url, merge(defaultOpts, opts))
}

export function httpPost<T = unknown>(
  request: ReqType,
  body?: any,
  opts?: FetchOptions,
) {
  return httpRequest<T>('post', request, body, opts)
}

export function httpGet<T = unknown>(
  request: ReqType,
  opts?: FetchOptions,
) {
  return httpRequest<T>('get', request, null, opts)
}