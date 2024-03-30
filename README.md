


1) npm run dev -- create local url

2) log in to shopify partner -> app -> build -> configuration -> copy url into main.js fetch commands

3) 1. When you do npm run dev then generate a graphql server link(eg: http://localhost:3457/graphiql)
2. Go to this link and execute this query 

query {
  products(first: 10, reverse: true) {
    edges {
      node {
        id
        title
        
        handle
        resourcePublicationOnCurrentPublication {
          publication {
            name
            id
          }
          publishDate
          isPublished
        }
      }
    }
  }
}

4) Get response from query - it contains list of products

5) Send request to postman POST https://aerial-pork-salmon-difficult.trycloudflare.com/app/api

Put the json body as raw










----------------------------------------------------------

1) npm run dev 

to start app

New branch

 2) extentions -> app-ex1 -> assets - > node server.js

to get list of all products

1. When you do npm run dev then generate a graphql server link(eg: http://localhost:3457/graphiql)
2. Go to this link and execute this query 

query {
  products(first: 10, reverse: true) {
    edges {
      node {
        id
        title

        }
      }
    }
  }

  OR


query {
  products(first: 10, reverse: true) {
    edges {
      node {
        id
        title
        
        handle
        resourcePublicationOnCurrentPublication {
          publication {
            name
            id
          }
          publishDate
          isPublished
        }
      }
    }
  }

}
3. You will get a JSON which you can paste in POSTMAN

go to body and in raw put the json you got, POST to http://localhost:3000/api/data
Screenshot is there as postman1