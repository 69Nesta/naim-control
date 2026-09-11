build:
	docker build -t naim-web:local .

clean:
	rm -rf target
	rm -rf frontend/dist
	rm -rf frontend/node_modules

run:
	docker compose up --build

test:
	cargo test --workspace

dev:
	docker compose -f docker-compose.dev.yml up --build

down:
	docker compose down

down-dev:
	docker compose -f docker-compose.dev.yml down


.PHONY: build clean run test dev down down-dev
