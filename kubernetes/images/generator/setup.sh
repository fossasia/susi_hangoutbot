#!/bin/bash
git clone ${REPOSITORY} susi_hangoutbot
cd susi_hangoutbot
git checkout ${BRANCH}

if [ -v COMMIT_HASH ]; then
    git reset --hard ${COMMIT_HASH}
fi

npm install --no-shrinkwrap
