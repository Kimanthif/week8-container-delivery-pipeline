pipeline {
    agent any

    environment {
        IMAGE_NAME = "kk-payments"
        IMAGE_TAG = "1.0.0"
        CONTAINER_NAME = "kk-payments-test"
        PORT = "3000"
        HOST_PORT = "4001"
        HEALTH_URL = "http://localhost:4001/health"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Cleanup Old Container') {
            steps {
                sh """
                    echo "Cleaning up old container if it exists..."
                    docker rm -f ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    echo "Building Docker image..."
                    docker build -f app/Dockerfile.production \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} app
                """
            }
        }

        stage('Run Container') {
            steps {
                sh """
                    echo "Starting container..."
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -e PORT=${PORT} \
                        -p ${HOST_PORT}:${PORT} \
                        ${IMAGE_NAME}:${IMAGE_TAG}

                    echo "Waiting for container to initialize..."
                    sleep 5

                    docker ps | grep ${CONTAINER_NAME}
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Starting health check..."

                   retries=10
                    COUNT=1

                    until [ $count -gt $retries ]
                    do
                        echo "Attempt $count"

                        code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4001/health || true)

                        if [ "$code" = "200" ]; then
                            echo "Health check PASSED"
                            exit 0
                        fi

                        echo "❌ Attempt $count failed (status: $code)"
                        count=$((count+1))
                        sleep 5
                    done

                    echo "❌ Health check FAILED after retries"

                    echo "---- Container logs ----"
                    docker logs kk-payments-test || true

                    exit 1
                """
            }
        }

        stage('Logs (Debug)') {
            steps {
                sh """
                    echo "Final container logs:"
                    docker logs ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Cleanup') {
            steps {
                sh """
                    echo "Cleaning up container..."
                    docker rm -f ${CONTAINER_NAME} || true
                """
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