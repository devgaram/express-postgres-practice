#!/bin/bash
cd /home/ec2-user/build
chmod +x ./deploy.sh
./deploy.sh > /dev/null 2> /dev/null < /dev/null &