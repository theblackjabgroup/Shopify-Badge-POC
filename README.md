npm run dev to start app

New branch

 extentions -> app-ex1 -> assets - > node server.js

to get list of all products

1. When you do npm run dev then generate a graphql server link(eg: http://localhost:3457/graphiql)
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
3. You will get a JSON which you can paste in POSTMAN

go to body and in raw put the json you got, POST to http://localhost:3000/api/data
Screenshot is there as postman1