import axios from '@/plugins/axios'
import type { AllProblem } from '@/../@types/problem'
import { ElNotification } from 'element-plus'

export async function getProblem(_id: string) {
  const resp = await axios.get('/problem/' + _id)
  if (resp.data.status === 'success') {
    return resp.data.data as AllProblem
  } else {
    ElNotification({
      title: `获取题目失败（${resp.data.code}）`,
      message: resp.data.message,
      type: 'error',
    })
    return null
  }
}

export async function getProblems() {
  const resp = await axios.get('/problem')
  if (resp.data.status === 'success') {
    return resp.data.data as AllProblem[]
  } else {
    ElNotification({
      title: `获取题目列表失败（${resp.data.code}）`,
      message: resp.data.message,
      type: 'error',
    })
    return null
  }
}

export async function createProblem(method: 'post' | 'put', data: AllProblem) {
  const resp = await axios(
    `/problem${method === 'post' ? '' : '/' + data._id}`,
    {
      method,
      data,
    }
  )
  if (resp.data.status === 'success') {
    return resp.data.data as string // ObjectId
  } else {
    ElNotification({
      title:
        method === 'post' ? '创建' : '更新' + `题目失败（${resp.data.code}）`,
      message: resp.data.message,
      type: 'error',
    })
    return null
  }
}

export async function postProblem(data: AllProblem) {
  return await createProblem('post', data)
}

export async function putProblem(data: AllProblem) {
  return await createProblem('put', data)
}

export async function deleteProblem(_id: string) {
  const resp = await axios.delete('/problem/' + _id)
  if (resp.data.status === 'success') {
    return true
  } else {
    ElNotification({
      title: `删除题目失败（${resp.data.code}）`,
      message: resp.data.message,
      type: 'error',
    })
    return false
  }
}
