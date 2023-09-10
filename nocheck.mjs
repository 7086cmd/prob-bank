import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'

const dbName = 'prob-bank'

const client = new MongoClient(url, { useNewUrlParser: true })

await client.connect()

const db = client.db(dbName)

const collection = db.collection('problems')

const result = await collection.find({}).toArray()

result.forEach(async x => {
  if (!('wrong' in x)) {
    x.wrong = {
      type: '',
      reason: [],
      lesson: []
    }
    await collection.updateOne({ _id: x._id }, { $set: x })
  }
})

await client.close()
