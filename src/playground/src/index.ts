import { Server } from "opposer"

(async () => {
    try{
        var app = await Server({
            cors: {
                origin: "*"
            }
        });
    
        app.initialize()
    }catch(err) {
        console.error(err)
    }
})()