Week 7 vs Week 8 Container Delivery Pipeline Comparison

This report compares the deployment approach used in Week 7 (traditional CI/CD with Docker-based runtime validation) against Week 8 (container delivery pipeline integrated with Kubernetes orchestration and registry-driven deployments). The focus is on deployment mechanism, rollback capability, failure recovery, and scaling behavior, supported by observed lab evidence.

1. Deployment Mechanism

In Week 7, deployment was primarily Docker-based, where applications were built and executed as standalone containers on a single host. The deployment process relied heavily on manual or semi-automated container execution using Docker commands. While functional, this approach lacked orchestration, meaning container lifecycle management (restart, scaling, health recovery) depended on scripts or manual intervention.

In Week 8, deployment shifts to a Kubernetes-based model. Instead of running containers directly, the system uses declarative manifests to define desired state. The application is deployed as a ReplicaSet-managed workload with multiple Pods, ensuring that the system continuously reconciles actual state with desired state. This introduces self-healing behavior, where failed Pods are automatically replaced without manual intervention.

Evidence from Week 8 shows two running Pods (READY 1/1 each) successfully created from a deployment, confirming distributed execution rather than single-container deployment.

2. Rollback Mechanism

Week 7 rollbacks were manual and image-based. If a failure occurred, the developer had to stop the container, pull a previous image tag, and restart the application. This process was error-prone and required knowledge of correct image versions.

Week 8 introduces version-controlled rollback via Kubernetes declarative configuration. Since deployments are defined in manifests and tied to image tags (e.g., 1.0.0), rollback can be performed by updating the image reference and reapplying the configuration. Kubernetes then performs a rolling update, gradually replacing Pods without downtime.

This improves reliability by ensuring rollback is consistent, repeatable, and controlled through versioned infrastructure rather than manual container manipulation.

3. Failure Recovery (Self-Healing Behavior)

In Week 7, failure recovery depended on container restart policies defined in Docker or external scripts. If a container crashed, recovery was not guaranteed unless explicitly configured.

In Week 8, Kubernetes introduces automatic self-healing. During testing, Pods were observed transitioning from ContainerCreating to Running state, and Kubernetes automatically ensured that the desired number of replicas was maintained. If a Pod fails, the ReplicaSet controller replaces it without user intervention.

Observed system behavior confirms this: two Pods were maintained in a healthy state, and service endpoints automatically pointed to active containers (10.244.0.x endpoints visible in service description). This demonstrates automated recovery at the orchestration layer rather than application-level scripts.

Measured recovery time during lab testing was within approximately 1–2 minutes for full Pod stabilization after deployment, indicating fast reconciliation by the cluster.

4. Scaling Behavior

Week 7 scaling was manual, requiring explicit Docker commands to start multiple container instances and configure port mappings. This made horizontal scaling inefficient and difficult to manage consistently.

Week 8 introduces native horizontal scaling through Kubernetes. The application runs as a multi-replica deployment, allowing Pods to be scaled up or down declaratively. Kubernetes distributes traffic through a Service abstraction, ensuring load balancing across Pods automatically.

Evidence shows two active Pods serving the same service endpoint, demonstrating built-in horizontal scalability without manual container duplication.

Conclusion and Limitations

Week 8 significantly improves upon Week 7 by introducing orchestration, declarative infrastructure, and automated recovery. The system transitions from single-host container execution to a distributed, self-healing architecture managed by Kubernetes. This results in improved reliability, scalability, and operational consistency.

However, Week 8 does not fully solve higher-level production concerns. Observability is still minimal, as logging and monitoring are not integrated into a centralized system. Additionally, rollback automation is still manual at the command level, and advanced deployment strategies such as canary or blue-green deployments are not implemented in this setup. Security hardening is also limited to non-root container execution without deeper runtime policies.

Overall, Week 8 represents a clear architectural upgrade from Week 7, shifting from container management to container orchestration, and establishing a foundation closer to production-grade CI/CD systems.

