class Queue {

    constructor() {
        this.jobs = [];
        this.isWorking = false;
    }

    addJob(job){
        this.jobs.push(job);
        this.executeQueue();
    }

    getQue() {
        return this.jobs;
    }

    executeQueue() {

        if (this.jobs[0] && !this.isWorking) {

            console.log("Executing: ", this.jobs[0].id);
            console.log("Total jobs in que: ", this.jobs.length);

            try {
                
                this.isWorking = true;
                this.jobs[0].task().then((value) => {
                    this.jobs[0].onDone(value);
                    this.jobs.shift();
                    this.isWorking = false;
                    this.executeQueue();
                })
                .catch((error) => {
                    this.jobs[0].onError(error);
                    this.jobs.shift();
                    this.isWorking = false;
                    this.executeQueue();
                })

            } catch (error) {
                
                console.log("Unable to complete job: ", this.jobs[0].id);
                console.log(error);
                
                // Remove job from que   
                this.jobs.shift();

            }

        }

        if (!this.jobs[0]) {
            console.log("Queue complete!");
        }

    }

};

export { Queue };