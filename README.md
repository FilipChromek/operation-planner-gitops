## Štruktúra


```
apps/
  orp-or-planner-ufe/      # frontend (Stencil micro-FE)
  orp-or-planner-webapi/   # backend (Go + MongoDB)
infrastructure/
  fluxcd/                  # FluxCD operator install
  envoy-gateway/           # Gateway API + GatewayClass + Gateway
  polyfea/                 # Polyfea controller + md-shell + HTTPRoute
components/
  mongodb/                 # MongoDB deployment + auth secret
  version-developers/      # image policy markers (auto-update)
  version-release/         # pinned versions for production
clusters/
  localhost/               # local dev (Docker Desktop K8s)
    prepare/               # FluxCD + Envoy Gateway + Polyfea
    install/               # apps + mongodb (dev)
    secrets/               # repository PAT (gitignored)
    gitops/                # FluxCD GitRepository / Kustomizations / image-update
  wac-aks/                 # production (shared Azure cluster)
    install/               # apps + version-release component
    gitops/                # GitRepository / Kustomizations / project status
```

