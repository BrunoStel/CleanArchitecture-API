def verifyBFFChanged(){
  dir ('pathsModified') {
    if (fileExists('app-backend.txt')){
        return true
    }else {
      echo "Mandandno mensagem sobre sonar BFF"
    }
  }
}

def verifyMobileChanged(){
  dir ('pathsModified') {
    if (fileExists('app-mobile.txt')){
      return true
    }else {
      echo "Mandandno mensagem sobre sonar mobile"
    }
      
  }
}
def verifyFilesModified(){
  sh """chmod a+x filesModified.sh && ./filesModified.sh"""
}

def gitLeaksRun(){
  try{
    sh(returnStdout: true, script: "docker run --rm -v ${pwd()}:/app zricethezav/gitleaks:latest detect --no-git --verbose --source=/app/filesToAnalyse ")
  }catch(error){
  }
}
def horusecRun(){
    sh "cd filesToAnalyse && docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v \$(pwd):/src horuszup/horusec-cli:latest horusec start -p /src -P \$(pwd) --config-file-path src/horusec-config.json"
}

def runSonar(port){
  try{
    def output = sh(returnStdout: true, script: "docker run -d -p ${port}:9000 --name sonar-${env.BUILD_NUMBER} sonarqube:8.9.7-community")
    return port
  }catch(error){
    sh "docker rm sonar-${env.BUILD_NUMBER}"
    def porta = port.toInteger() + 1
    runSonar("${porta}")
  }
}

def isSonarRunning(){
  return sh(returnStdout: true, script: "docker ps -a -f name=sonar-${env.BUILD_NUMBER} -q -f status=running")
}

def verifySonarContainer(){
  def isRunning = isSonarRunning()
  echo "${isRunning}"
  while (!isRunning){
    isRunning = isSonarRunning()
    sleep(15)
  }
  return
}

def verifySonarIsAvailable(porta){
    try{
        sh(returnStdout: true, script:"""curl -u admin:admin -X GET "http://localhost:${porta}/api/server/version" """)
    }catch(error){
        sleep(30)
        verifySonarIsAvailable(porta)
    }
}

def verifySonarIsGreen(porta){
    def isGreen = [health: "RED"]
     while (isGreen.health != "GREEN"){
        sleep(30)
        def output = readJSON text: sh(returnStdout: true, script:"""curl -u admin:admin -X GET "http://localhost:${porta}/api/system/health" """)
        if(!output.errors)
            isGreen.health = output.health
        echo "${output}"
        echo "${isGreen}"
     }
}

def setSonarCredentials(porta){
    return sh(returnStdout: true, script:"""curl -u admin:admin -X POST "http://localhost:${porta}/api/users/change_password?login=admin&previousPassword=admin&password=sonar" """)
}

def createConditionsBFF(){ 
    return [
        [
        error: 0,
        metric: 'new_code_smells',
        op: 'GT'
        ],
        [
        error: 80,
        metric: 'new_coverage',
        op: 'LT'
        ],
        [
        error: 0.5,
        metric: 'new_duplicated_lines_density',
        op: 'GT'
        ],
        [
        error: 0,
        metric: 'new_bugs',
        op: 'GT'
        ],
        [
        error: 0,
        metric: 'new_vulnerabilities',
        op: 'GT'
        ],
    ]
}

def createConditionsMobile(){ 
    return [
        [
        error: 0,
        metric: 'new_code_smells',
        op: 'GT'
        ],
        [
        error: 95,
        metric: 'new_coverage',
        op: 'LT'
        ],
        [
        error: 0.5,
        metric: 'new_duplicated_lines_density',
        op: 'GT'
        ],
        [
        error: 0,
        metric: 'new_bugs',
        op: 'GT'
        ],
        [
        error: 0,
        metric: 'new_vulnerabilities',
        op: 'GT'
        ],
    ]
}

def createQualityGate(porta, project) {
    def conditions
    def qualityGate
    def projectName
    echo "${project}"
    if (project == "app-backend"){
         conditions = createConditionsBFF()
         qualityGate = "quality-gate-bff"
         projectName = "Minha-Claro-Backend"
         echo "caiu aqui"
    }else {
         conditions = createConditionsMobile()
         qualityGate = "quality-gate-mobile"
         projectName = "Minha-Claro-Mobile"
    }
    sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualitygates/create?name=${qualityGate}" """
    
    sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualitygates/set_as_default?name=${qualityGate}" """

    conditions.each { condition ->
        sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualitygates/create_condition?gateName=${qualityGate}&metric=${condition.metric}&&op=${condition.op}&&error=${condition.error}" """
    }

    sh """  curl -u admin:sonar -X POST "http://localhost:${porta}/api/projects/create?name=${projectName}&project=${project}" """

    sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualitygates/select?gateName=${qualityGate}&projectKey=${project}" """   

}

def createRulesToBeExcludedBFF() {  return ['javascript:S1874'] } 

def createRulesToBeExcludedMobile() {  return [''] } 

