infrastructure/destroy:
	docker-compose down

shell:
	docker-compose run --service-ports --rm api sh

compose/test-with-coverage:
	docker-compose run --rm api npm run test:coverage

compose/typecheck:
	docker-compose run --no-deps --rm api npm run typecheck:full

compose/npm-audit:
	docker-compose run --no-deps --rm api npm audit --prod --audit-level=moderate

prod-image/inspect:
	npm run build
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm api-prod sh