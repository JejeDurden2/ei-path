import type {
  Archetype,
  ArchetypeName,
  FormatItem,
  ManualField,
  QuizQuestion,
  RehearsalCues,
  Situation,
  StepItem,
  TreeBranch,
} from "./types";

export * from "./types";

export const ARCHETYPES: Archetype[] = [
  {
    name: "Harmonizer",
    color: "#4d8cff",
    quote: "Together, we can achieve anything",
    driver: "Driven by relationships",
    strengths: "Caring, understanding, supportive",
    stressTriggers:
      "Emotional disconnection, criticism or harsh feedback, tense or conflictual environments, being overwhelmed by tasks",
    underStress:
      "\"I just want everyone to be okay.\" Passive-aggressive behaviour, neglects their own needs, emotional overreaction or withdrawal",
    howToSupport:
      "Offer warmth and encouragement, foster a conflict-free space, reassure them of their worth. \"We’ll get through it together.\"",
    whereTheyShine: "User interviews, team rituals, collaboration",
  },
  {
    name: "Rebel",
    color: "#ffcf5c",
    quote: "Thinking outside the box brings the best solutions",
    driver: "Driven by playfulness",
    strengths: "Bold, unconventional, creative",
    stressTriggers:
      "Overly structured environments, too many rules and rigidity, being ignored or having no room to express themselves, boredom and repetition",
    underStress:
      "\"No one listens to me anyway.\" Passive resistance, mood swings, sarcasm, deliberately provocative",
    howToSupport:
      "Add lightness or humour, let them be creative, suggest a different angle to re-motivate them. \"You’ve got the energy to turn this around!\"",
    whereTheyShine: "Ideation sessions, discovery, unexpected pivots",
  },
  {
    name: "Persister",
    color: "#ff4d5e",
    quote: "I never give up, no matter how tough it gets",
    driver: "Driven by values",
    strengths: "Resilient, determined, striving for excellence",
    stressTriggers:
      "Lack of respect and commitment, values not being respected, others behaving in ways they find unprincipled or lazy, lack of structure, clarity or integrity",
    underStress:
      "\"They don’t care about what’s right.\" Blames others for low standards, becomes overly critical, passive-aggressive resistance",
    howToSupport:
      "Acknowledge their commitment and convictions, be honest and principled, give structured and clear feedback. \"Your dedication doesn’t go unnoticed.\"",
    whereTheyShine: "Vision setting, advocating for customer needs, long-term strategy",
  },
  {
    name: "Promoter",
    color: "#ff5f9e",
    quote: "My words have the power to change minds",
    driver: "Driven by challenge",
    strengths: "Influential, persuasive, action-oriented",
    stressTriggers:
      "Slowness and not being in control, environments that are too structured or predictable, being micromanaged, no freedom to take initiative",
    underStress:
      "\"Just let me handle it.\" Becomes more calculating, dismisses authority or process, takes unnecessary risks",
    howToSupport:
      "Acknowledge their resourcefulness, give movement, variety and some freedom, keep communication direct and actionable. \"Let’s shake this up.\"",
    whereTheyShine: "Pitching ideas, driving urgency, presenting to leadership",
  },
  {
    name: "Imaginer",
    color: "#3ddc84",
    quote: "I can see the deeper meaning behind the surface",
    driver: "Driven by vision",
    strengths: "Analytical, insightful, ponders solutions",
    stressTriggers:
      "Overwhelm, too much external stimulation, being pressured to act quickly, no clear instructions",
    underStress:
      "\"Can someone tell me exactly what to do?\" Passive behaviour, physical and mental withdrawal, misses details or responsibilities",
    howToSupport:
      "Offer clear step by step guidance, avoid pushing for fast decisions or social interaction, give them space. \"Take the time you need.\"",
    whereTheyShine: "Building scalable solutions, conceptualising ideas, deep thinking",
  },
  {
    name: "Thinker",
    color: "#ff9f45",
    quote: "Hard work is the key to achieving greatness",
    driver: "Driven by efficiency",
    strengths: "Dedicated, focused, detail-oriented",
    stressTriggers:
      "Disorganisation, inaccurate or unclear information, inefficiency or lack of logic, lack of structure",
    underStress:
      "\"This doesn’t make sense.\" Irritability when things are confusing, impatience with inefficiency, may dismiss others’ feelings",
    howToSupport:
      "Respect their need for autonomy, stay rational and calm, avoid adding emotional pressure. \"Let’s focus on finding a solution first.\"",
    whereTheyShine: "Analytics, feature scoping, prioritisation",
  },
];

