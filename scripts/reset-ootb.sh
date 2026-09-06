#!/usr/bin/env bash
# Reverts all ACUL screens to Auth0 standard (OOTB) rendering.
# Run: ./scripts/reset-ootb.sh

SETTINGS="$(dirname "$0")/settings-standard.json"

SCREENS=(
  login-id
  login-password
  mfa-otp-challenge
  mfa-sms-challenge
  signup-id
  signup-password
)

for screen in "${SCREENS[@]}"; do
  echo "Resetting $screen → standard..."
  auth0 acul config set "$screen" --file "$SETTINGS"
done

echo "Done. All screens are back to OOTB."
