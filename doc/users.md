[<span style="color:white; font-size:18px">Volver al inicio</span>](../readme.md)

## <span >Api general de usuarios</span>

## <span style="color:green">GET</span>

Apis con respecto a los usuarios user user, admin, superadmin

### Listar usuarios no superadmin

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>
<span style="background-color:coral; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">ADMINISTRADOR</span>

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

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>
<span style="background-color:coral; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">ADMINISTRADOR</span>

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

## <span style="color:red">POST</span>

### Registrar usuario

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>
<span style="background-color:coral; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">ADMINISTRADOR</span>

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

## <span style="color:red">PATCH</span>

### Modificar usuario | admin

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>
<span style="background-color:coral; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">ADMINISTRADOR</span>

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
	payload:{}
}
```

### Modificar superadministrador

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>

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

## <span style="color:red">DELETE</span>

### Eliminar usuario

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>
<span style="background-color:coral; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">ADMINISTRADOR</span>

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
	payload:{}
}
```
