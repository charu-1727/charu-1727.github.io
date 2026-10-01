"use client";

import { useState, useEffect, useRef, type ReactNode, type FormEvent } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type SystemNode = {
  label: string;
  eyebrow: string;
  description: string;
  proof: string;
};

const systemNodes: SystemNode[] = [
  {
    label: "Business process",
    eyebrow: "Start here",
    description: "Map the people, decisions, exceptions and controls before deciding where AI belongs.",
    proof: "SAP change-request workflow and approval governance",
  },
  {
    label: "Enterprise data",
    eyebrow: "Make it trustworthy",
    description: "Validate transaction and master data separately, because planning fields can be incomplete or stale.",
    proof: "Safety-stock data discovery and forecasting preparation",
  },
  {
    label: "Automation",
    eyebrow: "Remove friction",
    description: "Turn repeatable steps into transparent workflows with ownership, approvals and traceability.",
    proof: "Power Automate, SharePoint and Microsoft Forms",
  },
  {
    label: "AI & analytics",
    eyebrow: "Add intelligence",
    description: "Use forecasting, NLP and LLM systems where they improve a real decision—not simply to add AI.",
    proof: "Forecasting, BERT, RoBERTa, BiLSTM and applied analytics",
  },
  {
    label: "MCP & APIs",
    eyebrow: "Connect safely",
    description: "Expose approved capabilities as discoverable tools with validation, authentication and controlled access.",
    proof: "MCP servers, SAP BTP, OAuth, XSUAA and REST APIs",
  },
  {
    label: "Governance",
    eyebrow: "Earn adoption",
    description: "Design for security, human oversight, data quality and the operational reality around the model.",
    proof: "Read-only tools, scoped access and auditable workflows",
  },
];

type ProjectMetric = { label: string; value: string };
type ProjectLinks = { demoUrl?: string; repoUrl?: string; repoPrivate?: boolean };

type Project = {
  id: string;
  number: string;
  type: string;
  title: string;
  status: string;
  summary: string;
  challenge: string;
  build: string;
  validation: string;
  value: string;
  stack: string[];
  flow: string[];
  features?: string[];
  metrics?: ProjectMetric[];
  links?: ProjectLinks;
};

