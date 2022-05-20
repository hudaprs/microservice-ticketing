# Generate JWT Key

```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

# Port Forwarding Some Pod

1.  List all of pods

```shell
kubectl get pods
```

2. Get pod that you want to port forward

```shell
kubectl port-forward <pod-name> your-port:pod-port
```

# Build Auth Service

```shell
docker build -t hudaprasetyo/udemy-microservice-ticketing/auth .
```

# Build Ticket Service

```shell
docker build -t hudaprasetyo/udemy-microservice-ticketing/ticket .
```
