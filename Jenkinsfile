pipeline {
    agent any

    environment {
        IMAGE_NAME = "kk-payments"
        IMAGE_TAG = "1.0.0"
        PORT = "3000"
        HOST_PORT = "4001"
        CONTAINER_NAME = "kk-payments-test"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Validate Docker') {
            steps {
                script {
                    sh '''
                        echo "Checking Docker availability..."
                        if ! command -v docker >/dev/null 2>&1; then
                            echo "Docker is not installed or not in PATH"
                            exit 1
                        fi

                        docker --version || exit 1
                    '''
                }
            }
        }

        stage('Cleanup Old Container') {
            steps {
                script {
                    sh """
                        echo "Cleaning up old container (safe mode)..."
                        docker rm -f ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        echo "Building Docker image..."
                        docker build -f app/Dockerfile.production -t ${IMAGE_NAME}:${IMAGE_TAG} app
                    """
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    sh """
                        echo "Running container..."
                        docker run -d \
                          --name ${CONTAINER_NAME} \
                          -p ${HOST_PORT}:${PORT} \
                          ${IMAGE_NAME}:${IMAGE_TAG} || {
                              echo "Container failed to start"
                              docker logs ${CONTAINER_NAME} || true
                              exit 1
                          }
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sh """
                        echo "Running health check..."
                        sleep 5

                        if ! curl -f http://localhost:${HOST_PORT}/health; then
                            echo "Health check failed"
                            docker logs ${CONTAINER_NAME} || true
                            exit 1
                        fi
                    """
                }
            }
        }

        stage('Logs (Debug)') {
            steps {
                script {
                    sh """
                        echo "Container logs:"
                        docker logs ${CONTAINER_NAME} || true
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                sh """
                    echo "Final cleanup (safe)..."
                    docker rm -f ${CONTAINER_NAME} || true
                """
            }
        }

        success {
            echo "Pipeline SUCCESS ✅"
        }

        failure {
            echo "Pipeline FAILED ❌ (check logs above)"
        }
    }
}