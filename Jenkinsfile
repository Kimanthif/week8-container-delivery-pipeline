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
                sh """
                    echo "Stopping and removing old container if it exists..."
                    docker rm -f $CONTAINER_NAME || true
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                    -f app/Dockerfile.production \
                    -t $IMAGE_NAME:$IMAGE_TAG \
                    app
                """
            }
        }

        stage('Run Container') {
            steps {
                sh """
                    docker run -d \
                    -e PORT=$PORT \
                    -p $HOST_PORT:$PORT \
                    --name $CONTAINER_NAME \
                    $IMAGE_NAME:$IMAGE_TAG
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Waiting for service to stabilize..."
                    sleep 10

                    echo "Retrying health check..."
                    for i in 1 2 3 4 5; do
                        curl -f http://localhost:4001/health && exit 0
                        echo "Attempt $i failed, retrying..."
                        sleep 3
                    
                    done

                    echo "Health check failed"
                    exit 1
                """
            }
        }

        stage('Logs (Debug)') {
            steps {
                sh """
                    echo "Showing container logs..."
                    docker logs $CONTAINER_NAME || true
                """
            }
        }

        stage('Cleanup') {
            steps {
                sh """
                    echo "Cleaning up container..."
                    docker rm -f $CONTAINER_NAME || true
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline SUCCESS ✔"
        }
        failure {
            echo "Pipeline FAILED ❌ - check logs"
        }
        always {
            echo "Pipeline completed"
        }
    }
}