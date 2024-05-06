//This Class has the purpose to 
class AlertQueue {
    constructor(waitTime) {
        this.queue = [];
        this.isProcessing = false;
        this.waitTime = waitTime;
    }

    enqueue(type, event) {
        console.log("Recieved event: " + type);
        this.queue.push({ type, event});
        //if not processing start processing
        if(!this.isProcessing) {
            this.processQueue();
        }
    }

    processQueue() {
        //if empty return
        if(this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        //get information
        const { type, event, waitTime } = this.queue.shift();
        //do layoutalert
        layoutAlert(type, event);
        setTimeout(() => {
            this.processQueue();
        }, this.waitTime)
    }
}