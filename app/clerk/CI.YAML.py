name: CI (Python)

on:
  push:
    branches: [ main, master, 'release/**' ]
  pull_request:
    branches: [ '**' ]
  workflow_dispatch:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-dev.txt
      - name: Lint with Ruff
        run: |
          ruff check .
      - name: Format check with Black (optional)
        run: |
          black --check .
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-dev.txt
      - name: Type check (mypy)
        run: |
          mypy src tests
  test:
    runs-on: ubuntu-latest
    services:
      - name: postgres
        image: postgres:15
        ports: [5432:5432]
        options: >-
          --health-cmd="pg_isready -U postgres" --health-interval=10s --health-timeout=5s --health-retries=5
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_USER: postgres
          POSTGRES_DB: testdb
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-dev.txt
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
        run: |
          pytest --color=yes
      - name: Coverage
        run: |
          pytest --cov=src --cov-report=xml
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install pip-audit
      - name: Run dependency audit
        run: |
          pip audit

  # Optional: publish on tag
  release:
    if: startsWith(github.ref, 'refs/tags/')
    runs-on: ubuntu-latest
    needs: [lint, type-check, test]
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Build package
        run: |
          python -m pip install --upgrade build
          python -m build
      - name: Publish to PyPI
        uses: pypa/gh-action-pypi-publish@v1.4.2
        with:
          user: __token__
          password: ${{ secrets.PYPI_API_TOKEN }}
