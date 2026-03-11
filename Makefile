CHART_VERSION ?= $(shell git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//')

.PHONY: helm
helm:
	@echo "Usage: make helm-<command>"
	@echo "Available commands:"
	@echo "  helm-package   Package the Helm chart"
	@echo "  helm-publish   Publish the Helm chart"

.PHONY: helm-package
helm-package: CHART_DIR := ./deployment
helm-package:
	@echo "📦 Packaging Helm chart..."
	@helm package -u --version $(CHART_VERSION) --app-version $(CHART_VERSION) $(CHART_DIR) > /dev/null