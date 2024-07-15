[<span style="color:white; font-size:18px">Volver al inicio</span>](../readme.md)

## <span style="color:green">Autenticación y autorización</span>

Autenticación y autorización para el consumo de apis.

### Login

```
POST localhost:4000/api/auth/login
```

Campos requeridos

```js
{
	username:"",
	password:"",
}
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|401,
	message:"",
	payload:{
		user:{},
		token:""
	}
}
```

## <span style="color:green">Auth</span>

Autenticación a cualquier api en general

```
POST localhost:4000/api/*
```

Header

```js
Authorization: Bearer <token>
```
