def utils

pipeline {
    agent any
    stages{
  
        stage('Horusec'){
          steps{
              script{
                sh "docker run -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/src horuszup/horusec-cli:latest horusec start -p /src -P $(pwd)"
              }
          }
        }
 
    }
}