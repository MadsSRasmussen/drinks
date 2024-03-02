class Job {

    constructor(task, id, onDone, onError) {

        this.task = task;
        this.id = id;
        this.onDone = onDone;
        this.onError = onError;

    }

}

export { Job };