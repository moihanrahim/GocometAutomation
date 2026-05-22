// Declarative pipeline for agents WITHOUT Docker (Node.js 20+ on the Jenkins agent).
// Rename to Jenkinsfile or load via Jenkins "Pipeline script from SCM" if you do not use Docker.

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'  // Configure in Jenkins → Global Tool Configuration
    }

    environment {
        CI = 'true'
        BASE_URL = 'https://opensource-demo.orangehrmlive.com'
        ADMIN_USERNAME = 'Admin'
        ADMIN_PASSWORD = 'admin123'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
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
                echo 'Installing dependencies'
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium'
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
                echo 'Test report archived — download playwright-report from build artifacts'
            }
        }
    }
}
