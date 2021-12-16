#!/bin/bash
echo "Running All the Tests"
set -x
./node_modules/.bin/cross-env SERVER=prod node ./utils/reporting/initial.js
# Running Prod Tests
./node_modules/.bin/cypress run --browser chrome --headless --env configFile=prod
# Generating Report
./node_modules/.bin/cross-env SERVER=prod node ./utils/reporting/index.js
# Sending Summary in Email
node ./utils/reporting/email.js
# Cleanup reporting
node ./utils/reporting/clean.js
set +x      