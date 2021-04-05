import upload from '../src/upload'
import got from 'got'

jest.mock('got')

const mockedGot = got as jest.Mocked<typeof got>

test('upload works', async () => {
  mockedGot.post.mockResolvedValue({body: {}})

  await upload(
    './__tests__/**/**.proto',
    'https://confluent-cloud',
    'U3ORYHY3WL3NRIOC',
    'ZMs277NGoy/P6LB6DCW1q6dg4CMl/292KinNsG1bMsuN9IIqeuw/62FEdGRcwfEA'
  )

  expect(mockedGot.post).toHaveBeenCalled()
  expect(mockedGot.post).toMatchSnapshot()
})
