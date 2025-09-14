// VAPI Tool definition for browser automation functionality

export const browserAutomationTool = {
  type: "function" as const,
  function: {
    name: "browser_automation",
    description: "Automate browser tasks using AI. Provide a task description and the system will perform web browsing actions to complete it.",
    parameters: {
      type: "object" as const,
      properties: {
        task: {
          type: "string" as const,
          description: "The task to perform in the browser (e.g., 'search for restaurants near me', 'book a flight to New York', 'check weather forecast')"
        },
        details: {
          type: "string" as const,
          description: "Additional details or context for the task (optional)"
        }
      },
      required: ["task"]
    }
  },
  server: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/tools/browser-automation`
  }
};

export const allBrowserTools = [
  browserAutomationTool
];
