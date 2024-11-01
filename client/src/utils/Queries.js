import { gql } from "@apollo/client";

export const ME = gql
`query Query {
    me {
      username
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }`
