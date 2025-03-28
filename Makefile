.PHONY: build
build:
	@docker-compose -f docker-compose.yml build

.PHONY: up
up:
	@docker-compose -f docker-compose.yml up -d

.PHONY: debug
debug:
	@docker-compose -f docker-compose.yml -f docker-compose.debug.yml up --build -d

.PHONY: down
down:
	@docker-compose -f docker-compose.yml down