export const SITUATIONS: Situation[] = [
  {
    name: "Bad news",
    opening: {
      Harmonizer: "You look worried. Is this about the release?",
      Rebel: "Go on then, what has blown up this time?",
      Persister: "I hope this is not what I think it is.",
      Promoter: "Make it quick, I have a call in five.",
      Imaginer: "Give me a second, I was deep in something. What is it?",
      Thinker: "What exactly happened, and since when?",
    },
    advice: {
      Harmonizer: {
        move: "Tell them before the group hears it, name who is affected, and make clear the relationship is not at risk.",
        example:
          "I wanted you to hear it from me first: we slip two weeks. Nobody is being blamed, and I will take the pressure from above.",
      },
      Rebel: {
        move: "Say it straight with a bit of lightness, then hand them room to invent the way out.",
        example: "Right, the plan just blew up. Two weeks late. Want to help me decide what we throw overboard?",
      },
      Persister: {
        move: "Be honest about what went wrong, no spin, and show the principle you are protecting in the recovery.",
        example: "We slipped two weeks. Here is exactly what went wrong, and here is what I am not willing to cut to catch up.",
      },
      Promoter: {
        move: "Impact first, decision second, in two sentences. Then give them something to act on today.",
        example: "We are two weeks late. I am cutting scope B to protect the date. Can you take the customer call today?",
      },
      Imaginer: {
        move: "Send the full picture in writing first, then let them come back to you. No reaction demanded in the room.",
        example: "I have sent you the whole picture in writing. Read it at your pace, and let us talk tomorrow.",
      },
      Thinker: {
        move: "Bring the facts, the numbers and the logic. Calm and factual, no emotional loading.",
        example: "Two weeks late: three blocking defects, 40% of regression coverage missing. Here is the recovery sequence.",
      },
    },
  },
  {
    name: "Pushback in a meeting",
    opening: {
      Harmonizer: "I am not sure everyone is comfortable with this, honestly.",
      Rebel: "Sorry, but this is the same slide we saw in March with a new colour.",
      Persister: "I cannot support this. It goes against what we promised.",
      Promoter: "This will take forever. Why are we still debating it?",
      Imaginer: "I would need more time to look at this properly.",
      Thinker: "Your numbers do not add up. Where does the 30% come from?",
    },
    advice: {
      Harmonizer: {
        move: "Slow down and ask what sits behind the objection. They often speak for someone silent in the room.",
        example: "I can feel this is not sitting well. What is the concern behind it?",
      },
      Rebel: {
        move: "Do not fight the provocation, use it. Ask for the better angle, out loud.",
        example: "Fair. You clearly hate it, so give me your better version.",
      },
      Persister: {
        move: "Address the principle, not the tone. Show you take the conviction seriously.",
        example: "You are defending what we promised, and you are right to. Where exactly do you see us breaking it?",
      },
      Promoter: {
        move: "Do not defend. Acknowledge in one line, then ask what turns it into a yes and move.",
        example: "Noted. What would make this a yes for you?",
      },
      Imaginer: {
        move: "Take it offline and give them thinking time. Live argument makes them withdraw.",
        example: "Good point. Send me your view in writing and we decide Thursday.",
      },
      Thinker: {
        move: "Ask for the specific inconsistency and answer with structure. Vagueness is what triggered them.",
        example: "Which part does not hold? Give me the number and I will rerun it in front of you.",
      },
    },
  },
  {
    name: "Giving feedback",
    opening: {
      Harmonizer: "Is everything okay? You asked for a one to one.",
      Rebel: "Let me guess, this is the part where I get the sandwich.",
      Persister: "I would rather you were direct with me.",
      Promoter: "Fine, but keep it short, I have a launch to run.",
      Imaginer: "I did not have time to prepare for this conversation.",
      Thinker: "What is this about specifically?",
    },
    advice: {
      Harmonizer: {
        move: "Start from the relationship, be explicit it is about the work, close with support.",
        example: "This is about the doc, not about you, and I am glad you are on it. Two things I would change.",
      },
      Rebel: {
        move: "Human and slightly playful, no corporate wrapping. Direct on the behaviour, free on the fix.",
        example: "Straight up: the demo lost the room. Fix it your way, just not the fifty-slide way.",
      },
      Persister: {
        move: "Recognise the commitment first, then be specific about the gap. Structured, honest, no spin.",
        example: "You held the quality line all quarter. The gap is follow-up: three commitments slipped without a word.",
      },
      Promoter: {
        move: "One behaviour, one impact, one ask. Anything softer reads as noise.",
        example: "One thing: you decided without the data team. Impact: two weeks of rework. Ask: loop them in first.",
      },
      Imaginer: {
        move: "Send it in writing ahead, step by step, then discuss calmly with no time pressure.",
        example: "I have written my feedback down and sent it. Read it, then tell me when you want to talk.",
      },
      Thinker: {
        move: "Examples and evidence, rational tone, no emotional pressure on top.",
        example: "Two examples: the estimate on X and the metric on Y, both off by a factor. Let us look at the method.",
      },
    },
  },
  {
    name: "Asking for extra effort",
    opening: {
      Harmonizer: "The team is already stretched, I have to say.",
      Rebel: "Another heroic weekend? Thrilling.",
      Persister: "If we do this, we do it properly or not at all.",
      Promoter: "What is in it for me, concretely?",
      Imaginer: "My week is already full, I cannot absorb more noise.",
      Thinker: "Before I answer: what exactly is the scope?",
    },
    advice: {
      Harmonizer: {
        move: "Ask, do not assign. Make it a real choice, and say you will notice.",
        example: "I am asking, not assigning. If it is too much this week, say so and I will find another way.",
      },
      Rebel: {
        move: "Make it interesting rather than urgent, and give latitude on how.",
        example: "It is a horrible week, but you would get to break the process. Interested?",
      },
      Persister: {
        move: "Connect the effort to the value at stake. They go far for something they believe is right.",
        example: "This is the release that decides whether the customer keeps trusting us. I would like you on it.",
      },
      Promoter: {
        move: "Autonomy and a visible finish line. Do not prescribe the how.",
        example: "Own it end to end, finish line Friday noon. Your call on how you get there.",
      },
      Imaginer: {
        move: "Precise scope and steps, protected thinking time, no extra stimulation.",
        example: "Three steps, in this order, deadline Thursday. I am clearing your meetings until then.",
      },
      Thinker: {
        move: "Precise on the quality bar and the plan, and protect them from moving requirements.",
        example: "Scope is frozen, quality bar unchanged, no new requests. Two extra days, that is the whole ask.",
      },
    },
  },
  {
    name: "Recognition",
    opening: {
      Harmonizer: "Honestly, the team did it, not me.",
      Rebel: "Do I get a plaque? Please say no.",
      Persister: "I just did what needed doing.",
      Promoter: "Good. What is next?",
      Imaginer: "Oh. Thank you. That is unexpected.",
      Thinker: "It worked because the model was right.",
    },
    advice: {
      Harmonizer: {
        move: "A genuine, personal thank-you, plus credit for the team they held together.",
        example: "Thank you, genuinely. You held that team together while it was ugly, and I saw it.",
      },
      Rebel: {
        move: "Celebrate the idea nobody else dared bring, in their own tone. Ordinary praise feels fake.",
        example: "Nobody else would have suggested that, and it is the only reason it worked.",
      },
      Persister: {
        move: "Name the conviction they held and the standard they protected.",
        example: "You refused to ship it broken and you were right. Your dedication does not go unnoticed.",
      },
      Promoter: {
        move: "Visibility and the next challenge. Let them present it.",
        example: "You are presenting this at the review. And you get first pick on the next one.",
      },
      Imaginer: {
        move: "Recognise them personally and quietly, at their pace, no stage.",
        example: "Quietly: your model is what made the decision possible. Thank you.",
      },
      Thinker: {
        move: "Name the specific call they got right and why the reasoning was sound.",
        example: "Your call on the segmentation was right, and the reasoning is what convinced the room.",
      },
    },
  },
  {
    name: "Last-minute roadmap change",
    opening: {
      Harmonizer: "The team just committed to this. They will be gutted.",
      Rebel: "So the roadmap is fiction. Again.",
      Persister: "We gave our word on this scope.",
      Promoter: "Fine, but then something has to go. Now.",
      Imaginer: "I need to understand the new scope before I can react.",
      Thinker: "What are the dependencies you are breaking with this?",
    },
    advice: {
      Harmonizer: {
        move: "Acknowledge the disruption for the team before the content, and say how you protect them.",
        example: "This changes what the team committed to. I will tell them with you, and I take the heat.",
      },
      Rebel: {
        move: "Frame it as permission to break the plan open, and let them propose what to drop.",
        example: "The roadmap is officially fiction. What do we throw out first?",
      },
      Persister: {
        move: "Explain the reasoning and what you refuse to compromise. Unexplained change reads as a broken promise.",
        example: "The reason is the commitment we made in March. The quality bar does not move, the sequence does.",
      },
      Promoter: {
        move: "Decide fast, one line on the new priority, then let them run.",
        example: "New priority is X, sprint planning Monday. Go.",
      },
      Imaginer: {
        move: "New instructions in writing, step by step, no immediate answer required.",
        example: "New scope is in the doc, step by step. Nothing to answer today.",
      },
      Thinker: {
        move: "Show the trade-off explicitly: what moves out, what the new sequence is, why it is coherent.",
        example: "X moves in, Y moves out, dependencies re-sequenced here. This is why it still holds.",
      },
    },
  },
];

