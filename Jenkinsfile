pipeline {
    agent {
        docker {
            image 'node:22-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
            reuseNode true
        }
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
            agent any
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
            }
        }
        
        stage('Deploy') {
            agent any
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
            agent any
            steps {
                echo 'Running health check...'
                sh 'sleep 5'
                sh 'curl -f http://localhost:3000/health || exit 1'
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