const projects: Project[] = [
  {
    id: "evidence-qa",
    number: "01",
    type: "RAG · Document Intelligence · Local LLM",
    title: "Evidence QA — Grounded Compliance Document Intelligence",
    status: "Private repo · evaluated on a frozen, unseen holdout",
    summary: "A local-first document question-answering system for compliance and security evidence. It processes PDF, DOCX, and XLSX files, retrieves relevant evidence, generates answers with Qwen3 8B through Ollama, verifies citation quotes, supports safe abstention when evidence is unavailable, and processes question sets in resumable batches.",
    challenge: "Compliance and security teams need accurate answers from dense PDF, DOCX and XLSX evidence, but a system that guesses or fabricates a citation is more dangerous than one that simply says it doesn't know.",
    build: "Built a local-first retrieval-and-answer pipeline: format-aware extraction preserves page, paragraph, sheet and row locations, hybrid evidence retrieval surfaces the relevant passages, and Qwen3 8B running through Ollama generates answers that quote verified source text or abstain with \"the document does not state this\" when the evidence doesn't support an answer. Question sets process in resumable CSV/XLSX batches, and the model-provider interface is swappable between local and hosted inference.",
    validation: "Evaluated on a frozen, unseen holdout set rather than training data: 21/30 correct overall, 94.1% answer precision on the answers it chose to give, 0.971 citation precision and 21/22 retrieval recall@6. It outperformed a no-model extractive baseline 21/30 to 11/30 — and it still misses or abstains on roughly a third of the holdout, which is reported here rather than hidden.",
    value: "Gives compliance and security teams a way to query dense evidence sets locally and privately, with every answer traceable to a verified quote and source location, backed by automated tests and a reproducible evaluation harness rather than an inflated accuracy claim.",
    stack: ["Python", "FastAPI", "Ollama", "Qwen3 8B", "RAG", "BM25", "PDF", "DOCX", "XLSX", "pytest"],
    flow: ["PDF/DOCX/XLSX", "Format-aware extraction", "Hybrid retrieval", "Qwen3 8B (Ollama)", "Verify citation", "Answer or abstain"],
    features: [
      "PDF, DOCX and XLSX ingestion",
      "Format-aware extraction and source locations",
      "Hybrid evidence retrieval",
      "Local Qwen3 8B inference through Ollama",
      "Verified quotations and page, paragraph, sheet and row citations",
      "Safe \"document does not state this\" abstention",
      "Resumable CSV/XLSX batch processing and export",
      "Swappable local and hosted model-provider interface",
      "Automated tests and a reproducible evaluation harness",
      "Frozen unseen holdout evaluation",
    ],
    metrics: [
      { label: "Frozen unseen holdout", value: "21/30" },
      { label: "Answer precision (answers shown)", value: "94.1%" },
      { label: "Citation precision", value: "0.971" },
      { label: "Retrieval recall@6", value: "21/22" },
      { label: "Qwen3 8B vs. extractive baseline", value: "21/30 vs 11/30" },
    ],
    links: {
      demoUrl: "https://drive.google.com/file/d/1nB63WEFL_BPFWJCVKvnufQvtRw1V-soL/view?usp=sharing",
      repoUrl: "https://github.com/charu-1727/cybersierra-evidence-qa",
      repoPrivate: true,
    },
  },
  {
    id: "safety-stock",
    number: "02",
    type: "Enterprise AI · Forecasting · MCP",
    title: "AI-Driven Safety Stock Copilot",
    status: "Validated prototype · forecasting preparation in progress",
    summary: "A decision-support layer connecting material-planning data, forecasting preparation, an existing recommendation API and a controlled MCP interface.",
    challenge: "Inventory decisions depend on data scattered across enterprise systems, while material-master planning fields may not always reflect operational reality.",
    build: "Mapped the data landscape, separated transaction-driven evidence from weaker master-data assumptions, built and locally validated a Streamable HTTP MCP service, and added a read-only tool for retrieving existing material recommendations through a Python API.",
    validation: "MCP initialization, tools/list and tools/call were validated locally. Input validation and security dependencies were added; SAP XSUAA authentication, backend connectivity and DEV deployment remain the next controlled stages.",
    value: "Creates a governed path from forecasting and material recommendations to an enterprise AI assistant without automatic SAP writeback.",
    stack: ["Python", "Node.js", "MCP", "SAP BTP", "XSUAA", "REST APIs", "Forecasting"],
    flow: ["SAP data", "Validation", "Forecast layer", "Recommendation API", "MCP tool", "AI assistant"],
  },
  {
    id: "sap-workflow",
    number: "03",
    type: "Process Automation · SAP Governance",
    title: "SAP Change Request Automation",
    status: "Implemented workflow",
    summary: "A governed request-and-approval workflow that converts an informal enterprise process into a trackable digital system.",
    challenge: "Manual change requests can create fragmented inputs, unclear ownership, approval delays and limited traceability.",
    build: "Designed the intake, validation, routing and approval flow using Microsoft Forms, SharePoint and Power Automate, with business rules and stakeholder notifications embedded into the process.",
    validation: "Tested request states, approval paths and notifications while aligning the flow with business governance requirements.",
    value: "Improves consistency, visibility and auditability while reducing avoidable coordination work around SAP changes.",
    stack: ["Power Automate", "SharePoint", "Microsoft Forms", "SAP", "Approvals", "Governance"],
    flow: ["Request", "Validate", "Route", "Approve", "Track", "Complete"],
  },
  {
    id: "mcp-bridge",
    number: "04",
    type: "Enterprise Integration · MCP · Cloud",
    title: "Logistics API to MCP Bridge",
    status: "Built and deployed in SAP BTP",
    summary: "A reusable pattern for converting a Postman-documented external API—for a global logistics client, with the name omitted for confidentiality—into a BTP-hosted MCP service for AI tool discovery and execution.",
    challenge: "The external service required OAuth credentials, while the enterprise AI client needed a separately secured MCP endpoint rather than direct API access.",
    build: "Separated authentication from business endpoints, created an API configuration with BTP Destinations, applied OAuth2 Client Credentials for the external service, used XSUAA for client-to-app authorization and exposed the MCP endpoint at /mcp.",
    validation: "Built and deployed the MTA, checked application health and logs, verified the connector path and completed a functional AI-client test.",
    value: "Keeps external credentials in the destination layer, separates the two authentication boundaries and creates a repeatable enterprise integration runbook.",
    stack: ["MCP", "SAP BTP", "OAuth2", "XSUAA", "Destinations", "Postman", "Node.js"],
    flow: ["Postman spec", "API config", "BTP Destination", "XSUAA", "/mcp", "AI client"],
  },
  {
    id: "nlp",
    number: "05",
    type: "NLP · Deep Learning · Research",
    title: "Aspect-Based Sentiment Intelligence",
    status: "Completed academic work",
    summary: "A comparative NLP system designed to move beyond overall sentiment and identify how people feel about specific aspects of a product or experience.",
    challenge: "A single positive or negative label hides the fact that one review can praise quality while criticising price, delivery or service.",
    build: "Developed and compared approaches using BERT, RoBERTa and BiLSTM, covering text preparation, aspect-level modelling and evaluation.",
    validation: "Compared model behaviour and evaluation results, and co-authored the IEEE-published paper “Exploring Progress in Aspect-based Sentiment Analysis: An In-depth Survey.”",
    value: "Turns unstructured customer language into more precise, decision-ready feedback for product and service teams.",
    stack: ["Python", "BERT", "RoBERTa", "BiLSTM", "NLP", "Deep Learning"],
    flow: ["Review", "Preprocess", "Find aspects", "Classify", "Compare models", "Insights"],
  },
  {
    id: "olist",
    number: "06",
    type: "Customer Analytics · Business Intelligence",
    title: "E-commerce Customer Analytics",
    status: "Completed project",
    summary: "An Olist customer and order analysis translating behavioural data into practical commercial questions and recommendations.",
    challenge: "Transactional data is rich but fragmented; teams need a coherent view of customer behaviour, purchasing patterns and business performance.",
    build: "Cleaned and explored multi-table e-commerce data, structured customer and order views, analysed behaviour and converted results into business-facing insights.",
    validation: "Cross-checked joins, definitions and analytical outputs before interpreting patterns.",
    value: "Demonstrates the full path from raw operational data to clear, stakeholder-ready recommendations.",
    stack: ["Python", "SQL", "EDA", "Data Visualisation", "Customer Analytics"],
    flow: ["Raw tables", "Clean", "Model", "Analyse", "Visualise", "Recommend"],
  },
];

const capabilityFilters = ["All", "Enterprise AI", "Automation", "Data & ML", "Integration", "Consulting"];

