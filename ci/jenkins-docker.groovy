// Optional: use only if the Docker Pipeline plugin is installed on Jenkins.
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

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install chromium'
            }
        }
        stage('Test') {
            steps { sh 'npm test' }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                    archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true
                }
            }
        }
        stage('Deploy') {
            steps { echo 'Report in playwright-report artifact' }
        }
    }
}
