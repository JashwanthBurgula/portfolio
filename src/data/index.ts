// All typed content — single source of truth
export const PERSON = {
  name: 'Jashwanth Burugula',
  firstName: 'Jashwanth',
  title: 'AI/ML & Generative AI Engineer',
  tagline: 'AI THAT SHIPS',
  email: 'jashwanthburgula@gmail.com',
  phone: '+91 7995872175',
  linkedin: 'https://linkedin.com/in/jashwanth-burgula',
  github: 'https://github.com/JashwanthBurgula',
  location: 'Hyderabad, India',
  roles: [
    'AI/ML Engineer',
    'Generative AI Engineer',
    'LLM & RAG Developer',
    'Team Lead',
  ],
  currentRole: 'AI/ML Engineer & Team Lead at ByteSentinel',
  bio: 'I build production-grade agentic AI systems, RAG pipelines, and multi-modal models. Currently leading a 10-engineer team at ByteSentinel, shipping intelligent systems that cut latency by ~85% and hit 92%+ accuracy in production.',
}

export const STATS = [
  { value: 10, label: 'Engineers Led', suffix: '' },
  { value: 85, label: 'Latency Reduction', suffix: '%' },
  { value: 92, label: 'Model Accuracy', suffix: '%+' },
  { value: 9, label: 'Roadmap Phases Shipped', suffix: '/10' },
]

export const TERMINAL_LINES = [
  '$ whoami',
  '> Jashwanth Burugula',
  '$ cat current_role.txt',
  '> ByteSentinel — AI/ML Engineer & Team Lead',
  '$ ls team/',
  '> 10 engineers, 6 microservices, ∞ ambition',
  '$ ./build_the_future.sh',
  '> Booting agentic AI... ✓',
]

export const WHAT_I_BUILD = [
  {
    num: '01',
    title: 'Agentic AI & Multi-Agent Systems',
    desc: 'Autonomous agents that reason, route, and act — from JARVIS-style desktop assistants to microservice constellations. I architect the routing layers, memory graphs, and fallback hierarchies.',
  },
  {
    num: '02',
    title: 'RAG & Private Knowledge Systems',
    desc: 'Local LLM pipelines (Ollama, Qwen2.5, DeepSeek-R1) with ChromaDB vector stores, semantic chunking, re-ranking, and JWT-secured APIs. Zero data leaves your firewall.',
  },
  {
    num: '03',
    title: 'Voice & Conversational AI',
    desc: 'Wake-word detection (Vosk, <3% idle CPU), Whisper STT, TTS synthesis, and multilingual (English/Telugu) dialogue systems. Full offline capable.',
  },
  {
    num: '04',
    title: 'Computer Vision & Applied ML for Healthcare',
    desc: 'CNN → ResNet → EfficientNet pipelines for diabetic retinopathy grading (92%+ acc), plant disease detection (90% acc), and bioinformatics gene identification.',
  },
]