export const QUIZ: QuizQuestion[] = [
  {
    question: "A meeting starts going in circles. What happens inside your head first?",
    options: [
      { label: "Everyone is getting tense, I should smooth this", archetype: "Harmonizer" },
      { label: "Someone please say something unexpected", archetype: "Rebel" },
      { label: "We are drifting away from what we agreed", archetype: "Persister" },
      { label: "Decide, or I am leaving", archetype: "Promoter" },
      { label: "Too much noise, I stop following", archetype: "Imaginer" },
      { label: "This is illogical and inefficient", archetype: "Thinker" },
    ],
  },
  {
    question: "Which feedback stings the most?",
    options: [
      { label: "You were cold with the team", archetype: "Harmonizer" },
      { label: "You are too much, tone it down", archetype: "Rebel" },
      { label: "You compromised on quality", archetype: "Persister" },
      { label: "You hesitated too long", archetype: "Promoter" },
      { label: "You should have spoken up sooner", archetype: "Imaginer" },
      { label: "Your analysis was sloppy", archetype: "Thinker" },
    ],
  },
  {
    question: "You do your best work when...",
    options: [
      { label: "The team feels safe and connected", archetype: "Harmonizer" },
      { label: "I can break the format", archetype: "Rebel" },
      { label: "The purpose is worth defending", archetype: "Persister" },
      { label: "There is a challenge and a deadline", archetype: "Promoter" },
      { label: "I have quiet and time to think", archetype: "Imaginer" },
      { label: "The problem is clear and structured", archetype: "Thinker" },
    ],
  },
  {
    question: "Under pressure, you catch yourself...",
    options: [
      { label: "Over-adapting and forgetting my own needs", archetype: "Harmonizer" },
      { label: "Getting sarcastic", archetype: "Rebel" },
      { label: "Becoming critical of everyone else", archetype: "Persister" },
      { label: "Taking the wheel and cutting corners", archetype: "Promoter" },
      { label: "Going quiet and withdrawing", archetype: "Imaginer" },
      { label: "Getting irritated by the mess", archetype: "Thinker" },
    ],
  },
  {
    question: "After a hard win, what do you actually want?",
    options: [
      { label: "A sincere thank you from someone who saw it", archetype: "Harmonizer" },
      { label: "To have made it fun", archetype: "Rebel" },
      { label: "To know it was done right", archetype: "Persister" },
      { label: "The next big thing", archetype: "Promoter" },
      { label: "To be left alone for a day", archetype: "Imaginer" },
      { label: "To know my reasoning held", archetype: "Thinker" },
    ],
  },
  {
    question: "A kickoff with a team you do not know. You naturally...",
    options: [
      { label: "Check how everyone is feeling about it", archetype: "Harmonizer" },
      { label: "Break the ice with something odd", archetype: "Rebel" },
      { label: "State what we stand for", archetype: "Persister" },
      { label: "Set the ambition and the pace", archetype: "Promoter" },
      { label: "Observe and take it in", archetype: "Imaginer" },
      { label: "Clarify scope, roles and process", archetype: "Thinker" },
    ],
  },
  {
    question: "How do you want feedback delivered?",
    manualField: "fb",
    options: [
      { label: "Straight and early, in private. Examples, not adjectives." },
      { label: "In writing first, so I can think before we talk." },
      { label: "Warmly, and clearly about the work rather than about me." },
      { label: "Short and actionable: one behaviour, one impact, one ask." },
      { label: "With the reasoning, so I can see why it holds." },
      { label: "Honestly, even when it is uncomfortable. Do not soften it." },
    ],
  },
  {
    question: "What actually feels like recognition to you?",
    manualField: "reco",
    options: [
      { label: "A private, personal thank-you from someone who saw the work." },
      { label: "More scope and more trust, rather than more praise." },
      { label: "Naming the specific call I got right, and why it was right." },
      { label: "Visibility: let me present it and tell where it goes next." },
      { label: "Knowing the standard was held, even if nobody says it loudly." },
      { label: "Being told it mattered to the team, not just to the metrics." },
    ],
  },
  {
    question: "When the pressure rises, your blind spot is...",
    manualField: "blind",
    options: [
      { label: "I go quiet, and people mistake my silence for agreement." },
      { label: "I move fast and skip the why. Slow me down." },
      { label: "I over-adapt and forget to say what I need." },
      { label: "I get critical, and it shows more than I think." },
      { label: "I retreat into detail instead of deciding." },
      { label: "I use humour to dodge the conversation we should be having." },
    ],
  },
];

