pipeline {
    agent any

    environment {
        CI = 'true'
        API_BASE_URL = 'https://reqres.in'
        REQRES_ENV = 'off'
        // TODO: move to Jenkins credential reqres-public-key before making repo public
        REQRES_PUBLIC_KEY = 'pub_59aefcd965c07769d7e5587327c6b03ef5a66426f083c8e03ee296e9fe9a64f3'
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
            environment {
                PLAYWRIGHT_HTML_DIR = 'playwright-report/api'
                PLAYWRIGHT_JUNIT = 'test-results/junit-api.xml'
            }
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    script {
                        if (isUnix()) {
                            sh 'npm run test:api'
                        } else {
                            bat 'npm run test:api'
                        }
                    }
                }
            }
        }

        stage('UI Tests') {
            environment {
                PLAYWRIGHT_HTML_DIR = 'playwright-report/ui'
                PLAYWRIGHT_JUNIT = 'test-results/junit-ui.xml'
            }
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    script {
                        if (isUnix()) {
                            sh 'npm run test:ui'
                        } else {
                            bat 'npm run test:ui'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/junit-*.xml'
            archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true
            echo 'Reports: playwright-report/api/index.html and playwright-report/ui/index.html'
        }
        unstable {
            echo 'One or more tests failed — build is UNSTABLE. Check JUnit tab and HTML report artifact.'
        }
        failure {
            echo 'Build failed during checkout or build — not a test assertion failure.'
        }
    }
}
