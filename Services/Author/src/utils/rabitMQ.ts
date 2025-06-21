import amqp from "amqplib";

let channel: amqp.Channel;

console.log("rabbimq is here",process.env.Rabmitmq_Hoist);
console.log("rabbimq is here",process.env.Rabmitmq_Username);
console.log("rabbimq is here",process.env.Rabmitmq_Password);

export const connectionRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
     protocol: "amqp",
      hostname: process.env.Rabmitmq_Hoist,
      port:5672,
      username: process.env.Rabmitmq_Username,
      password: process.env.Rabmitmq_Password,
    });

    channel = await connection.createChannel();
    console.log("RabbitMQ connection successful ✅");
  } catch (error) {
    console.error("RabbitMQ connection failed ❌", error);
  }
};

export { channel };



export const publishToQueue = async(queueName:string,message:any)=>{
  if(!channel){
    console.error("rabitMq channel is not intitlized");
    return 
  }
  await channel.assertQueue(queueName,{durable:true});
  channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message)),{persistent:true})
}

export const invalidateCacheJob =async (cacheKeys:string[])=>{
try {
  const message = {
    action:"invalidateCache",
    keys:cacheKeys
  }
  await publishToQueue("cache-invalidation",message)
console.log("cache invalidation success");

} catch (error) {
  console.error("failed to publish cache on rabitMQ",error);
  
}
}