import fs from 'fs'
import protobuf, {ReflectionObject} from 'protobufjs'
import got from 'got'
import glob from 'glob'

interface ConfluentSchemaResponse {
  error_code: string
  message: string
}

export default async function upload(
  globPattern: string,
  url: string,
  username: string,
  password: string
): Promise<void> {
  const files = glob.sync(globPattern)

  for (const file of files) {
    const protoPlain = fs.readFileSync(file, 'utf8')
    const protoDescriptor = await protobuf.load(file)

    const messageWithTopic: ReflectionObject | undefined = Object.values(
      protoDescriptor.nested || {}
    ).find(msg => !!msg.options?.topic)

    if (!messageWithTopic)
      throw new Error('Protobuf does not a message with topic specified')

    const topic = messageWithTopic.options?.topic

    const {body}: {body: ConfluentSchemaResponse} = await got.post({
      url: `${url}/subjects/${topic}/versions`,
      headers: {
        'Content-Type': 'application/vnd.schemaregistry.v1+json',
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
          'base64'
        )}`
      },
      throwHttpErrors: false,
      https: {rejectUnauthorized: false},

      body: JSON.stringify({
        schemaType: 'PROTOBUF',
        schema: protoPlain
      }),
      responseType: 'json'
    })
    if (body.error_code) throw new Error(body.message)
  }
}