const capabilityEvidence = [
  {
    id: "mcp",
    category: "Enterprise AI",
    name: "MCP & tool calling",
    status: "Built & deployed",
    strength: "Demonstrated",
    summary: "I use MCP as a controlled integration layer—not as a label for a generic chatbot.",
    where: "Kuok Group · logistics-client API bridge and Safety Stock Copilot",
    proof: "Two distinct MCP implementations covering tool discovery, execution, API wrapping and enterprise authentication boundaries.",
    actions: ["Built a Streamable HTTP MCP service", "Validated initialize, tools/list and tools/call", "Exposed validated read-only tools and a production /mcp route"],
    tools: ["MCP SDK", "Node.js", "Streamable HTTP", "Tool schemas", "Input validation"],
    boundary: "The logistics-client bridge reached SAP BTP deployment. The Safety Stock MCP is locally validated; XSUAA, backend testing and DEV deployment are the remaining stages.",
  },
  {
    id: "power-automate",
    category: "Automation",
    name: "Power Automate workflows",
    status: "Implemented",
    strength: "Demonstrated",
    summary: "I translate a manual business process into visible states, ownership, approvals and exception paths.",
    where: "Kuok Group · SAP Change Request Automation",
    proof: "A working governed intake-and-approval flow using Microsoft Forms, SharePoint and Power Automate.",
    actions: ["Mapped request and approval stages", "Built routing, notification and tracking logic", "Aligned the flow with business-governance requirements"],
    tools: ["Power Automate", "SharePoint", "Microsoft Forms", "Approvals", "Business rules"],
    boundary: "This demonstrates workflow design and implementation; it is not presented as a company-wide SAP platform replacement.",
  },
  {
    id: "btp-security",
    category: "Integration",
    name: "SAP BTP, OAuth & XSUAA",
    status: "Deployed pattern",
    strength: "Demonstrated",
    summary: "I separate client-to-app authorization from app-to-external-service credentials instead of mixing both security boundaries.",
    where: "Kuok Group · logistics-client API to MCP bridge",
    proof: "A BTP-hosted integration using Destinations, OAuth2 Client Credentials and XSUAA-scoped access.",
    actions: ["Configured BTP Destination-based credentials", "Applied XSUAA roles and redirect configuration", "Built, deployed and checked application health and logs"],
    tools: ["SAP BTP", "XSUAA", "OAuth2", "Destinations", "MTA", "Cloud Foundry"],
    boundary: "This evidence comes from a specific read-oriented integration pattern, not from administering an entire SAP landscape.",
  },
  {
    id: "apis-python",
    category: "Integration",
    name: "Python & REST APIs",
    status: "Professional use",
    strength: "Applied",
    summary: "I connect analytical logic and enterprise interfaces through small, testable service boundaries.",
    where: "DataVerze and Kuok Group · analytics services and Safety Stock API",
    proof: "Professional Python work plus a validated API client and controlled material-recommendation retrieval flow.",
    actions: ["Worked with Python for analysis and ML", "Connected a Node MCP layer to a Python API", "Added input validation and read-only retrieval behaviour"],
    tools: ["Python", "REST", "JSON", "API clients", "Validation", "Postman"],
    boundary: "My strongest evidence is applied analytics and integration work; I do not claim senior distributed-systems depth.",
  },
  {
    id: "forecasting",
    category: "Data & ML",
    name: "Forecasting & predictive modelling",
    status: "Active project",
    strength: "Developing",
    summary: "I treat forecasting as a decision system that depends on reliable definitions and usable data—not just a model notebook.",
    where: "NUS-ISS and Kuok Group · Safety Stock initiative",
    proof: "Predictive-modelling foundation combined with current data discovery, access and preparation for material forecasting.",
    actions: ["Mapped required planning and transaction data", "Identified reliability differences across SAP data areas", "Structured the path from forecast outputs to recommendations"],
    tools: ["Forecasting", "Python", "Feature preparation", "Model evaluation", "Safety stock"],
    boundary: "The Safety Stock forecasting model is still in preparation. I explicitly do not present forecast results or business impact that have not yet been produced.",
  },
  {
    id: "data-governance",
    category: "Consulting",
    name: "Data quality & governance",
    status: "Applied",
    strength: "Demonstrated",
    summary: "I question the reliability of fields before using them to drive a recommendation or automated decision.",
    where: "Kuok Group · Safety Stock data discovery and SAP workflow governance",
    proof: "A documented distinction between transaction-driven evidence and potentially outdated material-master planning fields.",
    actions: ["Separated reliable and uncertain data sources", "Avoided treating missing or stale master data as ground truth", "Designed human oversight and read-only system boundaries"],
    tools: ["Data profiling", "Validation rules", "Governance", "Auditability", "Human oversight"],
    boundary: "This is hands-on project evidence, not a claim of owning an enterprise-wide data-governance programme.",
  },
  {
    id: "nlp",
    category: "Data & ML",
    name: "NLP & deep learning",
    status: "Completed research",
    strength: "Demonstrated",
    summary: "I have built and compared models that identify sentiment at the aspect level rather than reducing a review to one label.",
    where: "Academic research · Aspect-Based Sentiment Analysis",
    proof: "Comparative modelling with BERT, RoBERTa and BiLSTM, supported by the co-authored IEEE paper “Exploring Progress in Aspect-based Sentiment Analysis: An In-depth Survey.”",
    actions: ["Prepared and modelled text data", "Compared transformer and recurrent approaches", "Evaluated model behaviour and research findings"],
    tools: ["BERT", "RoBERTa", "BiLSTM", "Python", "NLP", "Deep learning"],
    boundary: "The evidence is academic and project-based; I do not label it as a large-scale production NLP deployment.",
  },
  {
    id: "analytics",
    category: "Data & ML",
    name: "SQL & customer analytics",
    status: "Professional + project",
    strength: "Applied",
    summary: "I move from raw operational tables to definitions, patterns and recommendations that a business stakeholder can use.",
    where: "DataVerze and Olist e-commerce analytics",
    proof: "Professional analytics experience and a multi-table customer-and-order analysis with validated joins and business interpretation.",
    actions: ["Cleaned and joined operational data", "Explored customer and order behaviour", "Converted analytical findings into stakeholder-ready insights"],
    tools: ["SQL", "Python", "EDA", "Data visualisation", "Customer analytics"],
    boundary: "Only verified project outcomes are shown; no unsupported revenue or accuracy figures are attached to this work.",
  },
  {
    id: "node-react",
    category: "Integration",
    name: "Node.js & React",
    status: "Built with",
    strength: "Applied",
    summary: "My software foundation helps me understand the full path from an interface to backend logic, APIs and deployment behaviour.",
    where: "MERN internship and enterprise MCP services",
    proof: "React and Node.js internship work, followed by Node-based MCP services and real deployment troubleshooting.",
    actions: ["Built MERN application features", "Implemented Node.js integration services", "Diagnosed runtime and deployment issues"],
    tools: ["Node.js", "React", "Express", "JavaScript", "APIs", "Debugging"],
    boundary: "I position this as a supporting full-stack foundation, not as senior frontend-specialist experience.",
  },
  {
    id: "process-discovery",
    category: "Consulting",
    name: "Process & stakeholder translation",
    status: "Professional use",
    strength: "Demonstrated",
    summary: "I translate between the person describing a business problem and the system that must implement the answer.",
    where: "Kuok Group and DataVerze · enterprise workflows and analytics delivery",
    proof: "Requirements, process mapping, governance decisions and technical documentation across business-facing projects.",
    actions: ["Clarified users, ownership and decision points", "Converted requirements into workflow and integration logic", "Explained technical work in business language"],
    tools: ["Requirements", "Process mapping", "Stakeholders", "Documentation", "Use-case framing"],
    boundary: "I am building early-career consulting depth; I do not claim senior programme ownership.",
  },
  {
    id: "rag-agents",
    category: "Enterprise AI",
    name: "RAG & agent workflows",
    status: "Building next",
    strength: "Developing",
    summary: "I am extending my MCP and NLP foundation toward production-style retrieval, evaluation, guardrails and human handoff.",
    where: "Portfolio lab · SAP AI Query Agent and fintech agent direction",
    proof: "A defined build roadmap grounded in tools, retrieval, evaluation and operational controls—not a production claim.",
    actions: ["Designing a sanitized SAP AI Query Agent", "Studying retrieval and evaluation patterns", "Planning logs, guardrails and human escalation"],
    tools: ["RAG", "Vector retrieval", "Evaluation", "Guardrails", "Human-in-the-loop"],
    boundary: "This is an active capability-building area. It is intentionally separated from completed or deployed evidence.",
  },
];