const BASE_OPTIONS: string[] = [
  "Harmonizer, driven by relationships",
  "Rebel, driven by playfulness",
  "Persister, driven by values",
  "Promoter, driven by challenge",
  "Imaginer, driven by vision",
  "Thinker, driven by efficiency",
];

const PHASE_OPTIONS: string[] = [
  "Harmonizer phase",
  "Rebel phase",
  "Persister phase",
  "Promoter phase",
  "Imaginer phase",
  "Thinker phase",
];

export const MANUAL_FIELDS: ManualField[] = [
  {
    key: "name",
    label: "Name",
    placeholder: "Anne-Sophie D.",
    kind: "input",
  },
  {
    key: "role",
    label: "Role / what I own",
    placeholder: "Product Manager",
    kind: "input",
  },
  {
    key: "base",
    label: "My base archetype",
    placeholder: "Choose your base",
    kind: "select",
    options: BASE_OPTIONS,
  },
  {
    key: "phase",
    label: "The phase I am in right now",
    placeholder: "Choose your current phase",
    kind: "select",
    options: PHASE_OPTIONS,
  },
  {
    key: "best",
    label: "At my best when…",
    placeholder: "I have context, a clear goal and room to run.",
    kind: "textarea",
  },
  {
    key: "triggers",
    label: "My stress triggers",
    placeholder: "Surprises in public, moving goalposts, being cut off.",
    kind: "textarea",
  },
  {
    key: "under",
    label: "Under stress I tend to…",
    placeholder: "Go quiet and over-prepare. Ask me directly, I'll tell you.",
    kind: "textarea",
  },
  {
    key: "fb",
    label: "How to give me feedback",
    placeholder: "Straight, early, in 1:1. Examples over adjectives.",
    kind: "textarea",
  },
  {
    key: "reco",
    label: "How I like recognition",
    placeholder: "A private thank-you + more scope beats a public shout-out.",
    kind: "textarea",
  },
  {
    key: "need",
    label: "What I need from you",
    placeholder: "Tell me the constraint, not the solution.",
    kind: "textarea",
  },
  {
    key: "blind",
    label: "My blind spots",
    placeholder: "I move fast and can skip the why. Slow me down.",
    kind: "textarea",
  },
];

