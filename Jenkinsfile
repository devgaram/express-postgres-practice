pipeline {
   agent any

   environment {
       S3PATH = "${env.JOB_NAME}"
       AWS_SECRET_ACCESS_KEY = "${env.AWS_SECRET_ACCESS_KEY}"
   }
   tools {
      nodejs "node"
   }

   stages {
      stage('Build') {
         steps {
            git 'https://github.com/devgaram/express-project-blog.git'
         }
      }
      
      stage('Install dependencies') {
          steps {
              sh 'npm install -g yarn'
              sh 'yarn install'
          }
      }
      stage('Test') {
          steps {
              echo 'test..'
              // yarn test
          }
      }
      stage('Upload S3') {
          steps {
              echo 'Upload S3'
              withAWS(credentials: '667cec8d-baa7-497f-b2db-2d424c121a22') {
                s3Upload(file: '.', bucket: 'blog-server-bucket', path: "${S3PATH}", excludePathPattern: '**/node_modules/**, **/.git/**')
              }
          }
      }
      stage('Deploy') {
          steps {
              echo 'deploy'
              step([$class: 'AWSCodeDeployPublisher', applicationName: 'blog-server', awsAccessKey: 'AKIASDBC2NNSJWD4F76B', awsSecretKey: "${AWS_SECRET_ACCESS_KEY}", credentials: 'awsAccessKey', deploymentConfig: 'CodeDeployDefault.OneAtATime', deploymentGroupAppspec: false, deploymentGroupName: 'blog-server-CodeDeploy-group', excludes: '', iamRoleArn: '', includes: '**', proxyHost: '', proxyPort: 0, region: 'ap-northeast-2', s3bucket: 'blog-server-bucket', s3prefix: '', subdirectory: '', versionFileName: '', waitForCompletion: false])
          }
      }
   }
   post {
        success {
            echo 'successed'
        }
        failure {
            echo 'failed'
        }
   }
}
