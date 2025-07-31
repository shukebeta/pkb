#!/bin/bash

# Usage: ./create-project.sh ProjectName

if [ -z "$1" ]; then
    echo "Usage: ./create-project.sh ProjectName"
    exit 1
fi

PROJECT_NAME=$1
TEMPLATE_DIR="$(dirname "$0")"

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Copy template files
cp "$TEMPLATE_DIR/template.csproj" "$PROJECT_NAME.csproj"
cp "$TEMPLATE_DIR/Program.cs" .
cp "$TEMPLATE_DIR/appsettings.json" .
cp "$TEMPLATE_DIR/WeatherForecast.cs" .

# Copy Controllers directory
mkdir -p Controllers
cp "$TEMPLATE_DIR/Controllers/WeatherController.cs" Controllers/

# Replace namespace in files
sed -i "s/namespace Template/namespace $PROJECT_NAME/g" Controllers/WeatherController.cs
sed -i "s/namespace Template/namespace $PROJECT_NAME/g" WeatherForecast.cs

echo "Project '$PROJECT_NAME' created successfully!"
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. dotnet restore"
echo "3. dotnet run"
echo "4. Open http://localhost:5341 for Seq logs"