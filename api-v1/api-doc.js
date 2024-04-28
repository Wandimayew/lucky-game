
const apiDoc = {
    swagger: '2.0',
    basePath: '/v1',
    info: {
      title: 'Lucky Game APIs',
      version: '1.0.0'
    },
    paths: {
      '/api/category/getCategory': {
        get: {
          summary: 'Get categories',
          responses: {
            200: {
              description: 'Successful response',
            //   schema: {
            //     "type": "object",
            //     "required": ["name", "hash", "rating", "price"],
            //     "properties": {
            //       "name": {
            //         "type": "string"
            //       },
            //       "rating": {
            //        "type": "string",
            //         "example": "4"
            //       },
            //       "price": {
            //         "type": "number"
            //       },
            //       "hash": {
            //         "type": "string"
            //       }
            //     }
            //   }
            }
            },
            // Add more response codes as needed
          }
        }
      },
      // Define paths for other endpoints
    };
  
  export default apiDoc;
  