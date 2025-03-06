<div align="center">
  <h1>Webshop Demo Cloud</h1>
  <p>A demo e-commerce application developed with Angular(Frontend),Spring Boot(backend) and MySQL(Database) is included in the repository. </p>
</div>


## Technologies Used

- **Backend:** Angular with RESTful APIs.
- **Frontend:** Spring Boot, swagger for interactive API documentation.
- **Database:** MySQL.
- **Tools:** Docker and Docker Compose used for containerization.

## Demo URLs

### Frontend Url

- [https://webshop-demo.westeurope.cloudapp.azure.com/](https://webshop-demo.westeurope.cloudapp.azure.com/)

### Backend Url

- [https://webshop-demo.westeurope.cloudapp.azure.com:8082/swagger-ui/index.html](https://webshop-demo.westeurope.cloudapp.azure.com:8082/swagger-ui/index.html)

## Up and Run 

Clone the repository and run the backend:

```sh
git clone https://github.com/prnb22/webshop-demo-cloud
cd webshop-demo-cloud/backend
docker compose up -d --build
```

Your backend's swagger ui will be running at: [http://localhost:8082/swagger-ui/index.html#/](http://localhost:8082/swagger-ui/index.html#/)

In another terminal, run the frontend

```sh
cd webshop-demo-cloud/frontend
docker compose up -d --build
```

Your frontend will be running at: [http://localhost:80](http://localhost:80)