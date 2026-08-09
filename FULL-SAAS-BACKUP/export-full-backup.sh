#!/usr/bin/env bash
# Creates a complete portable backup of zzzbestmaxlit source code + assets.
# Excludes: node_modules, .next, .git, secrets (.env.local), build caches.
#
# Usage (from project root):
#   ./FULL-SAAS-BACKUP/export-full-backup.sh
#
# Output:
#   FULL-SAAS-BACKUP/snapshots/zzzbestmaxlit-YYYY-MM-DD-HHMMSS/
#   FULL-SAAS-BACKUP/snapshots/zzzbestmaxlit-YYYY-MM-DD-HHMMSS.tar.gz

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$ROOT/FULL-SAAS-BACKUP"
STAMP="$(date +%Y-%m-%d-%H%M%S)"
SNAPSHOT_NAME="zzzbestmaxlit-$STAMP"
SNAPSHOT_DIR="$BACKUP_DIR/snapshots/$SNAPSHOT_NAME"
ARCHIVE="$BACKUP_DIR/snapshots/$SNAPSHOT_NAME.tar.gz"

mkdir -p "$SNAPSHOT_DIR"

echo "==> Exporting zzzbestmaxlit to $SNAPSHOT_DIR"

# Copy entire project source (rsync excludes secrets and caches)
rsync -a \
  --exclude 'node_modules/' \
  --exclude '.next/' \
  --exclude 'out/' \
  --exclude 'build/' \
  --exclude '.git/' \
  --exclude '.vercel/' \
  --exclude 'coverage/' \
  --exclude '.DS_Store' \
  --exclude '.env.local' \
  --exclude '.env.vercel.prod' \
  --exclude 'supabase/.env.local' \
  --exclude 'supabase/.env.local.save' \
  --exclude 'supabase/.temp/' \
  --exclude '.gemini-key.local' \
  --exclude 'FULL-SAAS-BACKUP/snapshots/' \
  "$ROOT/" "$SNAPSHOT_DIR/"

# Write manifest with git info
MANIFEST="$SNAPSHOT_DIR/BACKUP-MANIFEST.txt"
{
  echo "zzzbestmaxlit Full Backup Manifest"
  echo "Created: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "Source: $ROOT"
  echo ""
  if command -v git >/dev/null 2>&1 && [ -d "$ROOT/.git" ]; then
    echo "Git commit: $(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo 'unknown')"
    echo "Git branch: $(git -C "$ROOT" branch --show-current 2>/dev/null || echo 'unknown')"
    echo "Git remote: $(git -C "$ROOT" remote get-url origin 2>/dev/null || echo 'unknown')"
    echo "Last commit: $(git -C "$ROOT" log -1 --format='%ci %s' 2>/dev/null || echo 'unknown')"
  fi
  echo ""
  echo "Excluded from backup (store separately):"
  echo "  - .env.local, .env.vercel.prod (secrets)"
  echo "  - node_modules (run npm install)"
  echo "  - .next (run npm run dev or npm run build)"
  echo ""
  echo "Restore: see FULL-SAAS-BACKUP/README-START-HERE.md"
  echo ""
  echo "File count: $(find "$SNAPSHOT_DIR" -type f | wc -l | tr -d ' ')"
  echo "Total size: $(du -sh "$SNAPSHOT_DIR" | cut -f1)"
} > "$MANIFEST"

# Create compressed archive
echo "==> Creating archive $ARCHIVE"
tar -czf "$ARCHIVE" -C "$BACKUP_DIR/snapshots" "$SNAPSHOT_NAME"

echo ""
echo "Done."
echo "  Folder:  $SNAPSHOT_DIR"
echo "  Archive: $ARCHIVE ($(du -sh "$ARCHIVE" | cut -f1))"
echo ""
echo "Copy the .tar.gz to external storage (USB, cloud) for off-site backup."
