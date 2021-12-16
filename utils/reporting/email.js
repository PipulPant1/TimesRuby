var nodemailer = require('nodemailer')
const fs = require('fs-extra')
const path = require('path')

const recevers = 'abiral@fusemachines.com,pipul@fusemachines.com'

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
                individual_results.push({
                    title: test.title,
                    state: test.state,
                    err: test.err,
                    elapsed: parseInt(test.duration) / 1000 + 's',
                })
            })
        })
    })
    return individual_results
}

SendReport = async (report = []) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'qa@fusemachines.com',
            pass: 'Quality@2021@Oct',
        },
    })

    let failed = report.filter((result) => result.state == 'failed')
    let failed_html = ''
    if (failed.length == 0) failed_html = '<li>No Test Failed</li>'
    else {
        failed.forEach((r) => {
            failed_html =
                failed_html +
                `<li>${r.title} <ul> <li>${r.err.message}</li></ul></li>`
        })
    }
    let other = report.filter((result) => result.state !== 'failed')
    let other_html = ''
    if (other.length == 0) other_html = '<li>No Tests</li>'
    else {
        other.forEach((r) => {
            other_html = other_html + `<li>${r.title}</li>`
        })
    }
    var mailOptions = {
        to: recevers,
        subject: 'Sending Email using Node.js',
        html: `<h1>Automated API Report</h1> <b>Failed Cases:</b> <p><ul>${failed_html}</ul></p></br> <b>Other:</b><p><ul>${other_html}</ul></p>`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
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
    // console.log(final_result)
    make_synchronus.then(() => {
        // console.log('Final result-->',final_result)
        SendReport(final_result)
        console.info('Sending Report Done..')
    })
}

main(path.resolve('results'))
