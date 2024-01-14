export const urlAlive = async (url: string) => {
  try {
    // 发送一个 HEAD 请求，只获取响应头
    const response = await fetch(url, { method: 'HEAD' });
    // 返回响应的状态码是否为 200
    return response.status === 200;
  } catch (error) {
    // 如果发生错误，返回 false
    return false;
  }
}