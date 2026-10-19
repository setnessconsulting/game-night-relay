// Authored revision-4 data. Regenerate only after explicit contract review.
export const content = {
  "scenario": {
    "visitor_request": "I am at Festival Plaza. I want to go inside the Last Lantern Post tonight. I need a step-free path. Please tell me which path and entrance to use, and explain how the guide and notice support your plan.",
    "route_guide": {
      "title": "Routes from Festival Plaza",
      "intro": "Both marked paths start at Festival Plaza and are step-free. Each path ends at one gate of the Last Lantern Post.",
      "facts": [
        {
          "id": "M1",
          "text": "North Path leads from Festival Plaza to Willow Gate."
        },
        {
          "id": "M2",
          "text": "South Path leads from Festival Plaza to Bell Gate."
        },
        {
          "id": "M3",
          "text": "There is no connecting path between the gates. To change paths, return to Festival Plaza."
        }
      ],
      "map_requirement": "Show the same two named connections and shared start, with no extra traversable lines. Include the full written guide as equivalent text. Do not mark a correct route or include admission rules here."
    },
    "festival_notice": {
      "title": "Entering the Last Lantern Post tonight",
      "facts": [
        {
          "id": "N1",
          "text": "Bell Gate is open for visitors to enter tonight."
        },
        {
          "id": "N2",
          "text": "Willow Gate is exit-only tonight. Visitors cannot enter there."
        }
      ],
      "boundary": "Do not name paths in the notice. Explain exit-only directly: leaving is allowed but entry is not."
    },
    "fairness": "Both paths satisfy the step-free need. The distinction is admission, fully disclosed in the notice. No hidden opening window, queue, distance, shortcut or assumed mobility speed changes the answer.",
    "source_necessity": "The guide alone gives routes but not admission; the notice alone gives admission but not which path reaches that gate. A justified South Path/Bell Gate choice needs M2 and N1. Exchanging only the notice's admission assignments would make North/Willow appropriate; exchanging only the map's destinations would change the appropriate path. These are design reasoning checks, not extra playable scenarios or executed tests."
  },
  "message": {
    "player_facing_copy": "Choose a path and gate. Finish your explanation with a route-guide detail, a notice detail and a conclusion linking them. You may send an unfinished message for clarification.",
    "controls": "All fields start unselected and are independently editable labeled choices. Path: North Path or South Path. Gate: Willow Gate or Bell Gate. Map evidence: M1 or M2, displayed as full sentences. Notice evidence: N1 or N2, displayed as full sentences. Conclusion: C1, C2 or C3 below. Blanks are allowed at send. No drag-and-drop or free typing is required.",
    "conclusion_choices": [
      {
        "id": "C1",
        "text": "These details show that my path reaches the gate where visitors can enter tonight."
      },
      {
        "id": "C2",
        "text": "These details show that my path reaches a gate where visitors cannot enter tonight."
      },
      {
        "id": "C3",
        "text": "I chose this path because it is the quickest."
      }
    ],
    "composition": "Readable preview: Take [path] from Festival Plaza to [gate]. My reason is that the route guide says [map detail], and tonight's notice says [notice detail]. [conclusion]. Keep source labels attached. Render blanks as explicit missing parts; never fill them automatically. Selected evidence must concern the chosen path and gate; unrelated true facts do not support the plan.",
    "actionable_plan": "South Path and Bell Gate with none of the three contradiction codes in evaluator_contract. This source-check flag acknowledges usable directions even when evidence is missing/irrelevant or the quickest claim is unsupported; it never implies task completion.",
    "complete_supported_answer": "South Path + Bell Gate + M2 + N1 + C1. The explanation connects the path destination and admission rule. No duration or closing-time detail is available or required.",
    "not_measured": "Interpretation, relevance and integration are the learning targets. No spelling, handwriting, typing-speed, elapsed-time or retry-count score."
  },
  "cases": [
    {
      "case": "complete_supported",
      "example": "South Path; Bell Gate; M2; N1; C1",
      "recipient_interpretation": "I understand: take South Path to Bell Gate. Your reason connects the path to a gate that admits visitors tonight.",
      "source_check": "M2 and N1 support the combined explanation.",
      "completion": "complete; allow source inspection or replay",
      "input_tuple": [
        "South",
        "Bell",
        "M2",
        "N1",
        "C1"
      ],
      "expected_result_ref": "evaluator_contract.golden_results.complete_supported",
      "source_check_role": "Scenario expectation only; exact display text, ordered issues and links are defined by evaluator_contract.rendering and issue_rules."
    },
    {
      "case": "actionable_but_incomplete",
      "example": "South Path; Bell Gate; M2; blank notice detail; C1",
      "recipient_interpretation": "I understand the path and gate. Which notice detail supports entering there tonight?",
      "source_check": "Usable plan; explanation incomplete. Link N1/N2 without selecting. Use equivalent prompts for missing map detail or conclusion.",
      "completion": "not complete; preserve and revise",
      "input_tuple": [
        "South",
        "Bell",
        "M2",
        null,
        "C1"
      ],
      "expected_result_ref": "evaluator_contract.golden_results.actionable_but_incomplete",
      "source_check_role": "Scenario expectation only; exact display text, ordered issues and links are defined by evaluator_contract.rendering and issue_rules."
    },
    {
      "case": "missing_plan",
      "example": "blank path; Bell Gate; blank map detail; N1; blank conclusion",
      "recipient_interpretation": "You named Bell Gate. Which path should I take from Festival Plaza?",
      "source_check": "Link M1/M2; do not infer a missing path. An empty message receives a neutral request for a path and gate.",
      "completion": "not complete",
      "input_tuple": [
        null,
        "Bell",
        null,
        "N1",
        null
      ],
      "expected_result_ref": "evaluator_contract.golden_results.missing_plan",
      "source_check_role": "Scenario expectation only; exact display text, ordered issues and links are defined by evaluator_contract.rendering and issue_rules."
    },
    {
      "case": "coherent_wrong_entrance",
      "example": "North Path; Willow Gate; M1; N2; C2",
      "recipient_interpretation": "I understand that your plan reaches Willow Gate and your explanation says I cannot enter there. I asked to go inside tonight.",
      "source_check": "M1 and N2 are accurate but the plan fails the request. Link N1/N2 and ask which map connection reaches a visitor entrance. North/Willow with missing evidence also receives wrong-entrance feedback when no higher-priority issue applies.",
      "completion": "not complete; revise without reset",
      "input_tuple": [
        "North",
        "Willow",
        "M1",
        "N2",
        "C2"
      ],
      "expected_result_ref": "evaluator_contract.golden_results.coherent_wrong_entrance",
      "source_check_role": "Scenario expectation only; exact display text, ordered issues and links are defined by evaluator_contract.rendering and issue_rules."
    },
    {
      "case": "contradictory_route_gate",
      "example": "South Path; Willow Gate; M2; N2; C2",
      "recipient_interpretation": "Your directions name South Path and Willow Gate, but your guide detail connects South Path to Bell Gate. Which plan do you mean?",
      "source_check": "Link M2/M3. Any path/gate pair conflicting with M1/M2 gets this treatment; no invented connector or automatic correction.",
      "completion": "not complete",
      "input_tuple": [
        "South",
        "Willow",
        "M2",
        "N2",
        "C2"
      ],
      "expected_result_ref": "evaluator_contract.golden_results.contradictory_route_gate",
      "source_check_role": "Scenario expectation only; exact display text, ordered issues and links are defined by evaluator_contract.rendering and issue_rules."
    },
    {
      "case": "contradictory_conclusion",
      "example": "North Path; Willow Gate; M1; N2; C1",
      "recipient_interpretation": "Your conclusion says visitors can enter, but your notice detail says they cannot enter at Willow Gate tonight.",
      "source_check": "Link N2 and the conclusion. C2 with South/Bell/M2/N1 is likewise contradictory.",
      "completion": "not complete",
      "input_tuple": [
        "North",
        "Willow",
        "M1",
        "N2",
        "C1"
      ],
      "expected_result_ref": "evaluator_contract.golden_results.contradictory_conclusion",
      "source_check_role": "Scenario expectation only; exact display text, ordered issues and links are defined by evaluator_contract.rendering and issue_rules."
    },
    {
      "case": "unsupported_rationale",
      "example": "South Path; Bell Gate; M2; N1; C3",
      "recipient_interpretation": "I understand the path and gate, and that you call this the quickest path.",
      "source_check": "The plan fits, but neither source compares travel times. Link the guide and notice and ask what they show about entering tonight. Do not invent durations.",
      "completion": "not complete until explanation is supported",
      "input_tuple": [
        "South",
        "Bell",
        "M2",
        "N1",
        "C3"
      ],
      "expected_result_ref": "evaluator_contract.golden_results.unsupported_rationale",
      "source_check_role": "Scenario expectation only; exact display text, ordered issues and links are defined by evaluator_contract.rendering and issue_rules."
    },
    {
      "case": "irrelevant_evidence",
      "example": "South Path; Bell Gate; M1; N2; blank conclusion",
      "recipient_interpretation": "Your plan names Bell Gate, but your selected details describe North Path and Willow Gate. Which details support your plan?",
      "source_check": "Link M1/M2 and N1/N2; true facts about another route are insufficient support. Apply contradiction precedence if the selected conclusion also conflicts.",
      "completion": "not complete",
      "input_tuple": [
        "South",
        "Bell",
        "M1",
        "N2",
        null
      ],
      "expected_result_ref": "evaluator_contract.golden_results.irrelevant_evidence",
      "source_check_role": "Scenario expectation only; exact display text, ordered issues and links are defined by evaluator_contract.rendering and issue_rules."
    }
  ],
  "evaluator": {
    "contract_id": "night-relay-evaluator-v1",
    "status": "design_intent; unimplemented; full combination sweep NOT_RUN",
    "purpose": "Normative total classification and authored feedback for the existing single scenario. No new source facts, choices or playable scenarios.",
    "input": {
      "field_order": [
        "path",
        "gate",
        "map_evidence",
        "notice_evidence",
        "conclusion"
      ],
      "domains": {
        "path": [
          null,
          "North",
          "South"
        ],
        "gate": [
          null,
          "Willow",
          "Bell"
        ],
        "map_evidence": [
          null,
          "M1",
          "M2"
        ],
        "notice_evidence": [
          null,
          "N1",
          "N2"
        ],
        "conclusion": [
          null,
          "C1",
          "C2",
          "C3"
        ]
      },
      "cardinality": "3 * 3 * 3 * 3 * 4 = 324 distinct tuples.",
      "blank_semantics": "null means unselected. All five keys are present. No empty-string, inferred, default or coerced values. Input outside these domains is an implementation-contract error outside the 324 player states, never a learner answer or a completion.",
      "display_names": {
        "North": "North Path",
        "South": "South Path",
        "Willow": "Willow Gate",
        "Bell": "Bell Gate"
      },
      "symbols": "P=path; G=gate; M=map_evidence; N=notice_evidence; C=conclusion. != means unequal. AND/OR/NOT use ordinary Boolean logic. Every comparison involving a fact lookup is guarded by a non-null input."
    },
    "facts": {
      "destination": {
        "North": "Willow",
        "South": "Bell"
      },
      "step_free": {
        "North": true,
        "South": true
      },
      "map_detail": {
        "M1": {
          "path": "North",
          "gate": "Willow"
        },
        "M2": {
          "path": "South",
          "gate": "Bell"
        }
      },
      "admission": {
        "Willow": false,
        "Bell": true
      },
      "notice_detail": {
        "N1": {
          "gate": "Bell",
          "admits": true
        },
        "N2": {
          "gate": "Willow",
          "admits": false
        }
      },
      "conclusion_admission": {
        "C1": true,
        "C2": false
      },
      "boundary": "Lookups are evaluator/source-check knowledge only. They never fill a missing player field or add a fact to the recipient echo. M3 remains source information, not an extra evidence option."
    },
    "predicates": {
      "path_gate_consistent": "P != null AND G != null AND destination[P] = G. If either is null, consistency is undetermined, not false evidence and not a contradiction.",
      "map_relevance": "Absent if M=null. Otherwise irrelevant if (P!=null AND map_detail[M].path!=P) OR (G!=null AND map_detail[M].gate!=G). Otherwise relevant to all specified plan fields if P!=null OR G!=null; undetermined if both are null. Partial relevance never completes missing fields.",
      "notice_relevance": "Absent if N=null. Otherwise irrelevant if (G!=null AND notice_detail[N].gate!=G) OR (P!=null AND notice_detail[N].gate!=destination[P]). Otherwise relevant to all specified plan fields if P!=null OR G!=null; undetermined if both are null. Check each selected plan field even when P/G disagree.",
      "evidence_connection": "M!=null AND N!=null AND map_detail[M].gate=notice_detail[N].gate. If both are selected with different gates, raise EVIDENCE_DISCONNECTED even if P/G are blank. If either is blank, connection is undetermined.",
      "admission_accuracy": "For C in {C1,C2}, compare conclusion_admission[C] independently with admission[G] when G!=null and admission[destination[P]] when P!=null. Any mismatch is CONCLUSION_ADMISSION_CONFLICT. Do not prefer one anchor or silently infer the missing field. With neither anchor this predicate is undetermined. With C=null or C3 it is not applicable.",
      "conclusion_consistency": "For C in {C1,C2}, separately compare conclusion_admission[C] with notice_detail[N].admits whenever N!=null. Mismatch raises CONCLUSION_NOTICE_CONFLICT even if N is irrelevant or P/G are blank: this flags the unsupported connection claimed by 'These details show', not a claim that the notice is false. Also evaluate admission_accuracy. No selected notice/plan anchor means undetermined, not contradiction. A selected M alone does not supply an omitted plan anchor; M/N disconnection and map relevance have their own issues.",
      "unsupported_claim": "C=C3 always raises UNSUPPORTED_QUICKEST, including when every other field is blank. Neither source supplies comparative travel times. C1/C2 with insufficient evidence receive missing-field issues; they are not automatically treated as unsupported or false.",
      "known_wrong_entrance": "G=Willow OR P=North. Either explicitly selected anchor is enough for the source check to identify a plan component that cannot meet the request. This does not infer or populate missing fields; route contradictions and missing-plan issues may outrank it.",
      "actionable_plan": "P=South AND G=Bell AND none of ROUTE_GATE_CONFLICT, CONCLUSION_NOTICE_CONFLICT, CONCLUSION_ADMISSION_CONFLICT is raised. Irrelevant evidence, quickest claims or missing explanation can leave directions usable while the task remains incomplete.",
      "complete_supported": "P=South AND G=Bell AND M=M2 AND N=N1 AND C=C1. This is the only complete tuple; do not derive completion from actionable_plan."
    },
    "issue_order": [
      "ROUTE_GATE_CONFLICT",
      "CONCLUSION_NOTICE_CONFLICT",
      "CONCLUSION_ADMISSION_CONFLICT",
      "UNSUPPORTED_QUICKEST",
      "MAP_EVIDENCE_IRRELEVANT",
      "NOTICE_EVIDENCE_IRRELEVANT",
      "EVIDENCE_DISCONNECTED",
      "MISSING_PATH",
      "MISSING_GATE",
      "WRONG_ENTRANCE",
      "MISSING_MAP_EVIDENCE",
      "MISSING_NOTICE_EVIDENCE",
      "MISSING_CONCLUSION"
    ],
    "evaluation": {
      "issue_set": "Evaluate every issue predicate independently, once, on the unchanged submitted tuple. Collect exactly the matching codes; no early return, suppression, inferred selections, or additional issue codes.",
      "ordering": "Sort by issue_order. primary_issue is the first code, or null if empty. secondary_issues is every remaining code in that order, without duplicates. Show all secondary issues as persistent readable source-check rows; do not hide them behind the primary class.",
      "missing_fields": "Raise each applicable MISSING_* code even when another issue outranks it. A blank blocks only comparisons requiring that value. It never suppresses an independently evaluable contradiction, unsupported claim, irrelevant detail, disconnected evidence pair or wrong entrance. Null is never treated as an opposite answer.",
      "feedback_class": "If issues are empty, complete_supported. Otherwise use the primary issue's feedback_class in issue_rules. No randomized, inferred or catch-all neutral wording. Each class has the exact heading in feedback_headings.",
      "result_fields": [
        "issues",
        "primary_issue",
        "secondary_issues",
        "feedback_class",
        "actionable_plan",
        "complete",
        "recipient_text",
        "source_status",
        "source_rows",
        "revision_focus"
      ],
      "completion": "complete equals complete_supported. Empty issues and complete must be equivalent; an empty issue list for any other tuple is an implementation defect, not a new feedback class.",
      "revision_focus": "Use the primary issue's focus_field. For a complete answer use path. Send focuses the result heading once; Revise changes focus only and preserves all selections. Existing A1-A7 remain applicable."
    },
    "feedback_headings": {
      "contradictory_route_gate": "Check the path and gate",
      "contradictory_conclusion": "Check the conclusion",
      "unsupported_rationale": "Use a reason the sources support",
      "irrelevant_evidence": "Connect the details to your plan",
      "missing_plan": "Finish the directions",
      "coherent_wrong_entrance": "Check where visitors can enter",
      "actionable_but_incomplete": "Finish the explanation",
      "complete_supported": "Message complete"
    },
    "issue_rules": [
      {
        "code": "ROUTE_GATE_CONFLICT",
        "when": "P!=null AND G!=null AND destination[P]!=G",
        "feedback_class": "contradictory_route_gate",
        "focus_field": "path",
        "source_text": "The selected path and gate do not match the route guide. Compare the connections and the rule about changing paths.",
        "links": [
          "M1",
          "M2",
          "M3"
        ]
      },
      {
        "code": "CONCLUSION_NOTICE_CONFLICT",
        "when": "C in {C1,C2} AND N!=null AND conclusion_admission[C]!=notice_detail[N].admits",
        "feedback_class": "contradictory_conclusion",
        "focus_field": "conclusion",
        "source_text": "The selected notice detail and conclusion give opposite answers about visitor entry. They do not form a supported explanation. Compare the notice detail with the conclusion.",
        "links": [
          "selected_notice",
          "conclusion"
        ]
      },
      {
        "code": "CONCLUSION_ADMISSION_CONFLICT",
        "when": "C in {C1,C2} AND ((G!=null AND conclusion_admission[C]!=admission[G]) OR (P!=null AND conclusion_admission[C]!=admission[destination[P]]))",
        "feedback_class": "contradictory_conclusion",
        "focus_field": "conclusion",
        "source_text": "The conclusion does not match the admission rule for at least one selected part of the plan. Compare the selected path's destination and any selected gate with tonight's notice.",
        "links": [
          "M1",
          "M2",
          "N1",
          "N2",
          "conclusion"
        ]
      },
      {
        "code": "UNSUPPORTED_QUICKEST",
        "when": "C=C3",
        "feedback_class": "unsupported_rationale",
        "focus_field": "conclusion",
        "source_text": "Neither source compares travel times, so the quickest-path claim is unsupported. What do the guide and notice show about entering tonight?",
        "links": [
          "route_guide",
          "festival_notice"
        ]
      },
      {
        "code": "MAP_EVIDENCE_IRRELEVANT",
        "when": "M!=null AND ((P!=null AND map_detail[M].path!=P) OR (G!=null AND map_detail[M].gate!=G))",
        "feedback_class": "irrelevant_evidence",
        "focus_field": "map_evidence",
        "source_text": "The selected route-guide detail does not match every selected part of the plan. Which guide detail supports the path and gate you mean?",
        "links": [
          "M1",
          "M2"
        ]
      },
      {
        "code": "NOTICE_EVIDENCE_IRRELEVANT",
        "when": "N!=null AND ((G!=null AND notice_detail[N].gate!=G) OR (P!=null AND notice_detail[N].gate!=destination[P]))",
        "feedback_class": "irrelevant_evidence",
        "focus_field": "notice_evidence",
        "source_text": "The selected notice detail concerns a different gate from at least one selected part of the plan. Match the path's destination and gate with a notice detail.",
        "links": [
          "M1",
          "M2",
          "N1",
          "N2"
        ]
      },
      {
        "code": "EVIDENCE_DISCONNECTED",
        "when": "M!=null AND N!=null AND map_detail[M].gate!=notice_detail[N].gate",
        "feedback_class": "irrelevant_evidence",
        "focus_field": "map_evidence",
        "source_text": "The selected guide detail and notice detail describe different gates. They do not connect a path to that gate's admission rule. Find details that connect.",
        "links": [
          "M1",
          "M2",
          "N1",
          "N2"
        ]
      },
      {
        "code": "MISSING_PATH",
        "when": "P=null",
        "feedback_class": "missing_plan",
        "focus_field": "path",
        "source_text": "The path is missing. Use the route guide to choose a path from Festival Plaza.",
        "links": [
          "M1",
          "M2"
        ]
      },
      {
        "code": "MISSING_GATE",
        "when": "G=null",
        "feedback_class": "missing_plan",
        "focus_field": "gate",
        "source_text": "The gate is missing. Use the guide and notice to choose the entrance in your directions.",
        "links": [
          "M1",
          "M2",
          "N1",
          "N2"
        ]
      },
      {
        "code": "WRONG_ENTRANCE",
        "when": "G=Willow OR P=North",
        "feedback_class": "coherent_wrong_entrance",
        "focus_field": "path",
        "source_text": "At least one selected part of the plan points to Willow Gate, which is exit-only tonight. The visitor asked to go inside. Which map connection reaches a visitor entrance?",
        "links": [
          "M1",
          "M2",
          "N1",
          "N2"
        ]
      },
      {
        "code": "MISSING_MAP_EVIDENCE",
        "when": "M=null",
        "feedback_class": "actionable_but_incomplete",
        "focus_field": "map_evidence",
        "source_text": "Which route-guide detail supports your directions? Select a detail for your explanation.",
        "links": [
          "M1",
          "M2"
        ]
      },
      {
        "code": "MISSING_NOTICE_EVIDENCE",
        "when": "N=null",
        "feedback_class": "actionable_but_incomplete",
        "focus_field": "notice_evidence",
        "source_text": "Which notice detail supports entering at your chosen gate tonight? Select a detail for your explanation.",
        "links": [
          "N1",
          "N2"
        ]
      },
      {
        "code": "MISSING_CONCLUSION",
        "when": "C=null",
        "feedback_class": "actionable_but_incomplete",
        "focus_field": "conclusion",
        "source_text": "How do your guide and notice details connect? Select a conclusion for your explanation.",
        "links": [
          "M1",
          "M2",
          "N1",
          "N2",
          "conclusion"
        ]
      }
    ],
    "rendering": {
      "panel_boundary": "Recipient interpretation displays submitted claims only. Check against the sources displays status and all issue rows using full source knowledge. No animation, travel event, invented consequence, selected-answer correction or new factual claim.",
      "recipient_order": "For one of the eight exact tuples in recipient_response_cases, use that case's recipient_interpretation verbatim. These exact-match overrides do not change evaluation or source rows. For all other tuples join the five fragments below, in field_order, with one space. Match the entire tuple, never just the feedback class.",
      "recipient_fragments": {
        "path": {
          "null": "You have not named a path.",
          "selected": "You named {path_display}."
        },
        "gate": {
          "null": "You have not named a gate.",
          "selected": "You named {gate_display}."
        },
        "map_evidence": {
          "null": "You have not included a route-guide detail.",
          "selected": "Your route-guide detail is: {map_text}"
        },
        "notice_evidence": {
          "null": "You have not included a notice detail.",
          "selected": "Your notice detail is: {notice_text}"
        },
        "conclusion": {
          "null": "You have not included a conclusion.",
          "selected": "Your conclusion is: {conclusion_text}"
        }
      },
      "substitution": "Use only input.display_names and the exact existing scenario_content facts and message_contract.conclusion_choices text for selected values. The literal null fragment is used for null. No paraphrase, deduction or model generation. Each selected source sentence already has its terminal punctuation; add none.",
      "source_status_rules": [
        {
          "when": "complete=true",
          "text": "M2 and N1 support the combined explanation.",
          "links": [
            "M2",
            "N1"
          ],
          "actions": [
            "Inspect sources",
            "Revise",
            "Replay"
          ]
        },
        {
          "when": "complete=false AND actionable_plan=true",
          "text": "The directions are usable; the explanation is not yet complete and supported.",
          "links": [],
          "actions": [
            "Revise",
            "Show explanation",
            "Replay"
          ]
        },
        {
          "when": "complete=false AND actionable_plan=false",
          "text": "The message is not complete. Check the issues below.",
          "links": [],
          "actions": [
            "Revise",
            "Show explanation",
            "Replay"
          ]
        }
      ],
      "source_rows": "After the source status, render one row per issue in sorted order: primary first, then every secondary. Each row uses exactly issue_rules.source_text and links; the primary heading is feedback_headings[feedback_class]. Source rows are not copied into the recipient panel.",
      "link_resolution": "M1-M3 and N1-N2 focus their named source sentence. route_guide/festival_notice focus the respective source heading. conclusion focuses the conclusion control group. selected_notice resolves to the submitted N1 or N2 (guarded by its issue predicate). Preserve the listed order within each row; do not merge or drop secondary rows. Return to message restores the invoking control.",
      "source_status_note": "The status text is a task/source-check judgment, never evidence of learning. A correct route with weak evidence can remain usable even while explanation issues are shown.",
      "case_source_check_note": "Existing recipient_response_cases.source_check strings are retained as scenario expectations and source-navigation requirements, not literal UI text; the status and issue rows here provide the complete authored display text for those cases too.",
      "reveal": {
        "text": "South Path reaches Bell Gate (M2), and Bell Gate is open for visitors to enter tonight (N1). C1 connects those details. Together they support South Path and Bell Gate.",
        "links": [
          "M2",
          "N1",
          "conclusion"
        ],
        "behavior": "Only show on explicit Show explanation activation. Do not edit any field. Mark the next submission assisted; retain that help history for later submissions in the same attempt sequence. Replay starts a new draft but remains identifiable as replay. No persistent learner data."
      },
      "revision": "Preserve the exact tuple, source access and feedback until player action. Revise uses evaluation.revision_focus. Replay alone explicitly clears all five fields, focuses the request, and starts a replay context. No score for attempts or time."
    },
    "golden_results_note": "Input arrays use input.field_order. Expected issue lists are authored independently of a future implementation. These 26 examples do not replace the 324-tuple table-oracle sweep."
  }
};
