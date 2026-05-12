reflection.md (Week 8 Engineering Reflection)
1. Full CI/CD pipeline automation complexity

The full sequence of build, tag, push, pull, deploy, verify, and self-heal can technically be automated into a single CI/CD job, extending the Week 5 Jenkins pipeline. The most difficult step to make reliably deterministic is the deployment verification and self-healing phase, specifically confirming that the deployed workload is actually healthy and not just “running.”

The core challenge is that Kubernetes introduces eventual consistency. Even if the deployment step succeeds, the pods may still be in transitional states such as ContainerCreating or CrashLoopBackOff. This creates a race condition where a health check may run before the application is fully ready, producing false negatives.

The most concerning failure mode in a fully automated run is a silent partial rollout failure, where:

New pods are created successfully
Old pods are terminated
But new pods never become truly healthy
The pipeline incorrectly passes because the deployment step succeeded, not because the system is functional

This becomes more dangerous in production-like environments because CI/CD systems often trust “resource created successfully” as success, even when runtime readiness is still unstable. A robust solution would require readiness probes, retry-aware health checks, and explicit rollout verification (kubectl rollout status) before marking the pipeline successful.

2. Technical rewrite and translation trade-off

A simplified prose sentence from the comparison document could be:

“The Kubernetes-based deployment improves reliability through declarative state management and automated reconciliation.”

If rewritten in technical engineering language for an audience like Tendo, it becomes:

“The Deployment controller continuously reconciles the ReplicaSet state, ensuring desired pod replicas match actual cluster state through control-loop convergence.”

What is gained in translation to technical language:
Higher precision and correctness in describing system behavior
Clear mapping to Kubernetes internals (controllers, ReplicaSets, reconciliation loops)
Better alignment with engineering discussions and debugging contexts
What is lost:
Accessibility for non-technical stakeholders
Readability and narrative flow
The intuitive understanding of “what changed” without requiring prior Kubernetes knowledge

In essence, plain language optimizes communication, while technical language optimizes correctness and operational clarity.

3. Hardcoded values in the Deployment manifest (and why they matter)

Week 8’s architecture already demonstrates a shift from “scripted deployment” (Week 7 style) to “state-driven deployment” using Kubernetes. However, the main gap remains configuration externalization and full pipeline observability under failure conditions.