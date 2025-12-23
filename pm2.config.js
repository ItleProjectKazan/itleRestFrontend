module.exports = {
    apps: [
        {
            name: 'itle-pro',
            script: 'node_modules/next/dist/bin/next',
            args: 'start --port 4000',
            exec_mode: 'cluster',
            instances: 'max',
            max_memory_restart: '2G',
            restart_delay: 10000,
        },
    ],
}
