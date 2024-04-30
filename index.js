import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
//db
import db from "./_db.js"
//types
import { typeDefs } from "./schema.js"

const resolvers = {
    Query: {
        games(){
            return db.games //need not worry about specific fields, Apollo will take care of it
        },
        game(_, args){ //parent,args,context
            return db.games.find((rev)=> rev.id === args.id)
        },
        authors(){
            return db.authors
        },
        author(_, args){ //parent,args,context
            return db.authors.find((rev)=> rev.id === args.id)
        },
        reviews(){
            return db.reviews
        },
        review(_, args){ //parent,args,context
            return db.reviews.find((rev)=> rev.id === args.id)
        }
    }, //end of Query
    Game: {
        reviews(parent){
            return db.reviews.filter((r) => r.game_id===parent.id)
        }
    },
    Author: {
        reviews(parent){
            return db.reviews.filter((r) => r.author_id===parent.id)
        }
    },
    Review: {
        author(parent){
            return db.authors.find((a) => a.id === parent.author_id)
        },
        game(parent){
            return db.games.find((g) => g.id === parent.game_id)
        }
    },
    Mutation: {
        deleteGame(_,args){
            db.games=db.games.filter((g) => g.id !== args.id )
            return db.games
        },
        addGame(_,args){
            let game={
                ...args.game,
                id: Math.floor(Math.random()*10000).toString()
            }
            db.games.push(game)
            return game
        },
        updateGame(_,args){
            db.games = db.games.map((g) => {
                if (g.id === args.id) {
                    return {...g, ...args.edits}
                }
                return g
            })
            return db.games.find((g) => g.id === args.id)
        }
    }
}

//server setup
const server=new ApolloServer({
    //typeDefs --defs of types of data
    typeDefs, 
    resolvers
    //resolvers --how to respond to queries in the graph
})
const {url} = await startStandaloneServer(server,{
   listen: { port:4000 }
})

console.log('Server ready at port', 4000)