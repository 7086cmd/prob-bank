export async function isValidObjectId(_id: string | undefined) {
  if (!_id) return false
  return window.probbank.validObjectId(_id)
}
