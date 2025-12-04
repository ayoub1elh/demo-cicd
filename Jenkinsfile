pipeline {
    agent any
    
    tools {
        nodejs 'Nodejs22'
    }
    
    environment {
        DOCKER_IMAGE = 'jenkins-demo-app'
        CONTAINER_NAME = 'demo-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p 127.0.0.1:3000:3000 \
                        ${DOCKER_IMAGE}:latest
                """
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Running health check...'
                sh 'sleep 10'
                sh '''
                    for i in 1 2 3 4 5; do
                        if docker exec ${CONTAINER_NAME} wget -q -O- http://localhost:3000/health; then
                            echo "Health check passed!"
                            exit 0
                        fi
                        echo "Attempt $i failed, retrying..."
                        sleep 2
                    done
                    echo "Health check failed after 5 attempts"
                    exit 1
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded! 🎉'
        }
        failure {
            echo 'Pipeline failed! ❌'
        }
        always {
            echo 'Cleaning up old Docker images...'
            sh 'docker image prune -f'
        }
    }
}