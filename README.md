# Generate JWT Key

```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

# Generate Stripe Secret

```shell
kubectl create secret generic stripe-secret --from-literal=STRIPE_SECRET={YOUR_SECRET_STRIPE}
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

# Execute Running Pod

```shell
kubectl exec -it <pod-name> sh
```

# Build Auth Service

```shell
docker build -t hudaprasetyo/udemy-microservice-ticketing/auth .
```

# Build Ticket Service

```shell
docker build -t hudaprasetyo/udemy-microservice-ticketing/ticket .
```

# Build Order Service

```shell
docker build -t hudaprasetyo/udemy-microservice-ticketing/order .
```

# Build Expiration Service

```shell
docker build -t hudaprasetyo/udemy-microservice-ticketing/expiration .
```

# Build Payment Service

```shell
docker build -t hudaprasetyo/udemy-microservice-ticketing/payment .
```
