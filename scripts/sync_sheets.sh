#!/bin/bash
# Sync Google Sheets data to work-manager GitHub Pages
set -e

REPO_DIR="/tmp/work-manager-sync"
GOG="GOG_ACCOUNT=jromero@umtelkomd.com gog sheets export"

# Sheet IDs
FUSION_ID="1Ssq_EYReehe8ddOrho1B08CzTocXYr2o7Qlnf73gxcs"
RD_ID="1g3-t2_02wSLpg2LPBvRgEFY3EFjYPxZJTfpyoAa--EE"
RA_ID="1jLQf3brTId_hU2nmU16BapEvTYxYDbJJyR6IV_u7MOc"

# Clone/update repo
if [ -d "$REPO_DIR/.git" ]; then
    cd "$REPO_DIR" && git pull --rebase
else
    rm -rf "$REPO_DIR"
    git clone https://github.com/jarl9801/work-manager.git "$REPO_DIR"
    cd "$REPO_DIR"
fi

# Export CSVs
GOG_ACCOUNT=jromero@umtelkomd.com gog sheets export "$FUSION_ID" --format csv --out /tmp/wm_fusion.csv
GOG_ACCOUNT=jromero@umtelkomd.com gog sheets export "$RD_ID" --format csv --out /tmp/wm_rd.csv
GOG_ACCOUNT=jromero@umtelkomd.com gog sheets export "$RA_ID" --format csv --out /tmp/wm_ra.csv

# Convert CSVs to JSON using Python
python3 << 'PYEOF'
import csv, json, os

def csv_to_json(path):
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return [dict(row) for row in reader]

data = {
    "updated": __import__('datetime').datetime.now().isoformat(),
    "fusion": csv_to_json("/tmp/wm_fusion.csv"),
    "soplado_rd": csv_to_json("/tmp/wm_rd.csv"),
    "soplado_ra": csv_to_json("/tmp/wm_ra.csv")
}

with open("/tmp/work-manager-sync/data/sheets.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"fusion: {len(data['fusion'])} | rd: {len(data['soplado_rd'])} | ra: {len(data['soplado_ra'])}")
PYEOF

# Push if changed
cd "$REPO_DIR"
mkdir -p data
git add data/sheets.json
if git diff --cached --quiet; then
    echo "No changes"
else
    git commit -m "sync: sheets data $(date +%Y-%m-%d_%H:%M)"
    git push
    echo "Pushed"
fi
