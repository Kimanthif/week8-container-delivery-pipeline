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

        stage('Cleanup Old Container') {
            steps {
                sh '''
                    echo "Stopping and removing old container if it exists..."
                    docker rm -f kk-payments-test || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -f app/Dockerfile.production -t kk-payments:1.0.0 app
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    echo "Starting container..."
                    docker run -d \
                        -e PORT=3000 \
                        -p 4001:3000 \
                        --name kk-payments-test \
                        kk-payments:1.0.0
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for service to start..."
                    sleep 10

                    echo "Running health checks..."

                    for i in 1 2 3 4 5
                    do
                        echo "Attempt $i"
                        if curl -f http://localhost:4001/health; then
                            echo "Health check PASSED"
                            exit 0

                        fi
                        echo "Attempt failed"
                        sleep 3
                    done

                    echo "Health check FAILED"
                    docker logs kk-payments-test || true
                    exit 1
                '''
            }
        }

        stage('Logs (Debug)') {
            steps {
                sh '''
                    echo "Container logs:"
                    docker logs kk-payments-test || true
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    echo "Cleaning up container..."
                    docker rm -f kk-payments-test || true
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline SUCCESS ✔"
        }
        failure {
            echo "Pipeline FAILED ❌"
        }
        always {
            echo "Pipeline completed"
        }
    }
}