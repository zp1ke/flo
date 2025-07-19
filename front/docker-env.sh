#!/bin/sh

# Loop through environment variables placeholders
for var in $(env | grep FLO_); do
  key=$(echo "$var" | cut -d '=' -f 1)
  value=$(echo "$var" | cut -d '=' -f 2-)

  # Find files containing the placeholder and replace it with the value
  find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -print0 | xargs -0 grep -l "$key" | \
  while IFS= read -r file; do
    sed -i "s|${key}|${value}|g" "$file"
  done
done
