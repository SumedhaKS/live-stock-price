import { PubSubManager } from "./PubSubManager";

interface User {
    userId: string;
    stock: string;
}
// users
const user1: User = {
    userId: "mahesh",
    stock: "AAPL",
}

const user2: User = {
    userId: "suresh",
    stock: "AAPL"
}

const user3: User = {
    userId: "ramesh",
    stock: "TESLA"
}

const pubsubManager = PubSubManager.getInstance();

console.log(`Script started`);

// simulating pub sub
pubsubManager.userSubscribe(user1.userId, user1.stock);
pubsubManager.userSubscribe(user2.userId, user2.stock);
pubsubManager.userSubscribe(user3.userId, user3.stock);


// setInterval(() => {
//     PubSubManager.getInstance().userSubscribe(Math.random().toString(), "AMZN");
// }, 5000)

// fetch current stock price and publish on redis
