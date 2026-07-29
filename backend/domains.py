DOMAIN_RUBRICS = {
    # Software & Web Dev
    "fullstack_dev": "Focus on end-to-end architecture, API design, frontend state management, and DB optimization.",
    "frontend_dev": "Focus on rendering performance, component lifecycle, accessibility (a11y), and state management (React/Next).",
    "backend_dev": "Focus on system scalability, database locking/transactions, microservices, and server-side performance.",
    "mobile_dev": "Focus on mobile lifecycle, memory management, native bridging, and offline-first capabilities.",
    "api_dev": "Focus on REST/GraphQL/gRPC principles, rate limiting, authentication (OAuth/JWT), and API versioning.",
    
    # AI & Data Science
    "ml_engineer": "Focus on loss functions, model evaluation metrics, tensor memory, and overfitting strategies.",
    "data_engineer": "Focus on distributed computing (Spark), ETL pipelines, data warehousing (Snowflake), and stream processing.",
    "data_scientist": "Focus on statistical modeling, A/B testing, feature engineering, and predictive algorithms.",
    "genai_engineer": "Focus on RAG architecture, vector databases, LLM context windows, prompting techniques, and fine-tuning.",
    "cv_engineer": "Focus on CNNs, image segmentation, object detection (YOLO), and image augmentations.",
    "nlp_engineer": "Focus on Transformers, attention mechanisms, tokenization, embeddings, and sequence-to-sequence models.",
    
    # Cloud & Infrastructure
    "devops_engineer": "Focus on CI/CD pipelines, container orchestration (Kubernetes), infrastructure as code (Terraform), and monitoring.",
    "cloud_arch": "Focus on multi-cloud strategies, high availability, disaster recovery, and cloud-native services.",
    "sre": "Focus on SLIs/SLOs, incident response, observability, and capacity planning.",
    "db_engineer": "Focus on ACID properties, indexing, replication, sharding, and query execution plans.",
    
    # Cybersecurity & Networking
    "pen_tester": "Focus on OWASP Top 10, privilege escalation, exploit vectors, and vulnerability assessment.",
    "sec_engineer": "Focus on AppSec, cryptography standards, Identity & Access Management (IAM), and secure coding practices.",
    "cloud_sec": "Focus on zero-trust architecture, VPC security, IAM roles, and cloud posture management.",
    "net_engineer": "Focus on TCP/IP stack, BGP/OSPF routing, VPNs, firewalls, and network latency optimization.",
    
    # QA & Testing
    "qa_auto": "Focus on test frameworks (Selenium/Playwright), CI integration, flaky tests, and page object models.",
    "qa_manual": "Focus on test case design, edge cases, bug reporting clarity, and exploratory testing.",
    "perf_tester": "Focus on load generation (JMeter), latency percentiles (p95/p99), bottlenecks, and throughput.",
    
    # Emerging Tech
    "web3_dev": "Focus on smart contract security (reentrancy), gas optimization, consensus mechanisms, and EVM.",
    "embedded_eng": "Focus on RTOS scheduling, memory constraints, hardware interrupts, and low-level C/C++.",
    "game_dev": "Focus on game loops, physics engines, memory management, and rendering pipelines (Unity/Unreal).",
    "ar_vr_dev": "Focus on spatial computing, 3D math (quaternions), frame rate optimization, and interaction design."
}

def get_rubric(role_id: str) -> str:
    return DOMAIN_RUBRICS.get(role_id, "Focus on core software engineering principles, system design, and algorithmic efficiency.")
