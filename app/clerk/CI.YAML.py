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


name: CI Monorepo

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ '**' ]
  workflow_dispatch:

jobs:
  python-service:
    name: Python service
    runs-on: ubuntu-latest
    steps: ...
    # Use the Python workflow from above or inline steps
  web-ui:
    name: Web UI (Node)
    runs-on: ubuntu-latest
    steps: ...
    # Use the Node.js workflow from above

  # Optionally a shared cache
  cache:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/cache@v4
        with:
          path: |
            ~/.cache/pip
            node_modules/.cache
          key: ${{ runner.os }}-cache-${{ hashFiles('**/requirements.txt') }}-${{ hashFiles('**/package-lock.json') }}

image: python:3.11

stages:
  - lint
  - test
  - audit
  - publish

cache:
  paths:
    - .cache/pip

lint:
  stage: lint
  script:
    - pip install --upgrade pip
    - pip install ruff black
    - ruff check .
    - black --check .

test:
  stage: test
  script:
    - pip install -r requirements-dev.txt
    - pytest --maxfail=1 --disable-warnings -q

audit:
  stage: audit
  script:
    - pip install pip-audit
    - pip audit

publish:
  stage: publish
  script:
    - echo "Add your publish steps here (e.g., python -m build && twine upload dist/*)"
  only:
    - tags

