pipeline {
    agent any

    environment {
        IMAGE_NAME = "kk-payments"
        IMAGE_TAG = "1.0.0"
        CONTAINER_NAME = "kk-payments-test"
        HOST_PORT = "4001"
        CONTAINER_PORT = "3000"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Validate Docker') {
            steps {
                sh '''
                    echo "Checking Docker..."
                    docker --version
                    docker ps
                '''
            }
        }

        stage('Cleanup Old Container') {
            steps {
                sh '''
                    echo "Removing old container if it exists..."
                    docker rm -f kk-payments-test || true
                '''
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker build -f app/Dockerfile.production -t kk-payments:1.0.0 app
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    echo "Starting container..."
                    docker run -d \
                        --name kk-payments-test \
                        -p 4001:3000 \
                        kk-payments:1.0.0
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Skipping health check (dev mode)"

                   
                            exit 0
                        
                '''
            }
        }

        stage('Logs') {
            steps {
                sh '''
                    echo "Container logs:"
                    docker logs kk-payments-test || true
                '''
            }
        }
    }

    post {
        always {
            sh '''
                echo "Final cleanup..."
                docker rm -f kk-payments-test || true
            '''
        }

        success {
            echo "Pipeline SUCCESS ✅"
        }

        failure {
            echo "Pipeline FAILED ❌ (check logs above)"
        }
    }
}