type JourneyEntry = {
  place: string;
  role: string;
  note: string;
  marker: string;
  highlights: string[];
  stack: string[];
  relatedProjectIds: string[];
};

const journey: JourneyEntry[] = [
  {
    place: "Kuok Group",
    role: "Enterprise Business Analytics Intern",
    note: "Forecasting preparation, SAP workflow automation, MCP integration and governed enterprise AI experimentation.",
    marker: "Now",
    highlights: [
      "Built and locally validated a Streamable HTTP MCP service, testing tool discovery and execution end to end.",
      "Converted a manual SAP change-request process into a governed Power Automate and SharePoint workflow with routing, approvals and an audit trail.",
      "Separated reliable transaction data from uncertain material-master fields before using them in forecasting preparation.",
      "Configured SAP BTP Destinations, OAuth2 and XSUAA so external credentials and client authorization sit on separate security boundaries.",
    ],
    stack: ["Python", "Node.js", "MCP", "SAP BTP", "Power Automate", "XSUAA", "OAuth2"],
    relatedProjectIds: ["safety-stock", "sap-workflow", "mcp-bridge"],
  },
  {
    place: "DataVerze",
    role: "AI & Data Analyst · 10 months",
    note: "Professional experience across Python, SQL, analytics, machine learning and business-facing problem solving.",
    marker: "Experience",
    highlights: [
      "Built Python and SQL data pipelines and validation routines across 50,000+ records.",
      "Developed anomaly detection and exception-analysis logic to catch data-quality issues before they reached downstream models.",
      "Compared baseline and updated model outputs using structured metrics and root-cause analysis.",
      "Worked directly with business and technical stakeholders to turn ambiguous questions into validated analytical outputs.",
    ],
    stack: ["Python", "SQL", "Data Quality", "Anomaly Detection", "Model Evaluation"],
    relatedProjectIds: [],
  },
  {
    place: "NUS-ISS",
    role: "M.Tech · Enterprise Business Analytics",
    note: "Predictive modelling, forecasting, analytics and the translation of technical work into enterprise decisions.",
    marker: "Singapore",
    highlights: [
      "Coursework spanning predictive modelling, forecasting, enterprise decision support and analytics project management.",
      "Built customer scoring and segmentation models—RFM, PCA, K-Means, churn and conversion prediction—on event-level behavioural data.",
      "Developed attribution and prescriptive recommendation logic to rank channels, segments and retention actions.",
      "Applied regression, classification, forecasting and clustering models to a 100,000+ order e-commerce dataset.",
    ],
    stack: ["Predictive Modelling", "Forecasting", "Python", "Customer Analytics"],
    relatedProjectIds: ["olist"],
  },
  {
    place: "SVKM's NMIMS University",
    role: "Bachelor's · Information Technology",
    note: "Software engineering, algorithms, data structures, AI, systems, databases, networks and information security.",
    marker: "Foundation",
    highlights: [
      "Built and compared BERT, RoBERTa and BiLSTM models for fine-grained aspect-level sentiment classification.",
      "Reached roughly 85% classification accuracy, evaluated with precision, recall, F1-score and confusion-matrix analysis.",
      "Co-authored an IEEE-published review paper on the research area.",
      "Grounded everything that came after in core CS fundamentals: algorithms, databases, systems and networks.",
    ],
    stack: ["Algorithms", "Data Structures", "Databases", "NLP"],
    relatedProjectIds: ["nlp"],
  },
  {
    place: "Software Development Internship",
    role: "MERN Stack Developer",
    note: "Built with React and Node.js and learned to diagnose real deployment issues, not only local code paths.",
    marker: "Build",
    highlights: [
      "Developed and tested MERN-stack features and REST APIs, including Git-based workflows and API debugging.",
      "Automated Python data-extraction and reporting pipelines, cutting manual operational effort by 30%.",
      "Supported release readiness through functional testing, data validation and structured defect resolution.",
    ],
    stack: ["React", "Node.js", "REST APIs", "MongoDB"],
    relatedProjectIds: [],
  },
];

type WalkthroughStage = { marker: string; place: string; role: string; note: string; aside: string };

