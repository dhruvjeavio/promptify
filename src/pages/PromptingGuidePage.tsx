import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
  useTheme,
} from "@mui/material";
import {
  ExpandMore,
  CheckCircle,
  Lightbulb,
  Psychology,
  Code,
  School,
  Rocket,
  TipsAndUpdates,
  AutoAwesome,
  PsychologyAlt,
  Build,
  Speed,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PromptingGuidePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const basicPrinciples = [
    {
      title: "Be Specific and Clear",
      description:
        "Provide clear, specific instructions rather than vague requests.",
      examples: [
        "❌ Bad: 'Write about dogs'",
        "✅ Good: 'Write a 300-word informative article about the benefits of adopting rescue dogs, including health benefits and cost savings'",
      ],
    },
    {
      title: "Provide Context",
      description:
        "Give the AI relevant background information to understand your needs.",
      examples: [
        "❌ Bad: 'Fix this code'",
        "✅ Good: 'Fix this React component that's causing a hydration error. The component renders user data from an API and should handle loading states properly'",
      ],
    },
    {
      title: "Use Examples",
      description:
        "Show the AI what you want by providing examples of the desired output.",
      examples: [
        "❌ Bad: 'Write a professional email'",
        "✅ Good: 'Write a professional email declining a job offer. Use this format: [Greeting], [Thank you], [Decline politely], [Reason], [Best wishes]'",
      ],
    },
    {
      title: "Set Constraints",
      description:
        "Define boundaries, length limits, and specific requirements.",
      examples: [
        "❌ Bad: 'Create a marketing plan'",
        "✅ Good: 'Create a 3-month digital marketing plan for a small coffee shop with a $5,000 budget, focusing on social media and local SEO'",
      ],
    },
    {
      title: "Iterate and Refine",
      description:
        "Don't expect perfect results on the first try. Refine your prompts based on outputs.",
      examples: [
        "❌ Bad: 'Write a story' (and stop there)",
        "✅ Good: 'Write a story' → 'Make it more dramatic' → 'Add dialogue' → 'Make the ending happier'",
      ],
    },
  ];

  const advancedTechniques = [
    {
      title: "Chain of Thought Prompting",
      description:
        "Encourage the AI to show its reasoning process step by step.",
      example:
        "When solving this math problem, think through each step out loud before giving the final answer.",
      useCase: "Complex problem-solving, debugging, analysis tasks",
    },
    {
      title: "Few-Shot Learning",
      description:
        "Provide several examples of input-output pairs to establish a pattern.",
      example:
        "Complete the pattern:\nInput: 'The weather is sunny'\nOutput: 'I should wear sunscreen'\n\nInput: 'The weather is rainy'\nOutput: 'I should bring an umbrella'\n\nInput: 'The weather is cold'\nOutput:",
      useCase: "Classification, formatting, style transfer",
    },
    {
      title: "Role-Based Prompting",
      description:
        "Assign a specific role or persona to the AI for better context.",
      example:
        "You are a senior software engineer with 10 years of experience in React and TypeScript. Review this code and suggest improvements.",
      useCase: "Expert advice, specialized knowledge, perspective-taking",
    },
    {
      title: "Constraint-Based Prompting",
      description:
        "Use specific constraints to guide the AI's behavior and output.",
      example:
        "Write a product description that:\n- Is exactly 150 words\n- Uses active voice\n- Includes 3 specific benefits\n- Avoids technical jargon\n- Ends with a call-to-action",
      useCase: "Content creation, formatting requirements, compliance",
    },
    {
      title: "Meta-Prompting",
      description:
        "Ask the AI to improve its own prompts or suggest better approaches.",
      example:
        "I want to write a prompt that helps me generate creative story ideas. What would be the most effective way to structure this prompt?",
      useCase:
        "Prompt optimization, creative problem-solving, self-improvement",
    },
    {
      title: "Temperature and Top-p Control",
      description: "Adjust creativity vs. consistency in AI responses.",
      example:
        "For factual content: Use lower temperature (0.1-0.3)\nFor creative writing: Use higher temperature (0.7-0.9)",
      useCase: "Balancing creativity with accuracy, content type optimization",
    },
  ];

  const commonMistakes = [
    "Being too vague or ambiguous in instructions",
    "Not providing enough context for the task",
    "Using overly complex language that confuses the AI",
    "Not specifying the desired output format",
    "Forgetting to include examples or constraints",
    "Not iterating and refining based on initial results",
    "Asking multiple questions in a single prompt",
    "Not being specific about the target audience",
  ];

  const bestPractices = [
    "Start simple and add complexity gradually",
    "Test your prompts with different variations",
    "Use clear, concise language",
    "Break complex tasks into smaller steps",
    "Provide feedback to improve results",
    "Keep a library of effective prompts",
    "Consider the AI's limitations and strengths",
    "Always review and validate AI outputs",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Prompting Hacks
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Master the art of effective AI prompting with our comprehensive guide
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
          <AlertTitle>Pro Tip</AlertTitle>
          Great prompts are the key to unlocking AI's full potential. This guide
          will help you craft prompts that get better results.
        </Alert>
      </Box>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<School />}
            label="Basic Principles"
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            icon={<Rocket />}
            label="Advanced Techniques"
            iconPosition="start"
            sx={{ py: 2 }}
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Lightbulb color="primary" />
              Basic Prompting Principles
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Master these fundamental principles to create effective prompts
              that get better results from AI.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {basicPrinciples.map((principle, index) => (
              <Box key={index} sx={{ flex: "1 1 300px", minWidth: 300 }}>
                <Card
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <CheckCircle color="success" />
                      {principle.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {principle.description}
                    </Typography>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Examples:
                      </Typography>
                      {principle.examples.map((example, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "grey.800"
                                : "grey.100",
                            p: 1,
                            borderRadius: 1,
                            mb: 1,
                            fontSize: "0.875rem",
                          }}
                        >
                          {example}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <TipsAndUpdates color="warning" />
              Common Mistakes to Avoid
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="error">
                      ❌ What Not to Do
                    </Typography>
                    <List dense>
                      {commonMistakes.map((mistake, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={mistake} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="success.main">
                      ✅ Best Practices
                    </Typography>
                    <List dense>
                      {bestPractices.map((practice, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={practice} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AutoAwesome color="primary" />
              Advanced Prompting Techniques
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Take your prompting skills to the next level with these advanced
              techniques used by AI professionals.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            {advancedTechniques.map((technique, index) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "grey.800" : "grey.50",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "grey.700" : "grey.100",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    <PsychologyAlt color="primary" />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {technique.title}
                    </Typography>
                    <Chip
                      label={technique.useCase}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph>
                    {technique.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Example:
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "grey.900"
                            : "grey.50",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {technique.example}
                      </Typography>
                    </Paper>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Build color="primary" />
              Prompt Engineering Workflow
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  <Box
                    sx={{
                      flex: "1 1 200px",
                      minWidth: 200,
                      textAlign: "center",
                    }}
                  >
                    <Speed color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      1. Define Goal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clearly articulate what you want to achieve
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: "1 1 200px",
                      minWidth: 200,
                      textAlign: "center",
                    }}
                  >
                    <Psychology color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      2. Choose Technique
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select the most appropriate prompting method
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: "1 1 200px",
                      minWidth: 200,
                      textAlign: "center",
                    }}
                  >
                    <Code color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      3. Craft Prompt
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Write clear, specific instructions with examples
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: "1 1 200px",
                      minWidth: 200,
                      textAlign: "center",
                    }}
                  >
                    <CheckCircle color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      4. Test & Iterate
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Refine based on results and feedback
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Ready to Create Better Prompts?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Apply these techniques in our prompt builder to create more effective
          prompts for your team.
        </Typography>
      </Box>
    </Container>
  );
};

export default PromptingGuidePage;
