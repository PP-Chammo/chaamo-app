#!/bin/bash

echo "🔧 Running GraphQL Codegen before EAS install..."

# Exit if any command fails
set -e

# Run GraphQL Code Generator
npx dotenv -e .env -- graphql-codegen --config codegen.yml

echo "✅ GraphQL types generated successfully."
