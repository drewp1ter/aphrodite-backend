import iikoRespinse1 from './iiko-response-1'
import iikoResponse2 from './iiko-response-2'
import iikoResponse3 from './iiko-response-3'

let tokenRequested = false
let requestsCount = 0

export const fetchMock = async (req: string | URL | Request, init?: any): Promise<Response> => {
  if (req.toString().indexOf('/access_token') !== -1) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async (): Promise<any> => {
        const response = {
          correlationId: 'b878988a-6cdc-41f9-907a-89e4db93443f',
          token: tokenRequested ? 'good_token' : 'bad_token'
        }
        tokenRequested = true
        return response
      }
    } as Response)
  }

  if (init?.headers && init.headers.get('Authorization') === 'Bearer bad_token') {
    return Promise.resolve({
      ok: false,
      status: 401,
      json: async (): Promise<any> => {
        throw SyntaxError('Unexpected end of JSON input')
      }
    } as Response)
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => {
      switch (requestsCount) {
        case 0:
          requestsCount++
          return iikoRespinse1
        case 1:
          requestsCount++
          return iikoResponse2
        case 2:
          requestsCount++
          return iikoResponse3  
      }
    }
  } as Response)
}
