class Storage
{
	constructor(identificador)
	{
		this.identificador = identificador;
	}
	getData()
	{
		return JSON.parse(localStorage[this.identificador])
	}
	setData(valor)
	{
		localStorage[this.identificador] = JSON.stringify(valor);
	}
}