export const TREE: TreeBranch[] = [
  {
    id: "found",
    title: "Foundations",
    subtitle: "level 0 · open",
    description:
      "Growth mindset, plus enough safety to look at yourself honestly. Without it, the rest is just a personality quiz.",
    modules: [
      "Set your intention for the path",
      "Agree the ground rules with your group",
      "Why EI matters more in the age of AI",
      "Revisit \"Communication as a superpower\" Vol. 1 & 2",
    ],
  },
  {
    id: "self",
    title: "Know yourself",
    subtitle: "path 01",
    description:
      "Handle your own emotions, then go deeper: the skills, needs and motivation that cascade from your personality.",
    modules: [
      "Personality assessment",
      "Know your stress triggers",
      "Know your drivers",
      "Know your recognition needs",
      "Write your own user manual",
    ],
    href: "/self",
  },
  {
    id: "others",
    title: "Know others",
    subtitle: "path 02",
    description: "Read the room. Spot what people need to engage, and handle the tricky moments better.",
    modules: [
      "Share manuals with others",
      "Understand why we behave differently",
      "Adapt your communication style",
      "Inclusive collaboration",
    ],
    href: "/others",
  },
  {
    id: "practice",
    title: "Practice & apply",
    subtitle: "path 03",
    description: "It only sticks if it shows up on a Tuesday. Small, concrete, low-cost reps.",
    modules: ["Rehearsals", "Role-play", "Shadowing", "Partner in crime", "Live sessions"],
  },
  {
    id: "ai",
    title: "EI × AI",
    subtitle: "path 04",
    description:
      "AI to build your EI, EI to use AI well. Expertise is identity, and it shows when AI enters the room.",
    modules: [
      "AI-assisted rehearsal & debrief",
      "Fear of exposure & over-trust",
      "From execution to judgement",
      "Trust, influence and care",
    ],
  },
  {
    id: "scale",
    title: "Pass it on",
    subtitle: "path 05 · endgame",
    description:
      "Once it works for you, it works for the people around you: your team, your squad, the next PM who joins.",
    modules: [
      "Share your manual with your team",
      "Run a team read-the-room session",
      "Become a champion for your squad",
      "Use it when a new PM joins",
    ],
  },
];

