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
                    echo " Cleaning up old container..."
                    docker rm -f $CONTAINER_NAME || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "🐳 Building Docker image..."
                    docker build -f app/Dockerfile.production -t $IMAGE_NAME:$IMAGE_TAG app
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    echo " Starting container..."

                    docker run -d \
                        --name kk-payments-test \
                        --network cicd-net \
                        -e PORT=3000 \
                        -p 4001:3000 \
                        kk-payments:1.0.0

                    echo " Waiting for container to stabilize..."
                    sleep 8

                    docker ps | grep $CONTAINER_NAME || (echo "Container failed to start" && exit 1)
                '''
            }
        }

        stage('Health Check (Final Boss Mode)') {
            steps {
                sh '''
                    echo " Running health checks..."

                    for i in 1 2 3 4 5 6 7 8 9 10
                    do
                        echo "Attempt $i"

                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$HOST_PORT/health || true)

                        if [ "$STATUS" = "200" ]; then
                            echo "✅ Health check PASSED"
                            exit 0
                        fi

                        echo "❌ Got status: $STATUS"
                        sleep 3
                    done

                    echo " Health check FAILED"
                    echo " Container logs:"
                    docker logs $CONTAINER_NAME || true

                    exit 1
                '''
            }
        }

        stage('Logs (Debug)') {
            steps {
                sh '''
                    echo " Final container logs:"
                    docker logs $CONTAINER_NAME || true
                '''
            }
        }
    }

    post {
        success {
            echo " Pipeline SUCCESS ✔"
        }
        failure {
            echo " Pipeline FAILED ❌"
        }
        always {
            sh '''
                echo " Final cleanup..."
                docker rm -f $CONTAINER_NAME || true
            '''
            echo "Pipeline finished"
        }
    }
}