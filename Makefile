.PHONY: up

up:
	docker-compose up -d

.PHONY: server

server:
	docker-compose up -d server

.PHONY: down

down:
	docker-compose down

.PHONY: logs

logs:
	docker-compose logs -f