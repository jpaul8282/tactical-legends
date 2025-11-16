name: CI (Python)

on:
  push:
    branches: [ main, master, 'release/**' ]
  pull_request:
    branches: [ '**' ]
  workflow_dispatch:

jobs:
  lint-format-type:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install build tools
        run: python -m pip install --upgrade pip setuptools wheel
      - name: Install dev dependencies
        run: |
          if [ -f requirements-dev.txt ]; then \
            python -m pip install -r requirements-dev.txt; \
          fi
      - name: Ruff lint
        run: |
          python -m pip install ruff
          ruff check .
      - name: Black format check
        run: |
          python -m pip install black
          black --check .
      - name: Ruff formatting download (optional, ensures cache hit)
        run: echo "ruff formatting check skipped; using Ruff for linting only"

  type-check:
    runs-on: ubuntu-latest
    needs: lint-format-type
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dev dependencies
        run: |
          if [ -f requirements-dev.txt ]; then \
            python -m pip install -r requirements-dev.txt; \
          fi
      - name: Mypy type check
        run: |
          python -m pip install mypy
          # adjust paths if your package is named differently
          mypy services/api tests

  test:
    runs-on: ubuntu-latest
    services:
      # Optional: use a database if your tests require one
      # - name: postgres
      #   image: postgres:15
      #   ports: [5432:5432]
      #   env:
      #     POSTGRES_PASSWORD: postgres
      #     POSTGRES_USER: postgres
      #     POSTGRES_DB: testdb
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install deps
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
          if [ -f requirements-dev.txt ]; then pip install -r requirements-dev.txt; fi
      - name: Run tests with pytest
        env:
          PYTHONWARNINGS: "default"
        run: |
          # If you have a test database, configure via env vars as needed
          pytest --color=yes
      - name: Coverage
        run: |
          pytest --cov=services/api --cov-report=xml
      - name: Upload coverage to Codecov (optional)
        if: always()
        uses: codecov/codecov-action@v3
        with:
          fail_ci_if_error: false
          file: ./coverage.xml

  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install pip-audit
        run: |
          python -m pip install --upgrade pip
          python -m pip install pip-audit
      - name: Run dependency audit
        run: |
          pip-audit

  release-pypi:
    if: startsWith(github.ref, 'refs/tags/')
    runs-on: ubuntu-latest
    needs: [lint-format-type, test]
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Build distribution
        run: |
          python -m pip install --upgrade build
          python -m build
      - name: Publish to PyPI
        uses: pypa/gh-action-pypi-publish@v1.4.2
        with:
          user: __token__
          password: ${{ secrets.PYPI_API_TOKEN }} 

name: Release to PyPI

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install build tools
        run: |
          python -m pip install --upgrade pip build setuptools wheel
      - name: Build
        run: |
          python -m build
      - name: Publish PyPI
        uses: pypa/gh-action-pypi-publish@v1.4.2
        with:
          user: __token__
          password: ${{ secrets.PYPI_API_TOKEN }}

name: Release Docker Image

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2
      - name: Set up Docker Buildx
        uses: docker/setup-qemu-action@v2
      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_PASSWORD }}
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/my-python-app:${{ github.sha }}
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/my-python-app:latest

[tool.black]
line-length = 88
target-version = ['py311']

[tool.ruff]
line-length = 88
select = ["E", "F", "W", "I", "Q"]
ignore = ["W503"]

[tool.mypy]
python_version = "3.11"
files = ["services/api", "tests"]

[tool.ruff]
line-length = 88
select = ["E", "F", "W", "C", "N"]

ruff
black
pytest
pytest-cov
mypy
codecov
pip-audit

FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements-dev.txt

# Copy app
COPY . .

# If your service exposes a CLI or entrypoint, adjust accordingly
CMD ["python", "-m", "services.api"]

__pycache__
node_modules
*.pyc
build
dist
.eggs
.env
