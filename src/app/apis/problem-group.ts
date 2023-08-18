import type { ProblemGroup } from '@/../@types/problem-group'
import dayjs from 'dayjs'
import { MongoClient, ObjectId } from 'mongodb'

export async function getProblemGroup(id: string) {
  const url = 'mongodb://localhost:27017'
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db('prob-bank')
  const collection = db.collection('problem-groups')
  const problem = await collection.findOne<ProblemGroup>({
    _id: new ObjectId(id),
  })
  if (!problem) {
    return null
  }
  client.close()
  return problem as ProblemGroup
}

export async function getProblemGroupList(filter: {
  grade: ['P' | 'J' | 'S' | 'U', number][]
  subject: (
    | 'Chinese'
    | 'English'
    | 'Math'
    | 'Physics'
    | 'Chemistry'
    | 'Biology'
    | 'Politics'
    | 'History'
    | 'Geography'
    | 'IT'
    | 'General Technology'
    | 'Others'
  )[]
  type: ('removable' | 'unremovable')[]
}) {
  const url = 'mongodb://localhost:27017'
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db('prob-bank')
  const collection = db.collection('problem-groups')
  const problems = await collection
    .find<ProblemGroup>({
      'data.level': { $in: filter.grade },
      'data.subject': { $in: filter.subject },
      type: { $in: filter.type },
    })
    .toArray()
  client.close()
  return problems
}

export async function modifyProblemGroup(problemGroup: ProblemGroup) {
  if (
    problemGroup._id &&
    ObjectId.isValid(problemGroup._id) &&
    (await getProblemGroup(problemGroup._id))
  ) {
    const url = 'mongodb://localhost:27017'
    const client = new MongoClient(url)
    await client.connect()
    const db = client.db('prob-bank')
    const collection = db.collection('problem-groups')
    await collection.updateOne(
      { _id: new ObjectId(problemGroup._id) },
      {
        $set: {
          ...problemGroup,
          _id: new ObjectId(problemGroup._id),
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
      }
    )
    client.close()
    return { _id: problemGroup._id, statusCode: 200 }
  } else {
    const url = 'mongodb://localhost:27017'
    const client = new MongoClient(url)
    await client.connect()
    const db = client.db('prob-bank')
    const collection = db.collection('problem-groups')
    const result = await collection.insertOne({
      ...problemGroup,
      _id: new ObjectId(problemGroup._id),
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
    client.close()
    return { _id: result.insertedId.toString(), statusCode: 201 }
  }
}

export async function deleteProblemGroup(id: string) {
  const url = 'mongodb://localhost:27017'
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db('prob-bank')
  const collection = db.collection('problem-groups')
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  client.close()
  return result
}
