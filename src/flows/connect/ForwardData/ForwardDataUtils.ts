export interface ForwardDataSnippet {
  title: string;
  code: string;
}

interface CreateForwardDataSnippetsOptions {
  connectionName?: string;
  url?: string;
}

const DEFAULT_COLLECTOR_NAMESPACE = "mdai";
const collectorNamePlaceholder = "<collector_name>";
const datadogSitePlaceholder = "<dd_site>.datadoghq.com";

function createCollectorEndpoint(connectionName?: string) {
  const collectorName = connectionName || collectorNamePlaceholder;

  return `http://${collectorName}-collector.${DEFAULT_COLLECTOR_NAMESPACE}.svc.cluster.local:8126`;
}

export function createForwardDataSnippets({
  connectionName,
  url,
}: CreateForwardDataSnippetsOptions): ForwardDataSnippet[] {
  const collectorEndpoint = createCollectorEndpoint(connectionName);
  const datadogSite = url || datadogSitePlaceholder;

  return [
    {
      title: "Metrics only",
      code: `datadog:
  dd_url: ${collectorEndpoint}`,
    },
    {
      title: "Logs only",
      code: `datadog:
  logs:
    enabled: true
    containerCollectAll: true
  env:
    - name: DD_LOGS_CONFIG_LOGS_DD_URL
      value: "${collectorEndpoint}"
    # Send logs over HTTP when routing through a gateway / proxy / collector
    - name: DD_LOGS_CONFIG_USE_HTTP
      value: "true"
    # Stronger setting to ensure the agent stays on HTTP(S) transport
    - name: DD_LOGS_CONFIG_FORCE_USE_HTTP
      value: "true"
    # Recommended for high-volume log traffic
    - name: DD_LOGS_CONFIG_USE_COMPRESSION`,
    },
    {
      title: "Traces only",
      code: `datadog:
  apm:
    # Enable this only if applications send traces to the agent over TCP:8126
    # If applications use the default Datadog Unix socket instead, portEnabled is optional
    portEnabled: true
    port: 8126

  env:
    - name: DD_APM_DD_URL
      value: "${collectorEndpoint}"`,
    },

    {
      title: "All data types",
      code: `datadog:
  apiKeyExistingSecret: datadog-secret
  clusterName: <cluster_name>
  site: ${datadogSite}

  # Metrics / events / service checks are forwarded here instead of Datadog intake.
  # Your collector or gateway must understand Datadog intake formats.
  dd_url: ${collectorEndpoint}

  kubelet:
    # Useful in dev/test clusters with self-signed kubelet certs.
    # Avoid disabling verification in production unless you need to.
    tlsVerify: false

  tags:
    - "cluster:<cluster_name>"
    - "env:<env_name>"

  logs:
    enabled: true

    # Collect logs from all containers by default.
    # Required if you want DD_CONTAINER_INCLUDE_LOGS / EXCLUDE_LOGS to apply.
    containerCollectAll: true

  apm:
    # Needed only if applications send traces to the agent over TCP:8126.
    # If applications use the Datadog Unix socket, this is optional.
    portEnabled: true
    port: 8126

  env:
    # ------------------------------
    # TRACE FORWARDING
    # ------------------------------
    - name: DD_APM_DD_URL
      value: "${collectorEndpoint}"

    # Only use this if your internal endpoint is HTTP, self-signed, or otherwise
    # requires relaxed certificate validation.
    - name: DD_SKIP_SSL_VALIDATION
      value: "true"

    # ------------------------------
    # LOG FORWARDING
    # ------------------------------
    - name: DD_LOGS_CONFIG_LOGS_DD_URL
      value: "${collectorEndpoint}"

    # Recommended when sending logs through a gateway / proxy / collector
    - name: DD_LOGS_CONFIG_USE_HTTP
      value: "true"
    - name: DD_LOGS_CONFIG_FORCE_USE_HTTP
      value: "true"

    # Compress logs to reduce bandwidth usage
    - name: DD_LOGS_CONFIG_USE_COMPRESSION
      value: "true"

    # ------------------------------
    # LOG FILTERING STRATEGY
    # ------------------------------

    # Example allow-list:
    # collect logs only from the "synthetics" namespace
    - name: DD_CONTAINER_INCLUDE_LOGS
      value: "kube_namespace:^synthetics$"

    # Exclude everything else; INCLUDE rules take precedence over EXCLUDE
    - name: DD_CONTAINER_EXCLUDE_LOGS
      value: "kube_namespace:.*"

    # ------------------------------
    # HOW TO ADJUST THIS
    # ------------------------------
    #
    # Option A: Allow-list specific namespaces
    #   Keep both INCLUDE and EXCLUDE
    #   Result: only explicitly allowed namespaces send logs
    #
    # Option B: Deny-list only noisy/system namespaces
    #   Remove INCLUDE and set EXCLUDE to something like:
    #   kube_namespace:^(kube-system|datadog)$
    #   Result: most workloads send logs except excluded namespaces
    #
    # Option C: Collect everything
    #   Remove both INCLUDE and EXCLUDE
    #   Result: useful for debugging, but noisy and expensive
    #
    # Option D: Fine-grained filtering
    #   Filter on namespace, container name, image, or labels
    #   Example:
    #   kube_namespace:^prod$ kube_container_name:^api$
    #

    # ------------------------------
    # METRICS / APM DISCOVERY FILTERING
    # ------------------------------
    # This does NOT control logs.
    # It affects workload discovery for metrics/APM-related collection.
    - name: DD_KUBERNETES_EXCLUDE_NAMESPACE
      value: "kube-system|<app_namespace>|datadog"

    # ------------------------------
    # WHEN YOU MAY WANT TO CHANGE THIS
    # ------------------------------
    #
    # Keep exclusions if:
    #   - you want to reduce noise or cardinality
    #   - you only care about application namespaces
    #
    # Remove or reduce exclusions if:
    #   - you need kube-system telemetry
    #   - you are troubleshooting cluster internals
    #
    # Important:
    # DD_KUBERNETES_EXCLUDE_NAMESPACE does not stop logs by itself.
    # Logs are controlled separately by DD_CONTAINER_INCLUDE_LOGS /
    # DD_CONTAINER_EXCLUDE_LOGS.
    #

  dogstatsd:
    port: 8125

    # Expose DogStatsD on the host for applications outside the agent pod
    useHostPort: true

    # Allow DogStatsD traffic from outside the local node interface
    nonLocalTraffic: true`,
    },
  ];
}
