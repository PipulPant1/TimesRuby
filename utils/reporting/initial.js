const fs = require('fs-extra')
const path = require('path')

//Import assets file
let server = process.env.SERVER

let path_to_assets = path.resolve('utils', 'assets', `${server}.json`)
let assets_data = fs.readJsonSync(path_to_assets)

// TestRail Configs
const Testrail = require('testrail-api')
const tr = new Testrail({
    host: assets_data.testrail.domain,
    user: assets_data.testrail.username,
    password: assets_data.testrail.password,
})

// tr.getTests(assets_data.testrail.run_id, {}).then((data) => {
//     let array_testids = data.body.map((val) => val.id)
//     console.log(array_testids)
// })

// tr.addResults(assets_data.testrail.run_id, [
//     {
//         test_id: 133495,
//         status_id: 4,
//         comment:
//             "This test was marked as 'Retest'. \n Resetting the test status before updating the actual status",
//     },
// ]).then((data) => {
//     console.log(data.response)
// })

main = async () => {
    console.info(
        `Reseting the Tests for ${server} testrun`,
        assets_data.testrail.run_id
    )
    let testids = []
    await tr.getTests(assets_data.testrail.run_id, {}).then((data) => {
        testids = data.body.tests.map((val) => val.id)
    })
    await tr
        .addResults(
            assets_data.testrail.run_id,
            testids.map((t) => ({
                test_id: t,
                status_id: 4,
                comment:
                    "This test was marked as 'Retest'. \n Resetting the test status before updating the actual status",
            }))
        )
        .catch((e) => {
            console.error('Result not updated', e.message)
        })
}

main()
