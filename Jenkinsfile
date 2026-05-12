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
                    echo "Cleaning up old container..."
                    docker rm -f $CONTAINER_NAME || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building image..."
                    docker build -f app/Dockerfile.production -t $IMAGE_NAME:$IMAGE_TAG app
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    echo "Starting container..."
                    docker run -d \
                        -e PORT=$PORT \
                        -p $HOST_PORT:$PORT \
                        --name $CONTAINER_NAME \
                        $IMAGE_NAME:$IMAGE_TAG

                    echo "Waiting for container to start..."
                    sleep 5

                    docker ps | grep $CONTAINER_NAME
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Starting health checks..."

                    for i in 1 2 3 4 5
                    do
                        echo "Attempt $i"

                        STATUS=$(docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)

                        if [ "$STATUS" != "true" ]; then
                            echo "Container is not running!"
                            docker logs $CONTAINER_NAME
                            exit 1
                        fi

                        if docker exec $CONTAINER_NAME curl -sf http://localhost:3000/health; then
                            echo "Health check PASSED"
                            exit 0
                        fi

                        echo "Attempt $i failed"
                        sleep 5
                    done

                    echo "Health check FAILED"
                    docker logs $CONTAINER_NAME
                    exit 1
                '''
            }
        }

        stage('Logs (Debug)') {
            steps {
                sh '''
                    echo "Container logs:"
                    docker logs $CONTAINER_NAME || true
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline SUCCESS ✔"
        }

        failure {
            echo "Pipeline FAILED ❌ - check logs above"
        }

        always {
            sh '''
                echo "Cleaning up container..."
                docker rm -f $CONTAINER_NAME || true
            '''
            echo "Pipeline finished"
        }
    }
}