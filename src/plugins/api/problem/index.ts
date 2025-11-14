import type { AllProblem } from '@/../@types/problem'
import { useCrudApi } from '@/composables/useCrudApi'

// Create a problem API instance using the generic CRUD composable
const problemApi = useCrudApi<AllProblem>({
  resourcePath: 'problem',
  resourceNameSingular: '题目',
})

// Export with original function names for backward compatibility
export const getProblem = problemApi.getOne
export const getProblems = problemApi.getAll
export const postProblem = problemApi.create
export const putProblem = problemApi.update
export const deleteProblem = problemApi.remove

// Export the createProblem function for backward compatibility
export async function createProblem(method: 'post' | 'put', data: AllProblem) {
  return await problemApi.createOrUpdate(method, data)
}
