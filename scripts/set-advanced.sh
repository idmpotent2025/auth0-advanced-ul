#!/usr/bin/env bash
# Enables Auth0 ACUL advanced rendering for all screens.
# Points each screen at the Vercel-hosted bundle.
# Run: ./scripts/set-advanced.sh

SETTINGS="$(dirname "$0")/settings-advanced.json"

SCREENS=(
  login-id
  login-password
  mfa-otp-challenge
  mfa-sms-challenge
  signup-id
  signup-password
)

for screen in "${SCREENS[@]}"; do
  echo "Setting $screen → advanced..."
  auth0 acul config set "$screen" --file "$SETTINGS"
done

echo "Done. All screens are on advanced rendering."
