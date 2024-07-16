[<span style="color:white; font-size:18px">Volver al inicio</span>](../readme.md)

## <span >API GENERAL SUNAT</span>

## <span style="color:green">GET</span>

### Buscar por ruc

<span style="background-color:green; border-radius:4px; font-size:12px; padding-inline:4px; cursor:pointer ">SUPER ADMINISTRADOR</span>

```
GET localhost:4000/api/sunat/ruc/:ruc
```

Respuesta

```js
{
	error:true|false,
	statusCode:200|500,
	message:"",
	payload:{}
}
```
