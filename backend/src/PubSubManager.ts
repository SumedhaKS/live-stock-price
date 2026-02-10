import { createClient, type RedisClientType } from "redis";

export class PubSubManager {
    private static instance: PubSubManager;
    private redisClient: RedisClientType;
    private subscriptions: Map<string, string[]>;       // < stock=> string, users[]=> string[] >

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
        this.subscriptions = new Map();
    }

    static getInstance(): PubSubManager {
        if (!this.instance) {
            this.instance = new PubSubManager();
        }
        return this.instance;
    }

    public userSubscribe(userId: string, stock: string) {
        // check if stock present in subscriptions and add user to its array
        if (!this.subscriptions.has(stock)) {
            this.subscriptions.set(stock, []);
        }
        this.subscriptions.get(stock)?.push(userId);

        if (this.subscriptions.get(stock)?.length === 1) {  // if this user is the first subscriber for that stock? 
            this.redisClient.subscribe(stock, (message) => {
                this.handleMessage(stock, message);
            })
            console.log(`Subscribed to Redis Channel: ${stock}`);
        }
    }

    public userUnSubscribe(userId: string, stock: string) {
        this.subscriptions.set(stock, this.subscriptions.get(stock)?.filter((sub) => sub !== userId) || []);

        if (this.subscriptions.get(stock)?.length === 0) {
            this.redisClient.unsubscribe(stock);
            console.log(`Unsubscribed from the Redis Channel: ${stock}`);
        }
    }

    private handleMessage(stock: string, message: string) {
        console.log(`Message received on the channel: ${stock}: ${message}`);
        this.subscriptions.get(stock)?.forEach((sub)=>{
            console.log(`Sending message to user: ${sub}`);            
        })
    }

    private async disconnect() {
        await this.redisClient.quit()
    }
}

