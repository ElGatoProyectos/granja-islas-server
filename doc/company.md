[<span style="color:white; font-size:18px">Volver al inicio</span>](../readme.md)

## <span >Empresas</span>

## <span style="color:green">GET</span>

Api para la gestion de empresas

### Listar todo excepto los eliminados

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>
<span style="background-color:coral; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">ADMINISTRADOR</span>
<span style="background-color:brown; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">USUARIO</span>

```
GET localhost:4000/api/companies
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

### Listar todo con los eliminados

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>

```
GET localhost:4000/api/companies/all
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

### Empresa por id

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>
<span style="background-color:coral; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">ADMINISTRADOR</span>
<span style="background-color:brown; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">USUARIO</span>

```
GET localhost:4000/api/companies/:id
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

## <span style="color:green">POST</span>

### Crear empresa

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>

```
POST localhost:4000/api/companies
```

Campos requeridos, para consulta rapida por RUC tienes que consultar la [Api SUNAT](./sunat.md)
<br/>
Cabe recalcar que el formato de envio es multipart-form-data, se envie o no imagen se tiene que respetar el formato.

```js
{
  business_name: "",
  business_type: "",
  business_status: "",
  business_direction_fiscal: "",
  business_user: "",
  phone: "",
  country_code: "",
  ruc: "",
  key: "",
	"company-profile":File,
}
```

Respuesta

```js
{
	error:true|false,
	statusCode:201|400|500,
	message:"",
	payload:{}
}
```

## <span style="color:green">PATCH</span>

### Modifciar empresa

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>

```
POST localhost:4000/api/companies
```

Campos requeridos, para consulta rapida por RUC tienes que consultar la [Api SUNAT](./sunat.md)
<br/>
Cabe recalcar que el formato de envio es multipart-form-data, se envie o no imagen se tiene que respetar el formato.

```js
{
  business_name: "",
  business_type: "",
  business_status: "",
  business_direction_fiscal: "",
  business_user: "",
  phone: "",
  country_code: "",
  ruc: "",
  key: "",
	"company-profile":File,
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