export const CUES: Record<ArchetypeName, RehearsalCues> = {
  Harmonizer: {
    good: ["together", "we ", "thank", "support", "how are you", "with you", "feel", "team", "hear you", "sorry", "okay", "ok?"],
    bad: ["unacceptable", "your fault", "asap", "failure", "deal with it", "no excuse"],
  },
  Rebel: {
    good: ["what if", "fun", "crazy", "your idea", "shake", "break", "try", "play", "honestly", "weird"],
    bad: ["process", "policy", "rules", "template", "mandatory", "compliance", "governance"],
  },
  Persister: {
    good: ["commit", "right", "value", "quality", "trust", "principle", "honest", "standard", "promise", "integrity"],
    bad: ["whatever", "shortcut", "skip", "hack", "cut corner", "good enough", "quick and dirty"],
  },
  Promoter: {
    good: ["decide", "now", "go", "fast", "own", "win", "move", "today", "deal", "your call"],
    bad: ["committee", "wait", "align", "later", "review board", "process", "escalate"],
  },
  Imaginer: {
    good: ["time", "writing", "written", "step", "space", "think", "no rush", "document", "tomorrow", "at your pace"],
    bad: ["now", "asap", "immediately", "right away", "quick", "improvise", "on the spot"],
  },
  Thinker: {
    good: ["data", "number", "because", "plan", "structure", "metric", "logic", "analysis", "%", "evidence", "scope"],
    bad: ["feel", "gut", "vibe", "trust me", "roughly", "maybe", "probably", "more or less"],
  },
};

