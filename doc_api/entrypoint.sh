#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /rails-app/tmp/pids/server.pid

exec "$@"
# bundle exec rails server -p 4000 -b 0.0.0.0