const walkthroughStages: WalkthroughStage[] = [
  {
    marker: "Foundation",
    place: "SVKM's NMIMS University",
    role: "Bachelor's · Computer Science",
    note: "Software engineering, algorithms, data structures, AI, systems, databases, networks and information security.",
    aside: "This is where the fundamentals stuck. I didn't know yet it'd all end up pointed at enterprise AI.",
  },
  {
    marker: "Build",
    place: "Software Development Internship",
    role: "MERN Stack Developer",
    note: "Built with React and Node.js and learned to diagnose real deployment issues, not only local code paths.",
    aside: "My first real production bug. I still remember the relief of finally watching the deploy succeed.",
  },
  {
    marker: "Experience",
    place: "DataVerze",
    role: "AI & Data Analyst · 10 months",
    note: "Professional experience across Python, SQL, analytics, machine learning and business-facing problem solving.",
    aside: "Ten months of just... data. Cleaning it, questioning it, trusting it less. That instinct never left.",
  },
  {
    marker: "Singapore",
    place: "NUS-ISS",
    role: "M.Tech · Enterprise Business Analytics",
    note: "Predictive modelling, forecasting, analytics and the translation of technical work into enterprise decisions.",
    aside: "Moved to Singapore for this, and started seeing forecasting and automation as one connected problem, not separate skills.",
  },
  {
    marker: "Now",
    place: "Kuok Group",
    role: "Enterprise Business Analytics Intern",
    note: "Forecasting preparation, SAP workflow automation, MCP integration and governed enterprise AI experimentation.",
    aside: "This is where I first got hands-on with MCP, and got hooked. Everything before this was preparation for exactly this kind of work.",
  },
  {
    marker: "Next",
    place: "What I'm building next",
    role: "SAP AI Query Agent · LLM evaluation · Agent workflows",
    note: "A sanitized, public proof of enterprise tool use and retrieval, deeper work on LLM evaluation and reliability, and production-style agent workflows with guardrails and human handoff.",
    aside: "This site keeps growing exactly as fast as this work does. Nothing here gets labelled 'done' before it's real.",
  },
];

type HeroTag = { id: string; label: string; description: string; nodeIndex: number; delay: string };

const heroTags: HeroTag[] = [
  { id: "mcp", label: "MCP", description: "Model Context Protocol servers turning enterprise APIs into governed, discoverable AI tools.", nodeIndex: 4, delay: "0s" },
  { id: "sap-btp", label: "SAP BTP", description: "Cloud Foundry deployments secured with OAuth2 and XSUAA authentication boundaries.", nodeIndex: 4, delay: "-1s" },
  { id: "forecasting", label: "Forecasting", description: "Demand and safety-stock forecasting built on validated, reliability-checked enterprise data.", nodeIndex: 3, delay: "-2s" },
  { id: "automation", label: "Automation", description: "Power Automate and SharePoint workflows replacing manual, untracked approvals.", nodeIndex: 2, delay: "-3s" },
];

type ChatQuestion = { id: string; question: string; answer: ReactNode; keywords: string[] };

const chatQuestions: ChatQuestion[] = [
  {
    id: "now",
    question: "What are you working on right now?",
    keywords: ["now", "currently", "working on", "today"],
    answer: "Right now I'm at Kuok Group building governed AI systems for enterprise workflows — a safety-stock decision-support copilot with forecasting preparation in progress, an MCP bridge connecting external data to AI clients, and an automated SAP change-request process. Outside of that I'm deepening my skills in LLM evaluation and reliability, because building an agent is the easy part; trusting it is the hard part.",
  },
  {
    id: "mcp",
    question: "Tell me about the MCP project.",
    keywords: ["mcp", "model context protocol"],
    answer: "I've built two MCP integrations so far. One converts a logistics client's external API into an SAP BTP-hosted MCP service, separating authentication from business endpoints so the AI client never touches raw credentials. The other is a safety-stock copilot that exposes validated, read-only inventory recommendations as an MCP tool. Both are about making AI access enterprise data safely, not just making it 'talk to APIs.'",
  },
  {
    id: "stack",
    question: "What's your tech stack?",
    keywords: ["stack", "tools", "tech", "technolog"],
    answer: "Day to day: Python and SQL for data and analytics, Node.js for MCP services, and SAP BTP with OAuth2 and XSUAA for deployment and security. On the ML/NLP side I've worked with BERT, RoBERTa and BiLSTM. I lean toward tools that make a system explainable and auditable over ones that just look impressive in a demo.",
  },
  {
    id: "why",
    question: "Why enterprise AI, not just ML?",
    keywords: ["why", "enterprise ai", "not just ml"],
    answer: "Because most companies don't fail at building a model, they fail at trusting it enough to actually use it. I like the layer underneath the model: the messy business process, the SAP data that's technically there but not reliable, the approvals nobody wrote down. Get that right and the AI part becomes the easy, fun bit.",
  },
  {
    id: "contact",
    question: "How do I get in touch?",
    keywords: ["contact", "reach", "email", "touch", "hire"],
    answer: (
      <>
        Easiest way is email — <a href="mailto:charulata1711@gmail.com">charulata1711@gmail.com</a>. You can also find me on{" "}
        <a href="https://www.linkedin.com/in/charulata-c-54ba271b0/" target="_blank" rel="noreferrer">LinkedIn</a>, or grab my{" "}
        <a href={`${basePath}/Charulata_Chauhan_Automation_AI_Resume.pdf`} download>résumé</a> directly.
      </>
    ),
  },
  {
    id: "next",
    question: "What are you learning next?",
    keywords: ["learning", "next", "future", "exploring"],
    answer: "Three things right now: a sanitized SAP AI Query Agent I can actually show publicly, LLM evaluation and reliability, and production-style agent workflows — RAG, tool calling, memory and guardrails. The stuff that separates a cool demo from something a business can actually rely on.",
  },
];

