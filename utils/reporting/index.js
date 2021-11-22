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

//Get all the testcases id present in the testrail
GetAllTestCaseIds = async () => {
    let data = []
    await tr.getCases(assets_data.testrail.project_id, { suite_id: assets_data.testrail.suite_id }).then((xhr) => {
        data = xhr.body
    })
    let allIds = data.cases.map(key => key.id)
    return allIds
}

//Read Single File & send report to the testrail if case_id exists
ReadSingleFile = (file) => {
    let individual_results = []
    let data = fs.readJsonSync(`${file}`)
    if (data.results == undefined) return
    data.results.forEach((r) => {
        if (r.suites == undefined) return
        r.suites.forEach((s) => {
            if (s.tests == undefined) return
            s.tests.forEach((test) => {
                //Sending each test to test result
                let valid_id = /^(\C\w*)+\d$/.test(test.title.split('|')[0])
                if (!valid_id) return
                let Case_ID = test.title.split('|')[0].substring('1')
                let status_id
                let comment
                let version = `1.0`
                let elapsed = parseInt(test.duration) / 1000 + 's'
                if (test.state == 'passed') {
                    status_id = 1
                    comment = 'Test worked Fine while tested by bot'
                } else if (test.state == 'failed') {
                    status_id = 5
                    comment =
                        'Test Failed when tested by bot, see the report generated in mochawesome for more info' +
                        '\n' +
                        test.err.message
                } else {
                    status_id = 2
                    comment =
                        'test skipped by the bot:' +
                        `${test.state} : ${JSON.stirngfy(test)}`
                }
                //Sending result
                let content = {
                    case_id: Case_ID,
                    status_id,
                    comment,
                    version,
                    elapsed,
                }
                individual_results.push(content)
            })
        })
    })
    return individual_results
}

SendReport = async (report = []) => {
    if (report !== undefined && report.length != 0) {
        //Comparing all ids we got with the ids from testrail
        let allIds = await GetAllTestCaseIds()
        // console.log(allIds)
        let new_report = report.filter((r) => {
            if (allIds.includes(parseInt(r.case_id))) return r
        })

        // console.log(new_report)

        await tr
            .addResultsForCases(assets_data.testrail.run_id, new_report)
            .then((r) => {
                if (r !== undefined)
                    console.info(
                        'Result send to testrail : ',
                        JSON.stringify(new_report)
                    )
            })
            .catch((e) => {
                console.error(
                    `Failed to send Result in Testrail :`,
                    e.message
                    // report
                )
                console.error(
                    '---------------------------------->\n' +
                        JSON.stringify(new_report)
                )
            })
    }
}

//Main Runner
main = (dir_path) => {
    let final_result = []
    console.info('Sending Report From Test Logs:', dir_path)
    let files = fs.readdirSync(dir_path)
    let json_files = files.filter(
        (f) => path.extname(f).toLowerCase() === '.json'
    )
    let make_synchronus = new Promise((resolve, reject) => {
        json_files.forEach((file) => {
            let results = ReadSingleFile(dir_path + '/' + file)
            if (results.length != 0) {
                // final_result.concat(results)
                final_result = [...final_result, ...results]
                resolve()
            } else {
                reject()
            }
        })
    })
    make_synchronus.then(() => {
        // console.log('Final result-->',final_result)
        SendReport(final_result)
        console.info('Sending Report Done..')
    })
}

main(path.resolve('results'))