def createQualityProfile(porta, project) {
    def rulesBFF = createRulesToBeExcludedBFF()
    def rulesMobile = createRulesToBeExcludedMobile()

    def qualityKeyToCopyJS = readJSON text: sh(returnStdout: true, script: """ curl -u admin:sonar -X GET "http://localhost:${porta}/api/qualityprofiles/search?language=js" """)
    def qualityKeyToCopyTS = readJSON text: sh(returnStdout: true, script: """ curl -u admin:sonar -X GET "http://localhost:${porta}/api/qualityprofiles/search?language=ts" """)
    
    def newQualityProfileKeyJS = readJSON text: sh(returnStdout: true, script: """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualityprofiles/copy?fromKey=${qualityKeyToCopyJS.profiles[0].key}&toName=profile-js" """)
    def newQualityProfileKeyTS = readJSON text: sh(returnStdout: true, script: """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualityprofiles/copy?fromKey=${qualityKeyToCopyTS.profiles[0].key}&toName=profile-ts" """)

    rulesBFF.each { rule ->
        sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualityprofiles/deactivate_rule?key=${newQualityProfileKeyJS.key}&rule=${rule}" """
    }
    rulesMobile.each { rule ->
        sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualityprofiles/deactivate_rule?key=${newQualityProfileKeyTS.key}&rule=${rule}" """
    }
    
    if(project == 'app-backend'){
        sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualityprofiles/add_project?language=js&project=${project}&qualityProfile=profile-js" """
    }else {
        sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualityprofiles/add_project?language=js&project=${project}&qualityProfile=profile-js" """
        sh """ curl -u admin:sonar -X POST "http://localhost:${porta}/api/qualityprofiles/add_project?language=ts&project=${project}&qualityProfile=profile-ts" """
    }
}


def runSonarContainer(project){
  def porta = runSonar("9001")
  verifySonarContainer()
  verifySonarIsAvailable(porta)
  verifySonarIsGreen(porta)
  setSonarCredentials(porta)
  createQualityGate(porta, project)
  createQualityProfile(porta, project)
  return porta
}


def runSonarAnalysis(project, source, porta){
  sh """yarn sonar-scanner -Dsonar.scm.disabled="true" -Dsonar.host.url=http://localhost:${porta} -Dsonar.login="admin" -Dsonar.password="sonar" -Dsonar.projectKey=${project} -Dsonar.projectVersion=${source} """
}
def runSonarAnalysis_v2(project, source, porta){
  sh """yarn sonar-scanner -Dsonar.scm.disabled="true" -Dsonar.host.url=http://localhost:${porta} -Dsonar.login="admin" -Dsonar.password="sonar" -Dsonar.projectKey=${project} -Dsonar.projectVersion=${source} -Dsonar.sources=src/data """
}

def translateSonarMessage(metric){
    def result = ''
    switch(metric.metricKey) {
    case "new_coverage":
        result = "\n - O Coverage do novo código foi de ${Double.parseDouble(metric.actualValue).round(2)}%, valor mínimo de ${metric.errorThreshold}% não foi alcançado."
        break
    case "new_duplicated_lines_density":
        result = "\n - Novas linhas de código duplicado foi de ${Double.parseDouble(metric.actualValue).round(2)}% ,o valor máximo permitido de ${metric.errorThreshold}% foi ultrapassado."
        break
    case "new_bugs":
        result = "\n - Novos Bugs foi de ${metric.actualValue}, o valor máximo permitido de ${metric.errorThreshold} foi ultrapassado."
        break
    case "new_code_smells":
        result = "\n - Novos Code Smells foi de ${Double.parseDouble(metric.actualValue).round(0)}, valor mínimo de ${metric.errorThreshold} não foi alcançado."
        break
    case "new_vulnerabilities":
        result = "\n - Novas Vulnerabilidades foi de ${metric.actualValue}, o valor máximo permitido de ${metric.errorThreshold} foi ultrapassado."
        break
    default:
        result = "\n - ${metric.metricKey}: valor obtido:  ${metric.actualValue} , valor permitido: ${metric.errorThreshold}"
    }
    return result
}

def projectFailureSlackMessage(conditionsFailed, repository) {
    def errors = 'Parâmetros recusados:'
    conditionsFailed.each { metric ->
        if (metric.status == "ERROR") {
            errors = errors + translateSonarMessage(metric)
        }
    }
    pipelineNotify.slackSendMessage("$PIPELINE_NAME: O QualityGate do ${repository} reprovou! \n ${errors} \n Execute o sonar localmente para avaliar outros possíveis erros!", '#f00')
}

def verifyQualityGate(project, repository, porta){
    try{
        def qualityStatus = readJSON text: sh(returnStdout: true, script: """curl -u admin:sonar -X GET "http://localhost:${porta}/api/qualitygates/project_status?projectKey=${project}" """)
        while (!qualityStatus.projectStatus.periods){
            sleep(30)
            echo "${qualityStatus}"
            qualityStatus = readJSON text: sh(returnStdout: true, script: """curl -u admin:sonar -X GET "http://localhost:${porta}/api/qualitygates/project_status?projectKey=${project}" """)
        }
        echo "${qualityStatus}"
        if (qualityStatus.projectStatus.status == "ERROR"){
            throw new Exception("Quality gate reprovado")
       }
   }catch(err){
       error err.message
    }
}

def removeSonarContainer(){
    sh "docker rm -f sonar-${env.BUILD_NUMBER}"
}

def dockerRun(String script, Boolean getReturn = false){
    if(getReturn){
        def scriptReturn = sh(returnStdout: true, script: """docker run --rm -v ${pwd()}:/app -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN minhaclaro:pipeline /bin/bash -c "$script" """) // CCOE 
        
        return scriptReturn;
    }

    def status = sh(returnStatus: true, script: """docker run --rm -v ${pwd()}:/app -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN minhaclaro:pipeline /bin/bash -c "$script" """) // CCOE
    
    if(status != 0){
        throw new Exception()
    }
    return status
}

pipeline {
    agent any
    stages {
        stage('Verifying modified files')           { steps { script { verifyFilesModified() } } }
        stage('OWASP Zap'){
          steps{
              script{
                sh "yarn install && node dist/main/server.js >> output.log &"
                sleep(30)
                sh "docker run --rm -t owasp/zap2docker-stable zap-baseline.py -t http://192.168.1.2:5050"
              }
          }
         }
    }
}