export const REACTIONS: Record<string, Record<ArchetypeName, { up: string[]; down: string[] }>> = {
  "Bad news": {
    Harmonizer: {
      up: [
        "Thank you for telling me directly. What do we say to the team?",
        "Okay. As long as nobody gets thrown under the bus, I can handle it.",
      ],
      down: ["So the team finds out from a status report? That is not okay.", "Two weeks late, and you tell me like this?"],
    },
    Rebel: {
      up: ["Fine, the plan is dead. Give me an hour and I will bring two ways out.", "At least it is not boring. What do we cut?"],
      down: [
        "Let me guess, a recovery plan with a steering committee.",
        "Sure. Add it to the pile of things nobody warned me about.",
      ],
    },
    Persister: {
      up: [
        "Thank you for being straight. What are we protecting in the recovery?",
        "I can live with the delay if we do not ship it broken.",
      ],
      down: [
        "We committed to that date publicly. What happened to that?",
        "So we knew, and nobody said a word. That is my problem here.",
      ],
    },
    Promoter: {
      up: ["Right, decision taken. I will handle the customer call.", "Fine. Two weeks, one scope cut, moving on."],
      down: ["Are we going to talk about it, or fix it?", "Tell me the call, not the story."],
    },
    Imaginer: {
      up: [
        "Thank you. I will read it properly and come back with the impacts.",
        "That is clear enough. I will look at the detail tonight.",
      ],
      down: ["That is a lot at once. I cannot process this now.", "You are asking me to react before I have understood."],
    },
    Thinker: {
      up: ["Understood. The recovery sequence makes sense.", "Good. Then the critical path is the regression coverage."],
      down: ["Two weeks based on what? Give me the actual figures.", "That is an estimate, not a plan."],
    },
  },
  "Pushback in a meeting": {
    Harmonizer: {
      up: [
        "Since you ask: I am worried about how the team will take it.",
        "Thank you for hearing me. I did not want to block anything.",
      ],
      down: ["I do not want to argue about this in front of everyone.", "Forget it. Do as you think best."],
    },
    Rebel: {
      up: ["Alright, my version: we drop the middle step and demo instead.", "Ha. Now I am interested."],
      down: ["See, this is why nobody says anything in these meetings.", "Sure. Approved by the process gods."],
    },
    Persister: {
      up: ["Then we agree on the principle. My concern was the promise we made.", "Good. If the standard holds, I am with you."],
      down: [
        "You are dodging the point. This breaks what we said we would do.",
        "I will not endorse it, and I want that noted.",
      ],
    },
    Promoter: {
      up: ["A yes for me is: decide today, I run it tomorrow.", "Fine. Do that and I stop pushing."],
      down: ["We are ten minutes into a debate that should be a decision.", "Ping me when someone decides."],
    },
    Imaginer: {
      up: ["I will put my view in writing by tomorrow.", "Thank you. Live debate is not where I am useful."],
      down: ["I would need to think, and there is no room for that here.", "I will pass for now."],
    },
    Thinker: {
      up: ["So the 30% comes from the pilot. Then it holds.", "Good, that is the number I was missing."],
      down: ["You still have not said where the figure comes from.", "Then the conclusion is not supported."],
    },
  },
  "Giving feedback": {
    Harmonizer: {
      up: ["Thank you for saying it that way. I would rather know.", "I appreciate that you separated the work from me."],
      down: ["So I have been getting it wrong all along.", "I did not realise you saw me like that."],
    },
    Rebel: {
      up: ["Fair. I will make it shorter and stranger.", "Deal, as long as I fix it my way."],
      down: ["Noted. Anything else on the list?", "Great. A lecture."],
    },
    Persister: {
      up: ["You are right, three commitments slipped. I will fix that.", "Thank you for being honest with me."],
      down: ["I gave everything on that project and this is the return?", "That is not the standard I hold, and you know it."],
    },
    Promoter: {
      up: ["Clear. Data team first, next time.", "Fine. One behaviour, one fix. Done."],
      down: ["Is there a point coming?", "I have a launch. Send me the summary."],
    },
    Imaginer: {
      up: ["Thank you for sending it first. I had time to think.", "Yes, I recognise that. Let me work on it."],
      down: ["This is coming at me from nowhere.", "I need a moment. I did not expect this conversation."],
    },
    Thinker: {
      up: ["Both examples are fair. The method was rushed.", "Right, I see the error in the estimate."],
      down: ["Which analysis exactly? Be specific.", "Adjectives are not feedback."],
    },
  },
  "Asking for extra effort": {
    Harmonizer: {
      up: ["If it helps the team, I am in. Thank you for asking.", "I can do it. I just needed it to be a choice."],
      down: ["The team is already exhausted. But fine.", "I will do it. As usual."],
    },
    Rebel: {
      up: ["If I get to break the process, count me in.", "Alright, that sounds better than the roadmap."],
      down: ["Another heroic weekend for the same slides.", "Do I get a badge?"],
    },
    Persister: {
      up: ["If it matters that much to the customer, I will be there.", "As long as we do it properly, yes."],
      down: ["So quality gets sacrificed again for a date.", "I am not signing up for a rushed job."],
    },
    Promoter: {
      up: ["Mine end to end? Then yes.", "Friday noon. Done."],
      down: ["So I execute someone else’s plan on a weekend.", "What do I actually get out of this?"],
    },
    Imaginer: {
      up: ["Three steps and a clear deadline. That works.", "If my calendar is protected, yes."],
      down: ["I cannot absorb one more thing this week.", "You are asking me to decide on the spot again."],
    },
    Thinker: {
      up: ["Frozen scope, unchanged bar. That I can plan.", "Two days is workable with that scope."],
      down: ["Extra effort on which scope? It keeps moving.", "That is not a plan, it is a hope."],
    },
  },
  Recognition: {
    Harmonizer: {
      up: ["That means a lot. Genuinely.", "Thank you for noticing the team, not just the result."],
      down: ["Right. Anyway, it was the team.", "Okay. Was there something else?"],
    },
    Rebel: {
      up: ["Now that is a compliment I will keep.", "Good, because it was completely against the rules."],
      down: ["Please, no plaque.", "Is this the part before you ask me for something?"],
    },
    Persister: {
      up: ["Thank you. Holding that line was the hard part.", "That is exactly why I did it."],
      down: ["So we celebrate now and cut corners next quarter.", "It was the right thing to do. That is all."],
    },
    Promoter: {
      up: ["Good. What is the next one?", "I will take the review slot."],
      down: ["Nice words. And concretely?", "So, no new scope then."],
    },
    Imaginer: {
      up: ["Thank you. I did not expect that.", "That is kind. I will take it quietly."],
      down: ["Please do not put me on a stage for this.", "I would rather this stayed between us."],
    },
    Thinker: {
      up: ["The segmentation held. That is what mattered.", "Thank you. The reasoning was the work."],
      down: ["It worked because the model was right, not because of luck.", "That is vague praise."],
    },
  },
  "Last-minute roadmap change": {
    Harmonizer: {
      up: [
        "Thank you for taking the heat with them. I will help you tell them.",
        "As long as we tell them together, I am fine.",
      ],
      down: ["They committed to this. They will feel betrayed.", "And who explains it to them? Me, again?"],
    },
    Rebel: {
      up: ["Finally, permission to throw things out. I say we drop the reporting piece.", "Good. That roadmap was tired anyway."],
      down: ["So the roadmap is decoration.", "Why do we even plan?"],
    },
    Persister: {
      up: ["If it is the March commitment, then it is the right call.", "Good. The quality bar stays, so I am in."],
      down: ["We gave our word on this scope.", "Changing it without a reason is what erodes trust."],
    },
    Promoter: {
      up: ["Clear. X in, planning Monday. Running.", "Good. A decision, finally."],
      down: ["Then something must go. Which one? Decide.", "We cannot add without cutting."],
    },
    Imaginer: {
      up: ["Thank you for writing it down. I will map the impacts.", "Nothing to answer today. Good."],
      down: ["I cannot re-plan on the spot.", "There is too much moving at once."],
    },
    Thinker: {
      up: ["X in, Y out, dependencies re-sequenced. That is coherent.", "Now the sequence holds."],
      down: ["What about the dependencies you are breaking?", "This creates two conflicts you have not mentioned."],
    },
  },
};

