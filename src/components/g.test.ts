import { Client } from '@elastic/elasticsearch'
const client = new Client({ node: 'http://localhost:9200' })

describe("", () => {
    test("should", async () => {
        const result = await client.search({
            index: 'index3',
            body: {
              query: {
                match: { Location: 'Singapore' }
              }
            }
          })
        //   console.log(result)
          console.log(result.body.hits.hits)
    })
})