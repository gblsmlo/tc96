export function storyParameters(specification: string, systemPrompt: string) {
  return {
    docs: {
      description: {
        story: `### Specification

${specification}

### System prompt

\`\`\`text
${systemPrompt.trim()}
\`\`\``,
      },
    },
  }
}
