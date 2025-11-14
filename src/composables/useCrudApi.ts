import axios from '@/plugins/axios'
import { ElNotification } from 'element-plus'

interface CrudApiConfig {
  resourcePath: string
  resourceNameSingular: string
  getSuccessTitle?: string
  getListSuccessTitle?: string
  createSuccessTitle?: string
  updateSuccessTitle?: string
  deleteSuccessTitle?: string
}

/**
 * Generic CRUD API composable for resources
 * Eliminates code duplication across problem, problem-group, and other resources
 */
export function useCrudApi<T extends { _id?: string }>(config: CrudApiConfig) {
  const {
    resourcePath,
    resourceNameSingular,
  } = config

  /**
   * Get a single resource by ID
   */
  async function getOne(_id: string): Promise<T | null> {
    try {
      const resp = await axios.get(`/${resourcePath}/${_id}`)
      if (resp.data.status === 'success') {
        return resp.data.data as T
      } else {
        ElNotification({
          title: `获取${resourceNameSingular}失败（${resp.data.code}）`,
          message: resp.data.message,
          type: 'error',
        })
        return null
      }
    } catch (error) {
      ElNotification({
        title: `获取${resourceNameSingular}失败`,
        message: String(error),
        type: 'error',
      })
      return null
    }
  }

  /**
   * Get all resources
   */
  async function getAll(): Promise<T[] | null> {
    try {
      const resp = await axios.get(`/${resourcePath}`)
      if (resp.data.status === 'success') {
        return resp.data.data as T[]
      } else {
        ElNotification({
          title: `获取${resourceNameSingular}列表失败（${resp.data.code}）`,
          message: resp.data.message,
          type: 'error',
        })
        return null
      }
    } catch (error) {
      ElNotification({
        title: `获取${resourceNameSingular}列表失败`,
        message: String(error),
        type: 'error',
      })
      return null
    }
  }

  /**
   * Create or update a resource
   */
  async function createOrUpdate(
    method: 'post' | 'put',
    data: T
  ): Promise<string | null> {
    try {
      const url = `/${resourcePath}${method === 'post' ? '' : '/' + data._id}`
      const resp = await axios(url, {
        method,
        data: {
          ...data,
          _id: method === 'post' ? undefined : data._id,
        },
      })
      if (resp.data.status === 'success') {
        return resp.data.data as string // ObjectId
      } else {
        const action = method === 'post' ? '创建' : '更新'
        ElNotification({
          title: `${action}${resourceNameSingular}失败（${resp.data.code}）`,
          message: resp.data.message,
          type: 'error',
        })
        return null
      }
    } catch (error) {
      const action = method === 'post' ? '创建' : '更新'
      ElNotification({
        title: `${action}${resourceNameSingular}失败`,
        message: String(error),
        type: 'error',
      })
      return null
    }
  }

  /**
   * Create a new resource
   */
  async function create(data: T): Promise<string | null> {
    return await createOrUpdate('post', data)
  }

  /**
   * Update an existing resource
   */
  async function update(data: T): Promise<string | null> {
    return await createOrUpdate('put', data)
  }

  /**
   * Delete a resource by ID
   */
  async function remove(_id: string): Promise<boolean> {
    try {
      const resp = await axios.delete(`/${resourcePath}/${_id}`)
      if (resp.data.status === 'success') {
        return true
      } else {
        ElNotification({
          title: `删除${resourceNameSingular}失败（${resp.data.code}）`,
          message: resp.data.message,
          type: 'error',
        })
        return false
      }
    } catch (error) {
      ElNotification({
        title: `删除${resourceNameSingular}失败`,
        message: String(error),
        type: 'error',
      })
      return false
    }
  }

  return {
    getOne,
    getAll,
    create,
    update,
    remove,
    createOrUpdate,
  }
}
