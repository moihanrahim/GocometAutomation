// Optional: Docker Pipeline plugin + Playwright image
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.52.0-noble'
            args '-u root:root'
        }
    }

    environment {
        CI = 'true'
        API_BASE_URL = 'https://reqres.in'
        REQRES_ENV = 'off'
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
        stage('API Tests') {
            steps {
                script {
                    if (env.REQRES_PUBLIC_KEY?.trim()) {
                        sh 'npm run test:api'
                    } else {
                        withCredentials([string(credentialsId: 'reqres-public-key', variable: 'REQRES_PUBLIC_KEY')]) {
                            sh 'npm run test:api'
                        }
                    }
                }
            }
        }
        stage('UI Tests') {
            steps { sh 'npm run test:ui' }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                    archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true
                }
            }
        }
    }
}
