#!/usr/bin/env node
/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const CONSOLE_GREEN_COLOR = '\x1b[33m%s\x1b[0m';

// Get all modified files except deleted files
const fileList = execSync('git diff --name-only --cached --diff-filter=d')
    .toString()
    .trim()
    .split('\n');

// If all files are deleted, exit
if (fileList.length === 0 || (fileList.length === 1 && fileList[0] === '')) {
    process.exit(0);
}

const license = `/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */`;

let licenceAdded = 0;

// Check if the file has the license, if not add it
fileList.forEach((file) => {
    const extension = path.extname(file).slice(1);
    if (['ts', 'tsx'].includes(extension)) {
        const content = fs.readFileSync(file, 'utf8');
        if (!content.includes('License, v. 2.0')) {
            const newContent = `${license}\n\n${content}`;
            fs.writeFileSync(file, newContent, 'utf8');
            licenceAdded++;
        }
    }
    execSync(`git add ${file}`);
});

if (licenceAdded > 0) {
    console.log(CONSOLE_GREEN_COLOR, `${licenceAdded} license(s) added.`);
}
