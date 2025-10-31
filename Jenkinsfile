// Jenkinsfile

pipeline {
    agent any
    
    tools {
        // 젠킨스 Global Tool Configuration에 설정한 NodeJS 이름
        nodejs 'NodeJS 22' 
    }
    
    stages {
        stage('1. Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('2. Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('3. Deploy to Synology NAS') {
            steps {
                echo 'Deploying to Synology NAS via SSH...'
                
                // useNotes Context 코드의 복잡한 로직이 아니므로,
                // saveNote 같은 React 로직 대신 배포 자체에 집중합니다.
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'My-Synology-NAS', // 젠킨스에 등록된 NAS 서버 이름
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'build/**', 
                                    removePrefix: 'build', 
                                    remoteDirectory: '/web/notion' // NAS 웹 스테이션 폴더
                                )
                            ],
                            execCommand: 'echo "Deployment finished!"' 
                        )
                    ]
                )
            }
        }
    }

    post {
        always {
            deleteDir() 
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}