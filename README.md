# Thai-Dialect-Frontend-JS

build : docker build -t seksuu/dialect-unauth-front .
push : docker push seksuu/dialect-unauth-front
k8s create ns (opt) : kubectl create namespace cmkl
k8s get ns (opt) : kubectl get namespace
k8s set deploy : kubectl apply -f deployment.yaml -n cmkl
k8s get deploy : kubectl get deploy -n cmkl
k8s proxy : kubectl port-forward deployment/dialect-unauth-dep -n cmkl 3001:3001
k8s set service : kubectl apply -f service.yaml -n cmkl
k8s get service : kubectl get service -n cmkl
k8s set ingress : kubectl apply -f ingress.yaml -n cmkl --validate=false
