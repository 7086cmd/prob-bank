import type { ProblemGroup } from '@/../@types/problem-group'
import { useCrudApi } from '@/composables/useCrudApi'

// Create a problem-group API instance using the generic CRUD composable
const problemGroupApi = useCrudApi<ProblemGroup>({
  resourcePath: 'problem-group',
  resourceNameSingular: '题组',
})

// Export with original function names for backward compatibility
export const getProblemGroup = problemGroupApi.getOne
export const postProblemGroup = problemGroupApi.create
export const putProblemGroup = problemGroupApi.update
export const deleteProblemGroup = problemGroupApi.remove

// Export the createProblemGroup function for backward compatibility
export async function createProblemGroup(
  method: 'post' | 'put',
  data: ProblemGroup
) {
  return await problemGroupApi.createOrUpdate(method, data)
}
