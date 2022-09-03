def utils

pipeline {
    agent any
    stages{
  
        stage('Horusec'){
          steps{
              script{
                //sh "docker run -v /var/run/docker.sock:/var/run/docker.sock -v \$(pwd):/src horuszup/horusec-cli:latest horusec start -p /src -P \$(pwd) --config-file-path src/horusec-config.json"
                def files = sh(returnStdout: true, script: """ git show --pretty="" --name-only""")
                echo "${files}"
                sh """export FILES="$files" && chmod a+x teste.sh && ./teste.sh"""
                sh "ls files"
              }
          }
        }
 
    }
}