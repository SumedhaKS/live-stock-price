import { PubSubManager } from "./PubSubManager";
import { FinnhubAPI, FinnhubWS } from "@stoqey/finnhub";
import { createClient, type RedisClientType, } from "redis";

import dotenv from "dotenv";
dotenv.config();

const redisClient: RedisClientType = createClient();
redisClient.connect();

const finnhubAPI = new FinnhubAPI(process.env.FINNHUB_KEY);
const finnhubWs = new FinnhubWS()

process.env.DEBUG = "finnhubWs*"

interface User {
    userId: string;
    stock: string;
}

// users
const users: User[] = [
    {
        userId: "mahesh",
        stock: "AAPL",
    },
    {
        userId: "suresh",
        stock: "AAPL"
    },
    {
        userId: "ramesh",
        stock: "AMZN"
    }
]

const stocks: Set<string> = new Set();
const pubsubManager = PubSubManager.getInstance();

console.log(`Script started`);

// simulating pub sub
users.forEach((user)=>{
    pubsubManager.userSubscribe(user.userId, user.stock);
    if(!stocks.has(user.stock)){
        stocks.add(user.stock)
    }
})
console.log(stocks);

setInterval(() => {
    stocks.forEach(async (stock)=>{
        const quote = await finnhubAPI.getQuote(stock);        
        redisClient.publish(stock, JSON.stringify(quote));
    })
}, 5000)

// fetch current stock price and publish on redis
