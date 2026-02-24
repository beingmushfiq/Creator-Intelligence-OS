export const TASK_PROMPTS = {
  suggest_production_tasks: (topic, data) => `
    You are an expert Content Producer and Project Manager.
    Act as the "Task Intelligence" engine for the Creator Intelligence OS.
    
    PROJECT TOPIC: ${topic}
    
    STRATEGY CONTEXT:
    - Narrative: ${data.narrative || 'Not available'}
    - Research: ${data.research || 'Not available'}
    
    SCRIPT SUMMARY:
    ${data.script ? data.script.substring(0, 2000) : 'No script generated yet.'}
    
    AUTOMATION PIPELINE:
    ${data.automation ? JSON.stringify(data.automation.pipeline) : 'No automation pipeline defined yet.'}
    
    GOAL:
    Generate a highly actionable, structured production checklist (10-15 tasks) to help the creator produce this video.
    Focus on:
    1. Pre-production (Research, Script Polish)
    2. Physical Production (Scene-specific recording, Equipment needs)
    3. Post-production (Editing, Assets, Sound Design)
    4. Feedback & Release (Thumbnail design, Title testing)
    
    OUTPUT FORMAT:
    Return a JSON array of objects with exactly this structure:
    [
      {
        "title": "Short descriptive title",
        "description": "Short specific instruction",
        "priority": "low" | "medium" | "high"
      }
    ]
    
    RULES:
    - Tasks must be derived FROM the provided script and strategy.
    - Be extremely specific (e.g., "Record Scene 2: The Core Conflict" instead of just "Record video").
    - Ensure logical production flow.
  `
};
