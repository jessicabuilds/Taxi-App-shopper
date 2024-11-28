# Documentação da API - App de Táxi

Esta documentação descreve os endpoints implementados no backend da aplicação de táxi, conforme definido no teste técnico.

## Endpoints

### 1. **POST /ride/estimate**
Responsável por calcular o valor estimado de uma corrida.

#### Request Body
```json
{
  "customer_id": "string",
  "origin": "string",
  "destination": "string"
}
```

#### Validações
- `customer_id`, `origin` e `destination` não podem estar em branco.
- `origin` e `destination` não podem ser iguais.

#### Resposta Sucesso (200)
```json
{
  "origin": {
    "latitude": "number",
    "longitude": "number"
  },
  "destination": {
    "latitude": "number",
    "longitude": "number"
  },
  "distance": "number",
  "duration": "string",
  "options": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "vehicle": "string",
      "review": {
        "rating": "number",
        "comment": "string"
      },
      "value": "number"
    }
  ],
  "routeResponse": "object"
}
```

#### Resposta Erro
- **400 - Dados inválidos**
```json
{
  "error_code": "INVALID_DATA",
  "error_description": "string"
}
```

---

### 2. **PATCH /ride/confirm**
Responsável por confirmar uma corrida e gravá-la no histórico.

#### Request Body
```json
{
  "customer_id": "string",
  "origin": "string",
  "destination": "string",
  "distance": "number",
  "duration": "string",
  "driver": {
    "id": "number",
    "name": "string"
  },
  "value": "number"
}
```

#### Validações
- `customer_id`, `origin`, `destination`, `driver` e `distance` não podem estar em branco.
- O motorista informado deve ser válido.
- A distância deve ser compatível com o motorista escolhido.

#### Resposta Sucesso (200)
```json
{
  "success": true
}
```

#### Resposta Erro
- **400 - Dados inválidos**
```json
{
  "error_code": "INVALID_DATA",
  "error_description": "string"
}
```
- **404 - Motorista não encontrado**
```json
{
  "error_code": "DRIVER_NOT_FOUND",
  "error_description": "string"
}
```
- **406 - Distância inválida**
```json
{
  "error_code": "INVALID_DISTANCE",
  "error_description": "string"
}
```

---

### 3. **GET /ride/{customer_id}?driver_id={id}**
Lista as corridas realizadas por um usuário.

#### Query Parameters
- `driver_id` (opcional): Filtra as corridas realizadas com o motorista especificado.

#### Validações
- `customer_id` não pode estar em branco.
- Se informado, `driver_id` deve ser válido.

#### Resposta Sucesso (200)
```json
{
  "customer_id": "string",
  "rides": [
    {
      "id": "number",
      "date": "datetime",
      "origin": "string",
      "destination": "string",
      "distance": "number",
      "duration": "string",
      "driver": {
        "id": "number",
        "name": "string"
      },
      "value": "number"
    }
  ]
}
```

#### Resposta Erro
- **400 - Motorista inválido**
```json
{
  "error_code": "INVALID_DRIVER",
  "error_description": "string"
}
```
- **404 - Nenhum registro encontrado**
```json
{
  "error_code": "NO_RIDES_FOUND",
  "error_description": "string"
}
```

---

## Integração com a API do Google Maps
- **Documentação oficial**: [Google Maps API Routes](https://developers.google.com/maps/documentation/routes/overview?hl=pt-br)

## Considerações
- A aplicação deve ser dockerizada e configurada para rodar com `docker-compose`.
- O backend deve estar exposto na porta **8080**.

---

## Requisitos Técnicos
- Node.js com TypeScript.
- Utilização do Google Maps API.
- Código limpo e com boas práticas.
