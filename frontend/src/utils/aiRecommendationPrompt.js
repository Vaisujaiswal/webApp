export function buildAIPrompt(problems, userContext) {
    return `
You are an energy assistant.

User type: ${userContext.role}
City: ${userContext.city}

Detected usage patterns:
${problems.join(", ")}

Write 2–3 short, safe, non-technical energy-saving suggestions.
Rules:
- Do not guarantee savings
- Do not give medical or legal advice
- Use simple, friendly language
- Say "may help" or "could reduce"
- Keep suggestions optional
`;
}
