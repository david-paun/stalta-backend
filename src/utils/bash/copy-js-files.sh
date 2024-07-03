#!/bin/bash

# Source and destination directories
SRC_DIR="src"
DEST_DIR="dist"

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Find all .js files in the source directory and copy them to the destination directory, preserving the directory structure
find "$SRC_DIR" -name "*.js" | while read -r file; do
  # Get the relative path of the file
  relative_path="${file#$SRC_DIR/}"
  
  # Create the target directory structure in the destination
  mkdir -p "$DEST_DIR/$(dirname "$relative_path")"
  
  # Copy the file to the destination directory
  cp "$file" "$DEST_DIR/$relative_path"
done

echo "JavaScript files copied successfully!"

