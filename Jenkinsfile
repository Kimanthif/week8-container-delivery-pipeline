pipeline {
    agent any

    environment {
        IMAGE_NAME = "kk-payments"
        IMAGE_TAG = "1.0.0"
        PORT = "3000"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
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
                    docker run -d --rm \
                    -e PORT=$PORT \
                    -p 4001:3000 \
                    --name kk-payments-test \
                    $IMAGE_NAME:$IMAGE_TAG
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    sleep 5
                    curl -f http://localhost:4001/health
                """
            }
        }

        stage('Cleanup') {
            steps {
                sh """
                    docker stop kk-payments-test || true
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
        }
    }
}