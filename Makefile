build:
	docker-compose run --rm node /bin/bash -c "npm install & npm run build"
server:
	ruby -rwebrick -e 'WEBrick::HTTPServer.new(:DocumentRoot => "./", :Port => 80).start'
