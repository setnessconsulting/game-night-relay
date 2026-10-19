"""Read-only contract + governing JSON Schema validation; no source modifications."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--game-maker-root", type=Path, required=True)
args = parser.parse_args()
sys.path.insert(0, str(args.game_maker_root.resolve() / "src"))
from game_maker.contracts import validate_contract  # noqa: E402
from jsonschema import Draft202012Validator  # noqa: E402

root = Path(__file__).resolve().parents[1]
schema_path = args.game_maker_root / "schemas/v1/game-maker-contracts-v1.schema.json"
schema_bytes = schema_path.read_bytes()
schema = json.loads(schema_bytes)
Draft202012Validator.check_schema(schema)
records = []
for filename, definition in [("game-vision.json", "GameVision"), ("vertical-slice-brief.json", "VerticalSliceBrief"), ("vertical-slice-brief-r5.json", "VerticalSliceBrief")]:
    raw = (root / "docs/design" / filename).read_bytes()
    artifact = json.loads(raw)
    report = validate_contract(artifact)
    selected_schema = {**schema, "$ref": f"#/$defs/{definition}"}
    errors = list(Draft202012Validator(selected_schema).iter_errors(artifact))
    assert str(report.state) == "PASS", report
    assert not errors, [error.message for error in errors]
    assert artifact["result_state"] == "NOT_RUN"
    records.append({"file": filename, "sha256": hashlib.sha256(raw).hexdigest(),
                    "contract": str(report.state), "schema": "PASS",
                    "artifact_result_state": artifact["result_state"]})
print(json.dumps({"schema_sha256": hashlib.sha256(schema_bytes).hexdigest(),
                  "scope": "Artifact validity only; no runtime or acceptance claim", "artifacts": records}, indent=2))
