[<span style="color:white; font-size:18px">Volver al inicio</span>](../readme.md)

## <span style="color:green">Users</span>

Apis con respecto a los usuarios user user, admin, superadmin

### Listar usuarios no superadmin

```
GET localhost:4000/api/users
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|500,
	message:"",
	payload:[{}]
}
```

### Usuario por id

```
GET localhost:4000/api/users/:id
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|404,500,
	message:"",
	payload:{}
}
```

### Registrar usuario

```
POST localhost:4000/api/users
```

Campos requeridos, la contrasena se genera y seria el dni

```js
{
	name:"",
	last_name:"",
	phone?:"",
	country_code?:"",
	email?:"",
	dni:"",
}
```

Respuesta

```js
{
	error:true|false,
	statusCode:201|500,
	message:"",
	payload:any
}
```

### Modificar usuario | admin

```
PATCH localhost:4000/api/users/:id
```

Campos requeridos

```js
{
	role:""
	name:"",
	last_name:"",
	phone?:"",
	country_code?:"",
	email?:"",
	dni:"",
	password?:""
}
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|404|500,
	message:"",
	payload:any
}
```

### Modificar superadministrador

```
PATCH localhost:4000/api/users/:id
```

Campos requeridos

```js
{
	name:"",
	last_name:"",
	phone?:"",
	country_code?:"",
	email?:"",
	dni:"",
	password?:""
}
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|404|500,
	message:"",
	payload:any
}
```

### Eliminar usuario

Esto no funciona para el superadministrador

```
DELETE localhost:4000/api/users/:id
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|400|404|500,
	message:"",
	payload:any
}
```
