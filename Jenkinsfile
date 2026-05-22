pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.52.0-noble'
            args '-u root:root'
        }
    }

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
                sh 'node -v && npm -v'
                sh 'npm ci'
                sh 'npx playwright install chromium'
            }
        }

        stage('Test') {
            steps {
                echo 'Running Playwright UI tests'
                sh 'npm test'
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
                echo 'Publishing test report (requires HTML Publisher plugin)'
                publishHTML(target: [
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'playwright-report',
                    reportFiles          : 'index.html',
                    reportName           : 'Playwright HTML Report',
                    reportTitles         : 'Playwright Report'
                ])
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed — check Playwright artifacts and console logs'
        }
    }
}
