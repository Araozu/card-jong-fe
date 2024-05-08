pipeline {
    agent any
    stages {
        stage("Populate env") {
            steps {
                sh 'rm .env || true'
                sh 'echo VITE_BACKEND_URL=https://rimajon2.araozu.dev>>.env'
                sh 'echo VITE_WS_URL=wss://rimajon2.araozu.dev>>.env'
            }
        }
        stage('Build') {
            agent {
                docker {
                    image "ianwalter/pnpm"
                    reuseNode true
                }
            }
            steps {
                sh 'pnpm i'
                sh 'pnpm build'
            }
        }
        stage('Deploy') {
            steps {
                sh 'rm -rf /var/www/rimajon2/*'
                sh 'cp -r ./dist/* /var/www/rimajon2/'
            }
        }
    }
}
