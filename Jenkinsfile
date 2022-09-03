def utils

pipeline {
    agent any
    stages{
  
        stage('Horusec'){
          steps{
              script{
                sh "caminho=$(pwd) && $caminho && docker run -v /var/run/docker.sock:/var/run/docker.sock -v $caminho:/src horuszup/horusec-cli:latest horusec start -p /src -P $caminho"
              }
          }
        }
 
    }
}