export const PROJECTS = [
  {
    id: 'bujji',
    num: '01',
    title: 'BUJJI AI',
    subtitle: 'Voice-First Autonomous Desktop Assistant',
    pitch: 'A JARVIS for your machine — offline wake word, 7-agent pipeline, self-healing code.',
    problem: 'Developers waste hours on repetitive desktop tasks, switching contexts between IDE, browser, and terminal while voice assistants require constant cloud connectivity.',
    build: 'Built a 7-agent autonomous system with offline Vosk wake-word (<3% idle CPU), Whisper STT, 3-tier LLM routing (Rules → Qwen2.5 → Gemini), vision-based UI automation, and CodeForge: a self-healing code agent backed by ChromaDB memory.',
    result: 'Fully offline-capable voice assistant routing commands across 7 specialised agents with <3% idle CPU. Toggle English/Telugu captions. CodeForge autonomously debugs and re-runs code with contextual memory.',
    tech: ['Python', 'Vosk', 'Whisper', 'Qwen2.5', 'Gemini', 'ChromaDB', 'PyAutoGUI', 'Web Audio API'],
    metrics: [
      { label: 'Idle CPU', value: '<3%' },
      { label: 'Agents', value: '7' },
      { label: 'LLM Tiers', value: '3' },
      { label: 'Languages', value: '2' },
    ],
    color: '#22D3EE',
  },
  {
    id: 'bytesentinel-marketing',
    num: '02',
    title: 'BYTESENTINEL MARKETING',
    subtitle: 'AI Marketing & Lead-Gen Platform',
    pitch: '~85% latency cut via parallel microservices with circuit-breaker resilience.',
    problem: 'Sequential lead enrichment pipelines took 600s+ per batch, and a single LLM failure would crash the entire workflow with no fallback.',
    build: 'Designed a 6-microservice Docker constellation: API Gateway, LangChain/RAG service, Playwright scraper, CRM, Redis cache, and Ollama LLMs (DeepSeek-R1 + Qwen2.5). Added circuit-breaker pattern with automatic fallback model switching and JWT/RBAC security.',
    result: '~85% latency reduction (600s → 90s) via parallelisation. Circuit breakers ensure zero-downtime when any service trips. ChromaDB powers the RAG knowledge layer.',
    tech: ['Python', 'LangChain', 'DeepSeek-R1', 'Qwen2.5', 'Ollama', 'ChromaDB', 'Redis', 'Playwright', 'Docker', 'JWT'],
    metrics: [
      { label: 'Latency Cut', value: '~85%' },
      { label: 'Pipeline Time', value: '90s' },
      { label: 'Services', value: '6' },
      { label: 'Security', value: 'JWT/RBAC' },
    ],
    color: '#FF3B30',
  },
  {
    id: 'bytesentinel-erp',
    num: '03',
    title: 'BYTESENTINEL ERP/HRMS',
    subtitle: 'AI-Powered Enterprise Resource Platform',
    pitch: '7 integrated portals, AI resume screening, and Indian statutory payroll — all in one.',
    problem: 'ByteSentinel needed a unified ERP/HRMS handling HR, payroll, finance, inventory, CRM, project management, and AI — without stitching together fragile third-party SaaS tools.',
    build: 'Architected 7 integrated portals with Gemini/Groq AI resume screening, a RAG policy assistant, WeasyPrint PDF payslip generation, and an Indian statutory payroll engine. Led a 10-engineer team across 10 development phases.',
    result: '9 of 10 roadmap phases shipped. AI resume screening integrated with HR portal. Full payroll flow: HR approval → Finance approval → PDF payslip. Policy chatbot answers HR queries in natural language.',
    tech: ['Python', 'FastAPI', 'Gemini', 'Groq', 'RAG', 'WeasyPrint', 'PostgreSQL', 'React', 'Docker'],
    metrics: [
      { label: 'Portals', value: '7' },
      { label: 'Phases Shipped', value: '9/10' },
      { label: 'Team Size', value: '10 Engineers' },
      { label: 'AI Models', value: 'Gemini + Groq' },
    ],
    color: '#A855F7',
  },
  {
    id: 'retinopathy',
    num: '04',
    title: 'DIABETIC RETINOPATHY',
    subtitle: 'AI Detection System',
    pitch: '92%+ accuracy across 5 severity grades, 40% less manual screening.',
    problem: 'Manual diabetic retinopathy screening is slow, expensive, and limited by specialist availability — causing preventable blindness in underserved populations.',
    build: 'Trained a CNN → ResNet → EfficientNet progression pipeline on fundus images, with MLflow experiment tracking, Grad-CAM heatmap overlays, and a Streamlit dashboard for clinical review. Dockerised for hospital deployment.',
    result: '92%+ classification accuracy across 5 severity grades (No DR → Proliferative). 40% reduction in manual screening workload. Grad-CAM highlights lesion regions for clinical explainability.',
    tech: ['Python', 'PyTorch', 'EfficientNet', 'ResNet', 'MLflow', 'Streamlit', 'Docker', 'Grad-CAM'],
    metrics: [
      { label: 'Accuracy', value: '92%+' },
      { label: 'Screening Reduction', value: '40%' },
      { label: 'Severity Grades', value: '5' },
      { label: 'Framework', value: 'EfficientNet' },
    ],
    color: '#F59E0B',
  },
  {
    id: 'plant-disease',
    num: '05',
    title: 'AI PLANT DISEASE',
    subtitle: 'Detection Chatbot',
    pitch: '90% accuracy diagnosis with treatment plans — deployed on Azure with drift monitoring.',
    problem: 'Farmers lose significant crop yield to undiagnosed plant diseases, with no access to real-time expert diagnosis in rural areas.',
    build: 'Fine-tuned a Hugging Face / PyTorch vision model on plant disease datasets, wrapped with a conversational chatbot interface, deployed on Azure with continuous drift monitoring and retraining triggers.',
    result: '90% detection accuracy. Farmers describe symptoms in natural language and receive instant diagnosis with treatment recommendations. Azure drift monitoring auto-triggers retraining.',
    tech: ['Python', 'PyTorch', 'Hugging Face', 'Azure', 'FastAPI', 'Drift Monitoring'],
    metrics: [
      { label: 'Accuracy', value: '90%' },
      { label: 'Platform', value: 'Azure' },
      { label: 'Interface', value: 'Chat + Vision' },
      { label: 'Monitoring', value: 'Drift Auto-Retrain' },
    ],
    color: '#22C55E',
  },
  {
    id: 'job-recommendation',
    num: '06',
    title: 'AI JOB RECOMMENDATION',
    subtitle: 'Semantic Matching System',
    pitch: '91% accuracy matching resumes to jobs — BERT embeddings, A/B tested ranking.',
    problem: 'Traditional keyword-based job matching misses semantic alignment between candidate skills and job requirements, leading to poor recommendations.',
    build: 'Built a progressive NLP pipeline: TF-IDF baseline → Word2Vec → BERT embeddings with cosine similarity scoring. A/B tested ranking algorithms and embedded a point-cloud visualisation of the embedding space.',
    result: '91% matching accuracy. BERT embeddings outperform TF-IDF baseline by 23 points. A/B tested ranking delivers measurably better click-through on recommendations.',
    tech: ['Python', 'BERT', 'Word2Vec', 'TF-IDF', 'scikit-learn', 'FastAPI', 'React'],
    metrics: [
      { label: 'Accuracy', value: '91%' },
      { label: 'Model Improvement', value: '+23pts vs TF-IDF' },
      { label: 'Algorithm', value: 'BERT Embeddings' },
      { label: 'Validation', value: 'A/B Tested' },
    ],
    color: '#6366F1',
  },
  {
    id: 'cancer-genes',
    num: '07',
    title: 'CANCER GENE IDENTIFICATION',
    subtitle: 'Bioinformatics Research',
    pitch: 'Statistical gene biomarker discovery via BLAST, Biopython & NCBI genomic databases.',
    problem: 'Identifying cancer-associated gene biomarkers from raw genomic data requires integrating multiple bioinformatics tools and statistical models into a coherent pipeline.',
    build: 'Built a Biopython pipeline integrating NCBI sequence fetching, BLAST homology search, multiple sequence alignment, and statistical modelling to identify differentially expressed cancer-associated genes.',
    result: 'Automated biomarker candidate identification from NCBI genomic databases. Pipeline surfaces statistically significant gene candidates with sequence alignment visualisation.',
    tech: ['Python', 'Biopython', 'NCBI', 'BLAST', 'Statistical Modeling', 'Pandas', 'matplotlib'],
    metrics: [
      { label: 'Pipeline', value: 'BLAST + MSA' },
      { label: 'Data Source', value: 'NCBI' },
      { label: 'Language', value: 'Python/Biopython' },
      { label: 'Output', value: 'Biomarker Candidates' },
    ],
    color: '#EC4899',
  },
]

