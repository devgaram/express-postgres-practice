pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {        
    stage('Cloning Git') {
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
         sh 'yarn test'
      }
    }
  }
}