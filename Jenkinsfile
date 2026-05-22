pipeline {
    agent any

    environment {
        CI = 'true'
        BASE_URL = 'https://opensource-demo.orangehrmlive.com'
        ADMIN_USERNAME = 'Admin'
        ADMIN_PASSWORD = 'admin123'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling code from GitHub'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Installing dependencies and Playwright browsers'
                script {
                    if (isUnix()) {
                        sh 'node -v && npm -v'
                        sh 'npm ci'
                        sh 'npx playwright install --with-deps chromium'
                    } else {
                        bat 'node -v && npm -v'
                        bat 'npm ci'
                        bat 'npx playwright install chromium'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running Playwright UI tests'
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
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

        stage('Deploy') {
            steps {
                echo 'Playwright report saved in build artifacts (playwright-report/)'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed — check console log and archived test-results'
        }
    }
}
