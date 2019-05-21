module.exports = {
    apps : [{
        name: "FanLabelProd",
        script: "./dist/startApi.js",
        env: {
            NODE_ENV: "production"
        },
        exec:'cluster',
        instances:0,
        max_memory_restart:'16G',
        log_date_format: "YYYY-MM-DD HH:mm Z",
        node_args: ["--max_old_space_size=16000"]
    }]
}
// -i 0 --max-memory-restart 16G --node-args="--max-old-space-size=16000" dist/startApi.js