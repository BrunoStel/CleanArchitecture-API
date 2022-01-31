def utils

pipeline {
    agent any
    stages{
        stage('Load Scripts'){
          steps{
              script{
                utils = load "./scripts/utils.groovy"
              }
          }
        }
        stage('Setting pipeline'){
          steps{
              script {
                utils.dockerBuild()
              }
          }
        }
        stage('Validade Project'){
          steps{
              script {
                utils.dockerRun("npm install");
              }
          }
        }
        stage('SonarQube analysis') {
          steps{
            script{
              withSonarQubeEnv('Devops') {
                utils.sendSonarqube()
              }
            }
          }
        }
         stage('Quality Gate') {
          steps{
            script{
              def qg = waitForQualityGate
              if(qg.status == "SUCCESS"){
                bat "Sucesso no quality gate"
              }
            }
          }
        }
        stage('Deploy Lambda'){
            steps{
              bat "echo Finalizandoo"
            }
        }
    }
}