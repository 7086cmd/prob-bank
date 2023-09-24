import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://localhost:27017')

await client.connect()

const db = client.db('prob-bank')

const collection = db.collection('problems')

const problems = await collection.find().toArray()

problems.forEach(async problem => {
  /**
   * @type {import("./@types/problem.d.ts").AllProblem}
   */
  const problemData = problem

  problemData.content = problemData.content.map(x => {
    if (x.type === 'text' && x.content.includes('（　　）')) {
      x.content = x.content.replace('（　　）', '')
    }
    return x
  })

  await collection.updateOne({ _id: problem._id }, { $set: problemData })
})

