import type { AllProblem } from '@/../@types/problem'
import dayjs from 'dayjs'
import { MongoClient, ObjectId } from 'mongodb'
import { log } from '../log'

export async function getProblem(id: string) {
  const url = 'mongodb://127.0.0.1:27017'
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db('prob-bank')
  const collection = db.collection('problems')
  const problem = await collection.findOne<AllProblem>({
    _id: new ObjectId(id),
  })
  if (!problem) {
    return null
  }
  client.close()
  return problem
}

export async function getProblems() {
  const url = 'mongodb://127.0.0.1:27017'
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db('prob-bank')
  const collection = db.collection('problems')
  const problems = await collection.find().toArray()
  client.close()
  return problems
}

export async function getProblemList(filter: {
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
  type: ('single-choice' | 'multiple-choice' | 'blank' | 'answer')[]
}) {
  const url = 'mongodb://127.0.0.1:27017'
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db('prob-bank')
  const collection = db.collection('problems')
  const problems = await collection
    .find<AllProblem>({
      'data.level': { $in: filter.grade },
      'data.subject': { $in: filter.subject },
      type: { $in: filter.type },
    })
    .toArray()
  client.close()
  return problems
}

export async function modifyProblem(problem: AllProblem) {
  if (await getProblem(problem._id)) {
    const url = 'mongodb://127.0.0.1:27017'
    const client = new MongoClient(url)
    await client.connect()
    const db = client.db('prob-bank')
    const collection = db.collection('problems')
    await collection.updateOne(
      { _id: new ObjectId(problem._id) },
      {
        $set: {
          ...problem,
          _id: new ObjectId(problem._id),
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
      }
    )
    log.success('App successfully modified a problem ' + problem._id + '.')
    client.close()
    return { _id: problem._id, statusCode: 200 }
  } else {
    const url = 'mongodb://127.0.0.1:27017'
    const client = new MongoClient(url)
    await client.connect()
    const db = client.db('prob-bank')
    const collection = db.collection('problems')
    const result = await collection.insertOne({
      ...problem,
      _id: new ObjectId(problem._id),
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
    client.close()
    return { _id: result.insertedId.toString(), statusCode: 201 }
  }
}

export async function deleteProblem(id: string) {
  const url = 'mongodb://127.0.0.1:27017'
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db('prob-bank')
  const collection = db.collection('problems')
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  client.close()
  return result
}
