pipeline {
    agent any

    environment {
        CI = 'true'
        API_BASE_URL = 'https://reqres.in'
        REQRES_ENV = 'off'
        BASE_URL = 'https://opensource-demo.orangehrmlive.com'
        ADMIN_USERNAME = 'Admin'
        ADMIN_PASSWORD = 'admin123'
    }

    options {
        timeout(time: 45, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci && npx playwright install --with-deps chromium'
                    } else {
                        bat 'npm ci && npx playwright install chromium'
                    }
                }
            }
        }

        stage('API Tests') {
            steps {
                script {
                    runApiTests()
                }
            }
        }

        stage('UI Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run test:ui'
                    } else {
                        bat 'npm run test:ui'
                    }
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                    archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        success {
            echo 'API + UI suites finished — see playwright-report artifact'
        }
        failure {
            echo 'Pipeline failed — check API/UI stage logs and junit.xml'
        }
    }
}

/** Run API suite when REQRES_PUBLIC_KEY is available (job env or Jenkins credential). */
def runApiTests() {
    def execute = {
        if (isUnix()) {
            sh 'npm run test:api'
        } else {
            bat 'npm run test:api'
        }
    }

    if (env.REQRES_PUBLIC_KEY?.trim()) {
        echo 'Using REQRES_PUBLIC_KEY from job environment'
        execute()
        return
    }

    try {
        withCredentials([string(credentialsId: 'reqres-public-key', variable: 'REQRES_PUBLIC_KEY')]) {
            echo 'Using REQRES_PUBLIC_KEY from Jenkins credential reqres-public-key'
            execute()
        }
    } catch (Exception e) {
        error(
            'API Tests need REQRES_PUBLIC_KEY. Fix one of:\n' +
            '  1) Jenkins → Manage Credentials → Add Secret text, ID: reqres-public-key (your pub_* key)\n' +
            '  2) Job → Configure → Build Environment → Environment variables → REQRES_PUBLIC_KEY=pub_...\n' +
            "Details: ${e.message}"
        )
    }
}