export const SKILLS = {
  'Generative AI & LLMs': ['Gemini', 'GPT-4', 'Claude', 'Qwen2.5', 'DeepSeek-R1', 'LangChain', 'LlamaIndex', 'Ollama', 'RAG', 'ChromaDB', 'Prompt Engineering'],
  'ML & Deep Learning': ['PyTorch', 'TensorFlow', 'scikit-learn', 'EfficientNet', 'ResNet', 'BERT', 'Word2Vec', 'MLflow', 'Hugging Face', 'Grad-CAM'],
  'Backend & APIs': ['Python', 'FastAPI', 'Node.js', 'REST', 'GraphQL', 'JWT', 'WebSockets', 'Circuit Breakers'],
  'Databases': ['PostgreSQL', 'MongoDB', 'Redis', 'ChromaDB', 'SQLite', 'Pinecone'],
  'Frontend & Automation': ['React', 'TypeScript', 'Three.js', 'PyAutoGUI', 'Playwright', 'Selenium'],
  'DevOps & Cloud': ['Docker', 'Azure', 'Vercel', 'GitHub Actions', 'Linux', 'Nginx'],
  'Voice & Vision': ['Whisper', 'Vosk', 'OpenCV', 'PIL', 'Web Audio API', 'TTS'],
}

export const JOURNEY = [
  { year: '2021', title: 'Class X', org: 'CGPA 9.5', desc: 'Foundation of analytical thinking and mathematics.' },
  { year: '2023', title: 'Intermediate — Narayana', org: '830/1000', desc: 'Physics, Chemistry, Mathematics. Strong quantitative foundation.' },
  { year: '2023', title: 'B.Tech AI & ML', org: 'SPSU Udaipur — CGPA 7.1', desc: 'Specialisation in Artificial Intelligence & Machine Learning. Building the theoretical and practical foundation.' },
  { year: 'May–Jul 2025', title: 'ML Engineer Intern', org: 'Stag Innovations', desc: 'First production ML models. Learned the gap between research and deployment.' },
  { year: 'May 2026', title: 'AI/ML Engineer Intern & Team Lead', org: 'ByteSentinel', desc: 'Leading 10 engineers building ByteSentinel\'s AI-first ERP/HRMS and marketing platform. Shipping agentic AI, RAG pipelines, and multi-service Docker deployments.' },
]

export const CERTIFICATIONS = [
  { title: 'Microsoft Azure Fundamentals', issuer: 'Microsoft', code: 'AZ-900', color: '#0078D4' },
  { title: 'Machine Learning with Python', issuer: 'Infosys Springboard', code: 'ML-PY', color: '#FF3B30' },
  { title: 'GenAI Data Analytics', issuer: 'Tata Forage', code: 'GENAI', color: '#22D3EE' },
  { title: 'Cybersecurity Analyst Simulation', issuer: 'Forage', code: 'CYB-AN', color: '#A855F7' },
  { title: 'Intro to Cybersecurity', issuer: 'Cisco', code: 'CSCO', color: '#1BA0D7' },
]
