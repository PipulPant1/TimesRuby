/**
 * This will take two parameters as env variable
 * Server = [dev,stage,prod,feature]
 * Role = [admin,instructor,student]
 */

const fs = require('fs-extra')
const path = require('path')
const p = require('puppeteer')

/**
 * Import testrail configs
 */
let path_to_assets = path.resolve(
    'utils',
    'assets',
    `${process.env.SERVER}.json`
)
let assets_data = fs.readJsonSync(path_to_assets)
const Testrail = require('testrail-api')
const tr = new Testrail({
    host: assets_data.testrail.domain,
    user: assets_data.testrail.username,
    password: assets_data.testrail.password,
})

/**
 * Token Generation logics
 */

/**
 * Main Runner
 */
main = async (server, role) => {
    server = 'Prod'
    console.info('Server: ', server)
    console.info('Role: ', role)

    //Pulling baseurl & credentials according to the role
    // let path_to_assets_file = path.resolve('utils', 'assets', `${server}.json`)
    console.info('Assets File: ', path_to_assets)
    // let assets_data = fs.readJSONSync(path_to_assets_file)

    let config = {}

    //Timeout settings
    config.defaultCommandTimeout = 3000
    config.requestTimeout = 60000
    //video and retries and screenshot setting based on server & local run
    if (process.env.SERVER_RUN == 'Prod') {
        config.retries = { runMode: 1, openMode: 0 }
        config.numTestsKeptInMemory = 0
        config.video = false
        config.screenshotOnRunFailure = false
    } else {
        config.video = true
        config.screenshotOnRunFailure = true
    }
    config.screenshotsFolder = 'screenshots'
    config.videosFolder = 'videos'
    //Reporter settings
    config.reporter = 'mochawesome'
    config.reporterOptions = {
        reportDir: 'results',
        overwrite: false,
        html: false,
        json: true,
    }
    //viewportHeight & viewportWidth (Standard default 16:9 HD screen size)
    config.viewportHeight = 768
    config.viewportWidth = 1366
    // Integration & fixtures (settings)
    config.fixturesFolder = `tests/${role}/fixtures`
    config.integrationFolder = `tests/${role}/integration`
    //finally writing in the file
    fs.writeFileSync(file, JSON.stringify(config))
    console.info('Done')
}

main(process.env.SERVER, process.env.ROLE)
