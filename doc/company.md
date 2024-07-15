[<span style="color:white; font-size:18px">Volver al inicio</span>](../readme.md)

## <span style="color:green">Empresas</span>

Api para la gestion de empresas (solo superadministrador).

### Listar todo

```
POST localhost:4000/api/companies
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|500,
	message:"",
	payload:{
		user:{},
		token:""
	}
}
```

### Empresa por id

```
POST localhost:4000/api/companies/:id
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|404|500,
	message:"",
	payload:{
		user:{},
		token:""
	}
}
```