const fallbackAnswer: ReactNode = (
  <>
    That's a good one — I'd point you to my <a href={`${basePath}/Charulata_Chauhan_Automation_AI_Resume.pdf`} download>résumé</a> or{" "}
    <a href="https://www.linkedin.com/in/charulata-c-54ba271b0/" target="_blank" rel="noreferrer">LinkedIn</a> for the details, or email me directly at{" "}
    <a href="mailto:charulata1711@gmail.com">charulata1711@gmail.com</a>.
  </>
);

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: ReactNode }[]>([
    { role: "bot", content: "Hey, I'm Charulata 👋 Ask me anything, or tap a question below to get started." },
  ]);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const ask = (q: ChatQuestion) => {
    setMessages((prev) => [...prev, { role: "user", content: q.question }, { role: "bot", content: q.answer }]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    const match = chatQuestions.find((q) => q.keywords.some((keyword) => lower.includes(keyword)));
    setMessages((prev) => [...prev, { role: "user", content: trimmed }, { role: "bot", content: match ? match.answer : fallbackAnswer }]);
    setInput("");
  };

  return (
    <div className={`chat-widget ${open ? "open" : ""}`}>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Chat with Charulata">
          <div className="chat-head">
            <div><strong>Charulata</strong><span>Guided assistant — quick answers, real voice</span></div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble ${message.role}`}>{message.content}</div>
            ))}
          </div>
          <div className="chat-chips">
            {chatQuestions.map((q) => (
              <button key={q.id} onClick={() => ask(q)}>{q.question}</button>
            ))}
          </div>
          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask me something..." aria-label="Ask a question" />
            <button type="submit" aria-label="Send">↑</button>
          </form>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close chat" : "Open chat with Charulata"}>
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}

function Walkthrough({ open, stages, onClose }: { open: boolean; stages: WalkthroughStage[]; onClose: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setStep((value) => Math.min(stages.length - 1, value + 1));
      if (event.key === "ArrowLeft") setStep((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, stages.length]);

  if (!open) return null;
  const stage = stages[step];

  return (
    <div className="walkthrough-overlay" role="dialog" aria-modal="true" aria-label="Guided walkthrough of Charulata's journey">
      <button className="walkthrough-close" onClick={onClose}>Skip to full site <span aria-hidden="true">×</span></button>
      <div className="walkthrough-progress" aria-hidden="true">
        {stages.map((_, index) => (
          <span key={index} className={index === step ? "active" : index < step ? "done" : ""} />
        ))}
      </div>
      <div className="walkthrough-stage" key={step}>
        <p className="kicker">{stage.marker} · Step {step + 1} of {stages.length}</p>
        <h2>{stage.place}</h2>
        <strong>{stage.role}</strong>
        <p className="walkthrough-note">{stage.note}</p>
        <p className="walkthrough-aside">"{stage.aside}"</p>
      </div>
      <div className="walkthrough-controls">
        <button onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>← Back</button>
        {step < stages.length - 1 ? (
          <button className="primary" onClick={() => setStep((value) => value + 1)}>Next →</button>
        ) : (
          <button className="primary" onClick={onClose}>See the full site →</button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeNode, setActiveNode] = useState(0);
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [scenario, setScenario] = useState<string | null>(null);
  const [capabilityFilter, setCapabilityFilter] = useState("All");
  const [activeCapability, setActiveCapability] = useState(capabilityEvidence[0].id);
  const [expandedJourney, setExpandedJourney] = useState<string | null>(journey[0]?.place ?? null);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const currentProject = projects.find((project) => project.id === activeProject) ?? projects[0];
  const currentCapability = capabilityEvidence.find((capability) => capability.id === activeCapability) ?? capabilityEvidence[0];
  const visibleCapabilities = capabilityEvidence.filter((capability) => capabilityFilter === "All" || capability.category === capabilityFilter);

  const selectCapabilityFilter = (filter: string) => {
    setCapabilityFilter(filter);
    const firstMatch = capabilityEvidence.find((capability) => filter === "All" || capability.category === filter);
    if (firstMatch) setActiveCapability(firstMatch.id);
  };

  const toggleJourney = (place: string) => {
    setExpandedJourney((current) => (current === place ? null : place));
  };

  const goToProject = (id: string) => {
    setActiveProject(id);
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const focusSystemNode = (index: number) => {
    setActiveNode(index);
    document.getElementById("system-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand" href="#home" aria-label="Charulata Chauhan home"><span className="brand-mark">CC</span><span>Charulata Chauhan</span></a>
        <div className="nav-links"><a href="#work">Work</a><a href="#experience">Experience</a><a href="#capabilities">Capabilities</a><a href="#contact">Contact</a></div>
        <a className="nav-cta" href={`${basePath}/Charulata_Chauhan_Automation_AI_Resume.pdf`} download>Download résumé <span aria-hidden="true">↓</span></a>
      </nav>

      <section className="hero section-shell" id="home">
        <div className="hero-copy reveal">
          <div className="availability"><span /> Based in Singapore · Open to AI transformation roles</div>
          <p className="kicker">Enterprise AI Automation · Applied AI Solutions</p>
          <h1>I turn complex enterprise workflows into <em>useful, governed AI systems.</em></h1>
          <p className="hero-intro">I work where business processes, enterprise data and intelligent systems meet—connecting SAP, automation, forecasting, APIs and AI agents into solutions people can understand and trust.</p>
          <div className="hero-actions">
            <a className="button primary" href="#system-map">Explore my systems <span>↓</span></a>
            <a className="button secondary" href="mailto:charulata1711@gmail.com?subject=Portfolio%20conversation">Start a conversation <span>↗</span></a>
            <button type="button" className="button ghost" onClick={() => setWalkthroughOpen(true)}>Walk me through it <span aria-hidden="true">▶</span></button>
          </div>
          <div className="hero-proof" aria-label="Professional highlights">
            <div><strong>10 mo.</strong><span>Full-time AI & data experience</span></div>
            <div><strong>2×</strong><span>Enterprise MCP implementations</span></div>
            <div><strong>IEEE</strong><span>Published research contribution</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Interactive enterprise AI system illustration">
          <div className="portrait-card">
            <div className="portrait-orbit orbit-one" /><div className="portrait-orbit orbit-two" />
            <div className="portrait-placeholder"><span className="portrait-initials">CC</span><small>Enterprise AI · Singapore</small></div>
          </div>
          <div className="hero-orbit-tags">
            {heroTags.map((tag) => (
              <button key={tag.id} type="button" className={`hero-tag tag-${tag.id}`} onClick={() => focusSystemNode(tag.nodeIndex)} aria-label={`${tag.label}: ${tag.description}`}>
                <span className="hero-tag-pill" style={{ animationDelay: tag.delay }}>{tag.label}</span>
                <span className="hero-tag-tip" role="tooltip">{tag.description}</span>
              </button>
            ))}
          </div>
          <div className="terminal-card">
            <div className="terminal-head"><span /><span /><span /><b>system.profile</b></div>
            <p><i>01</i> Understand the workflow</p><p><i>02</i> Validate the data</p><p><i>03</i> Add the intelligence</p><p><i>04</i> Govern the outcome</p>
            <div className="terminal-status"><span /> ready to solve real problems</div>
          </div>
        </div>
      </section>

      <section className="system-section section-shell" id="system-map">
        <div className="section-heading"><p className="kicker">The operating model</p><h2>AI is one layer of the system—not the whole system.</h2><p>Select a layer to see how it connects to evidence from my work.</p></div>
        <div className="system-grid">
          <div className="node-map" role="list" aria-label="System layers">
            <div className="map-core"><span>Business<br />impact</span></div>
            {systemNodes.map((node, index) => (
              <button key={node.label} className={`system-node node-${index + 1} ${activeNode === index ? "active" : ""}`} onClick={() => setActiveNode(index)} aria-pressed={activeNode === index}>
                <span className="node-dot" />{node.label}
              </button>
            ))}
            <svg className="map-lines" viewBox="0 0 600 460" aria-hidden="true"><path d="M300 230 L120 90 M300 230 L470 78 M300 230 L525 250 M300 230 L440 400 M300 230 L165 395 M300 230 L70 250" /><circle cx="300" cy="230" r="142" /></svg>
          </div>
          <div className="node-detail" key={activeNode}><span className="detail-index">0{activeNode + 1}</span><p className="kicker">{systemNodes[activeNode].eyebrow}</p><h3>{systemNodes[activeNode].label}</h3><p>{systemNodes[activeNode].description}</p><div className="evidence-label">Evidence in my work</div><strong>{systemNodes[activeNode].proof}</strong></div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-shell">
          <div className="section-heading light"><p className="kicker">Mission archive</p><h2>Selected systems, unpacked.</h2><p>Explore the challenge, architecture, validation and business value—not just the tech stack.</p></div>
          <div className="project-layout">
            <div className="project-tabs" role="tablist" aria-label="Portfolio projects">
              {projects.map((project) => (
                <button key={project.id} className={activeProject === project.id ? "active" : ""} onClick={() => setActiveProject(project.id)} role="tab" aria-selected={activeProject === project.id} aria-controls="project-panel">
                  <span>{project.number}</span><div><strong>{project.title}</strong><small>{project.type}</small></div><i aria-hidden="true">→</i>
                </button>
              ))}
            </div>
            <article className="project-panel" id="project-panel" role="tabpanel" key={currentProject.id}>
              <div className="project-meta"><span>{currentProject.type}</span><b>{currentProject.status}</b></div>
              <h3>{currentProject.title}</h3><p className="project-summary">{currentProject.summary}</p>
              <div className="flow-diagram" aria-label={`${currentProject.title} process flow`}>
                {currentProject.flow.map((step, index) => <div className="flow-step" key={step}><span>{step}</span>{index < currentProject.flow.length - 1 && <i>→</i>}</div>)}
              </div>
              <div className="case-grid"><div><span>Challenge</span><p>{currentProject.challenge}</p></div><div><span>What I built</span><p>{currentProject.build}</p></div><div><span>Validation</span><p>{currentProject.validation}</p></div><div><span>Business value</span><p>{currentProject.value}</p></div></div>
              <div className="stack-row">{currentProject.stack.map((item) => <span key={item}>{item}</span>)}</div>
              {currentProject.features && currentProject.features.length > 0 && (
                <div className="evidence-actions">
                  <span>Key features</span>
                  <ul>{currentProject.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                </div>
              )}
              {currentProject.metrics && currentProject.metrics.length > 0 && (
                <div className="evidence-summary" aria-label={`${currentProject.title} measured results`}>
                  {currentProject.metrics.map((metric) => (
                    <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
                  ))}
                </div>
              )}
              {currentProject.links && (currentProject.links.demoUrl || currentProject.links.repoUrl) && (
                <div className="hero-actions">
                  {currentProject.links.demoUrl && (
                    <a
                      className="button primary"
                      href={currentProject.links.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Watch the ${currentProject.title} demo recording`}
                    >
                      Watch demo <span aria-hidden="true">▶</span>
                    </a>
                  )}
                  {currentProject.links.repoUrl && (
                    <a
                      className="button secondary"
                      href={currentProject.links.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={
                        currentProject.links.repoPrivate
                          ? `${currentProject.title} private repository on GitHub, access available on request`
                          : `${currentProject.title} repository on GitHub`
                      }
                    >
                      {currentProject.links.repoPrivate ? "Private repository — access available on request" : "View repository"}{" "}
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              )}
              {currentProject.id === "nlp" && (
                <a
                  className="button secondary"
                  href="https://ieeexplore.ieee.org/document/10543612"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Read Exploring Progress in Aspect-based Sentiment Analysis: An In-depth Survey on IEEE Xplore"
                >
                  Read the IEEE paper <span aria-hidden="true">↗</span>
                </a>
              )}
              <p className="privacy-note">Public case study · company data, endpoints, credentials and internal configurations are intentionally excluded.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="experience-section section-shell" id="experience">
        <div className="section-heading split-heading"><div><p className="kicker">System evolution</p><h2>A path from software to enterprise AI.</h2></div><p>Click a stage to see what was actually built, the tools involved and the related work it connects to.</p></div>
        <div className="journey">
          {journey.map((item, index) => {
            const expanded = expandedJourney === item.place;
            return (
              <article className={`journey-item ${expanded ? "expanded" : ""}`} key={item.place}>
                <button type="button" className="journey-toggle" onClick={() => toggleJourney(item.place)} aria-expanded={expanded} aria-controls={`journey-panel-${index}`}>
                  <div className="journey-line"><span>{String(index + 1).padStart(2, "0")}</span></div>
                  <div className="journey-main"><p>{item.marker}</p><h3>{item.place}</h3><strong>{item.role}</strong></div>
                  <p className="journey-note">{item.note}</p>
                  <i className="journey-chevron" aria-hidden="true">+</i>
                </button>
                <div className="journey-panel-wrap" id={`journey-panel-${index}`} aria-hidden={!expanded}>
                  <div className="journey-panel">
                    <ul className="journey-highlights">
                      {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                    </ul>
                    <div className="journey-stack">
                      {item.stack.map((tool) => <span key={tool}>{tool}</span>)}
                    </div>
                    {item.relatedProjectIds.length > 0 && (
                      <div className="journey-related">
                        <span>Related work</span>
                        <div className="journey-related-links">
                          {item.relatedProjectIds.map((id) => {
                            const related = projects.find((project) => project.id === id);
                            if (!related) return null;
                            return (
                              <button type="button" key={id} onClick={() => goToProject(id)}>
                                {related.title} <i aria-hidden="true">→</i>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="thinking-section">
        <div className="section-shell thinking-grid">
          <div className="section-heading light"><p className="kicker">How I think</p><h2>A team wants to “add AI” to a manual enterprise process. What happens first?</h2></div>
          <div className="scenario-card">
            {["Build the model", "Understand the workflow", "Connect every data source"].map((option) => (
              <button key={option} onClick={() => setScenario(option)} className={scenario === option ? (option === "Understand the workflow" ? "correct" : "incorrect") : ""}><span>{option}</span><i>{scenario === option ? (option === "Understand the workflow" ? "✓" : "↺") : "→"}</i></button>
            ))}
            {scenario && <div className={`scenario-answer ${scenario === "Understand the workflow" ? "success" : "retry"}`}><strong>{scenario === "Understand the workflow" ? "Exactly." : "Go one layer earlier."}</strong><p>Start with users, decisions, exceptions, ownership, data quality, risk and success criteria. Then choose where automation or AI genuinely helps.</p></div>}
          </div>
        </div>
      </section>

      <section className="capabilities-section" id="capabilities">
        <div className="section-shell">
          <div className="section-heading split-heading light">
            <div><p className="kicker">Evidence, not buzzwords</p><h2>Capabilities you can trace to real work.</h2></div>
            <p>Select a capability to see where I used it, what I personally did, what supports the claim—and where I draw the boundary.</p>
          </div>

          <div className="evidence-summary" aria-label="Capability evidence summary">
            <div><strong>11</strong><span>Capabilities documented</span></div>
            <div><strong>4</strong><span>Evidence levels distinguished</span></div>
            <div><strong>0</strong><span>Inflated percentage bars</span></div>
          </div>

          <div className="capability-filters" role="tablist" aria-label="Filter capabilities">
            {capabilityFilters.map((filter) => (
              <button key={filter} className={capabilityFilter === filter ? "active" : ""} onClick={() => selectCapabilityFilter(filter)} aria-pressed={capabilityFilter === filter}>{filter}</button>
            ))}
          </div>

          <div className="evidence-workbench">
            <div className="capability-directory" role="tablist" aria-label="Capabilities with evidence">
              {visibleCapabilities.map((capability, index) => (
                <button key={capability.id} className={activeCapability === capability.id ? "active" : ""} onClick={() => setActiveCapability(capability.id)} role="tab" aria-selected={activeCapability === capability.id} aria-controls="capability-evidence-panel">
                  <span className="directory-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="directory-copy"><strong>{capability.name}</strong><small>{capability.where}</small></span>
                  <span className={`evidence-strength ${capability.strength.toLowerCase()}`}>{capability.strength}</span>
                  <i aria-hidden="true">→</i>
                </button>
              ))}
            </div>

            <article className="evidence-dossier" id="capability-evidence-panel" role="tabpanel" key={currentCapability.id}>
              <div className="dossier-topline"><span>{currentCapability.category}</span><b>{currentCapability.status}</b></div>
              <h3>{currentCapability.name}</h3>
              <p className="dossier-summary">{currentCapability.summary}</p>

              <div className="evidence-proof">
                <span>What supports the claim</span>
                <p>{currentCapability.proof}</p>
              </div>

              <div className="evidence-context">
                <div><span>Where I used it</span><strong>{currentCapability.where}</strong></div>
                <div><span>Evidence level</span><strong>{currentCapability.strength}</strong></div>
              </div>

              <div className="evidence-actions">
                <span>What I personally did</span>
                <ul>{currentCapability.actions.map((action) => <li key={action}>{action}</li>)}</ul>
              </div>

              <div className="evidence-tools">{currentCapability.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>

              <div className="honest-boundary"><span aria-hidden="true">◎</span><div><strong>Honest boundary</strong><p>{currentCapability.boundary}</p></div></div>
            </article>
          </div>
        </div>
      </section>

      <section className="lab-section section-shell">
        <div className="section-heading"><p className="kicker">AI lab · next layer</p><h2>What I’m actively strengthening.</h2><p>These are deliberately labelled as learning and build directions—not completed production claims.</p></div>
        <div className="lab-grid"><article><span>Building</span><h3>SAP AI Query Agent</h3><p>A public, sanitized proof of enterprise tool use, retrieval, access boundaries and clear business value.</p></article><article><span>Learning</span><h3>LLM evaluation & reliability</h3><p>Test datasets, groundedness, failure analysis, cost, latency, observability and human review loops.</p></article><article><span>Exploring</span><h3>Production agent workflows</h3><p>RAG, tool calling, memory, guardrails, human handoff and backend services for real operational use cases.</p></article></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-grid"><div><p className="kicker">Open channel</p><h2>Let’s build AI that works beyond the demo.</h2></div><div className="contact-copy"><p>I’m open to opportunities in Enterprise AI Automation, Applied AI Solutions, Agentic AI and technology transformation.</p><a className="contact-email" href="mailto:charulata1711@gmail.com">charulata1711@gmail.com <span>↗</span></a><div className="contact-links"><a href="https://www.linkedin.com/in/charulata-c-54ba271b0/" target="_blank" rel="noreferrer">LinkedIn <small>professional profile ↗</small></a><a href="https://github.com/charu-1727" target="_blank" rel="noreferrer">GitHub <small>projects &amp; portfolio ↗</small></a><a href="https://ieeexplore.ieee.org/document/10543612" target="_blank" rel="noreferrer">IEEE paper <small>published research ↗</small></a><a href={`${basePath}/Charulata_Chauhan_Automation_AI_Resume.pdf`} download>Résumé <small>download PDF ↓</small></a></div></div></div>
      </section>

      <footer className="footer section-shell"><div className="brand"><span className="brand-mark">CC</span><span>Charulata Chauhan</span></div><p>Enterprise AI Automation · Applied AI Solutions · Singapore</p><a href="#home">Back to top ↑</a></footer>

      <Walkthrough open={walkthroughOpen} stages={walkthroughStages} onClose={() => setWalkthroughOpen(false)} />
      <ChatWidget />
    </main>
  );
}