export const FLAT: Record<ArchetypeName, string[]> = {
  Harmonizer: [
    "And how do you think the others will take it?",
    "Okay. And how are you feeling about it yourself?",
    "I hear you. What happens to the team in all this?",
  ],
  Rebel: [
    "Mmm. And what am I supposed to do with that?",
    "Is that the official version or the real one?",
    "Go on, surprise me.",
  ],
  Persister: [
    "What exactly are we committing to here?",
    "And what do we do about what we promised?",
    "I need to know where you stand on this.",
  ],
  Promoter: ["So what is the decision?", "What do you need from me, concretely?", "And today, that means what?"],
  Imaginer: [
    "Can you say that again, more slowly?",
    "I would need to think before I answer.",
    "What exactly do you expect from me?",
  ],
  Thinker: ["What is the actual scope of that?", "On what data are you basing this?", "Which one is it? That is imprecise."],
};

export const ANSWERS: Record<ArchetypeName, string[]> = {
  Harmonizer: ["Honestly? I am mostly worried about the team.", "Yes. I just do not want this to turn into blame."],
  Rebel: ["Honestly? I stopped listening around slide three.", "Yes, and I still think it is the wrong plan."],
  Persister: ["Yes. And I think we are about to break a promise.", "It depends on whether we do it properly."],
  Promoter: ["Yes. And I would have decided already.", "Short answer: no. Give me something actionable."],
  Imaginer: ["I do not know yet. I need to look at it.", "Give me a moment, I am still processing."],
  Thinker: ["That depends on the numbers you have not given me.", "Yes, if the assumptions hold. They may not."],
};

export const STEPS: StepItem[] = [
  {
    title: "Look at yourself",
    body: "Take the quiz. Name your base, your phase, your triggers, your drivers.",
  },
  {
    title: "Write your user manual",
    body: "One page. Honest, and short enough that people actually read it.",
  },
  {
    title: "Swap and read others",
    body: "Exchange manuals, then prepare the conversation you keep avoiding.",
  },
  {
    title: "Practise for real",
    body: "Rehearse, role-play, shadow, debrief what actually landed.",
  },
];

export const FORMATS: FormatItem[] = [
  {
    title: "Self-learning",
    summary: "Short modules, on your own time.",
    detail: "Including the LinkedIn Learning and Workday content we already have on EI.",
  },
  {
    title: "Live sessions",
    summary: "Theory tested on real cases from the room.",
    detail: "Bring the situation you did not handle well. That is the material.",
  },
  {
    title: "Role-play",
    summary: "Swap seats.",
    detail: "Play the stakeholder who frustrates you, and find out what they needed.",
  },
  {
    title: "Shadowing",
    summary: "Watch a peer run their meeting.",
    detail: "Note their tone, timing and format choices. Share one observation.",
  },
  {
    title: "Partner in crime",
    summary: "One person, honest feedback, between sessions.",
    detail: "You swap manuals and hold each other to the practice.",
  },
  {
    title: "AI as sparring partner",
    summary: "Rehearse with no social cost to failing.",
    detail: "Then debrief what you would change next time.",
  },
];

export const ORIGINS: FormatItem[] = [
  {
    title: "Communication as a superpower",
    summary: "Volumes 1 and 2. This path continues them.",
    detail: "[add links before the session]",
  },
  {
    title: "Product Jamming",
    summary: "April 2025 and July 2026.",
    detail: "Your questions in those sessions are why this path exists.",
  },
];

export const RULES: string[] = ["No labels", "No scoring", "No reporting", "What you write stays yours"];
