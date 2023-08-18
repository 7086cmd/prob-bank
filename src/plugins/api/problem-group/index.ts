import axios from '@/plugins/axios'
import type { ProblemGroup } from '@/../@types/problem-group'
import { ElNotification } from 'element-plus'

export async function getProblemGroup(_id: string) {
  const resp = await axios.get('/problem-group/' + _id)
  if (resp.data.status === 'success') {
    return resp.data.data as ProblemGroup
  } else {
    ElNotification({
      title: `获取题组失败（${resp.data.code}）`,
      message: resp.data.message,
      type: 'error',
    })
    return null
  }
}

export async function createProblemGroup(
  method: 'post' | 'put',
  data: ProblemGroup
) {
  const resp = await axios(
    `/problem-group/${method === 'post' ? '' : data._id}`,
    {
      method,
      data: {
        ...data,
        _id: method === 'post' ? undefined : data._id,
      },
    }
  )
  if (resp.data.status === 'success') {
    return resp.data.data as string // ObjectId
  } else {
    ElNotification({
      title:
        method === 'post' ? '创建' : '更新' + `题组失败（${resp.data.code}）`,
      message: resp.data.message,
      type: 'error',
    })
    return null
  }
}

export async function postProblemGroup(data: ProblemGroup) {
  return await createProblemGroup('post', data)
}

export async function putProblemGroup(data: ProblemGroup) {
  return await createProblemGroup('put', data)
}

export async function deleteProblemGroup(_id: string) {
  const resp = await axios.delete('/problem-group/' + _id)
  if (resp.data.status === 'success') {
    return true
  } else {
    ElNotification({
      title: `删除题组失败（${resp.data.code}）`,
      message: resp.data.message,
      type: 'error',
    })
    return false
  }
}
