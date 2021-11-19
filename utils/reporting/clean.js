const fs = require('fs-extra')
const path = require('path')

const directory = path.resolve('results')

fs.emptyDirSync(directory)
